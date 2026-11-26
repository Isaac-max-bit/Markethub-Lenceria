import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Mail,
  MapPin,
  Phone,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { obtenerClientes } from "../../api/admin";
import { normalizarTexto } from "../../api/catalogo";
import { cerrarSesion } from "../../api/sesion";
import { Kpi } from "../components/Tarjetas";
import Ventana from "../components/Ventana";

const POR_PAGINA = 10;
const DIAS_NUEVO = 30;

const fechaLarga = new Intl.DateTimeFormat("es-CO", { dateStyle: "long" });
const fechaCorta = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const ROLES = {
  cliente: "Cliente",
  vendedor: "Vendedor",
  admin: "Administrador",
};

const rolDe = (usuario) => String(usuario.rol || "").toLowerCase();

// Compras como invitado con un correo que ya era de una cuenta real: el backend
// guarda un correo inventado (@markethub.local) y deja el verdadero al inicio
// de la dirección con el formato "Correo: x@y.com · ...".
const DOMINIO_INVITADO = "@markethub.local";
const CORREO_EN_DIRECCION = /^Correo:\s*(\S+)\s*·\s*/;

const contactoDe = (usuario) => {
  const invitado = String(usuario.email || "").endsWith(DOMINIO_INVITADO);
  const direccion = usuario.direccion || "";
  const coincidencia = invitado ? direccion.match(CORREO_EN_DIRECCION) : null;

  return {
    email: coincidencia ? coincidencia[1] : invitado ? "" : usuario.email,
    direccion: coincidencia ? direccion.replace(CORREO_EN_DIRECCION, "") : direccion,
  };
};

const formatoFecha = (valor, formato = fechaCorta) => {
  const fecha = valor ? new Date(valor) : null;
  return fecha && !Number.isNaN(fecha.getTime()) ? formato.format(fecha) : "—";
};

function Dato({ icono: Icono, etiqueta, valor, enlace }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-act text-dusty-rose">
        <Icono size={16} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
          {etiqueta}
        </p>
        {valor && enlace ? (
          <a
            href={enlace}
            className="mt-0.5 block break-words text-sm text-ink hover:text-accent"
          >
            {valor}
          </a>
        ) : (
          <p className="mt-0.5 break-words text-sm text-ink">{valor || "—"}</p>
        )}
      </div>
    </div>
  );
}

function DetalleCliente({ cliente, onCerrar }) {
  const contacto = contactoDe(cliente);

  return (
    <Ventana
      titulo={cliente.nombre}
      descripcion={`${ROLES[rolDe(cliente)] ?? "Usuario"} · cliente desde ${formatoFecha(
        cliente.fecha_registro,
        fechaLarga,
      )}`}
      onCerrar={onCerrar}
      ancho="max-w-lg"
    >
      <div className="space-y-5 px-6 py-5">
        <Dato
          icono={Mail}
          etiqueta="Correo"
          valor={contacto.email || "No disponible"}
          enlace={contacto.email ? `mailto:${contacto.email}` : null}
        />
        <Dato
          icono={Phone}
          etiqueta="Teléfono"
          valor={cliente.telefono}
          enlace={cliente.telefono ? `tel:${cliente.telefono}` : null}
        />
        <Dato
          icono={MapPin}
          etiqueta="Dirección de envío"
          valor={contacto.direccion}
        />
      </div>

      <footer className="flex justify-end border-t border-border px-6 py-4">
        <button
          type="button"
          onClick={onCerrar}
          className="h-11 border border-border px-5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Cerrar
        </button>
      </footer>
    </Ventana>
  );
}

export default function Clientes() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [rol, setRol] = useState("cliente");
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [seleccionado, setSeleccionado] = useState(null);
  const [ahora] = useState(() => Date.now());

  const cargar = useCallback(
    async (signal) => {
      setCargando(true);
      setError("");

      try {
        const lista = await obtenerClientes({ signal });
        if (signal?.aborted) return;
        setUsuarios(Array.isArray(lista) ? lista : []);
      } catch (errorCarga) {
        if (errorCarga?.name === "AbortError") return;

        if (errorCarga?.estado === 401) {
          cerrarSesion();
          navigate("/login", { replace: true });
          return;
        }

        setError(
          errorCarga?.estado === 403
            ? "Esta sección es solo para administradores."
            : errorCarga?.message ||
                "No se pudieron cargar los clientes. Revisa que el backend esté encendido.",
        );
      } finally {
        if (!signal?.aborted) setCargando(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    const controlador = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar(controlador.signal);
    return () => controlador.abort();
  }, [cargar]);

  const resumen = useMemo(() => {
    const clientes = usuarios.filter((u) => rolDe(u) === "cliente");
    const limite = ahora - DIAS_NUEVO * 24 * 60 * 60 * 1000;

    return {
      total: clientes.length,
      nuevos: clientes.filter(
        (u) => u.fecha_registro && new Date(u.fecha_registro).getTime() >= limite,
      ).length,
      conDireccion: clientes.filter((u) => u.direccion).length,
    };
  }, [usuarios, ahora]);

  const filtrados = useMemo(() => {
    const termino = normalizarTexto(busqueda);

    return usuarios
      .filter((u) => rol === "todos" || rolDe(u) === rol)
      .filter(
        (u) =>
          !termino ||
          normalizarTexto(
            `${u.nombre} ${u.email} ${contactoDe(u).email} ${u.telefono ?? ""}`,
          ).includes(
            termino,
          ),
      )
      .sort(
        (a, b) =>
          new Date(b.fecha_registro || 0) - new Date(a.fecha_registro || 0),
      );
  }, [usuarios, busqueda, rol]);

  const lista = filtrados.slice(0, visibles);

  return (
    <section className="space-y-5">
      <header>
        <h1 className="font-display text-[28px] font-semibold text-ink">
          Clientes
        </h1>
        <p className="mt-1 text-base text-muted">
          {resumen.total} clientes registrados · {resumen.nuevos} nuevos en los
          últimos {DIAS_NUEVO} días
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-dusty-rose/40 bg-card px-4 py-3 text-sm text-accent"
        >
          <AlertCircle size={17} strokeWidth={1.8} className="mt-0.5" />
          {error}
        </div>
      )}

      <div className="grid gap-3.5 md:grid-cols-3">
        <Kpi
          etiqueta="Clientes"
          valor={resumen.total}
          icono={Users}
          tono="bg-dusty-rose text-white"
        />
        <Kpi
          etiqueta={`Nuevos (${DIAS_NUEVO} días)`}
          valor={resumen.nuevos}
          icono={UserPlus}
          tono="bg-[#e9a9a6] text-plum"
        />
        <Kpi
          etiqueta="Con dirección"
          valor={resumen.conDireccion}
          icono={MapPin}
          tono="bg-vino text-silk"
        />
      </div>

      <article className="overflow-hidden rounded-lg border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              Todos los clientes
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {filtrados.length} de {usuarios.length} usuarios
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative sm:w-64">
              <Search
                size={17}
                strokeWidth={1.7}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                value={busqueda}
                onChange={(evento) => {
                  setBusqueda(evento.target.value);
                  setVisibles(POR_PAGINA);
                }}
                placeholder="Buscar nombre, correo o teléfono..."
                aria-label="Buscar clientes"
                className="h-10 w-full border border-border bg-page pl-10 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
              />
            </div>

            <select
              value={rol}
              onChange={(evento) => {
                setRol(evento.target.value);
                setVisibles(POR_PAGINA);
              }}
              aria-label="Filtrar por rol"
              className="h-10 border border-border bg-page px-3 text-sm text-ink outline-none transition-colors focus:border-accent sm:w-44"
            >
              <option value="cliente">Clientes</option>
              <option value="vendedor">Vendedores</option>
              <option value="admin">Administradores</option>
              <option value="todos">Todos los usuarios</option>
            </select>
          </div>
        </header>

        {cargando ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, indice) => (
              <div key={indice} className="px-5 py-4">
                <div className="h-12 animate-pulse rounded-md bg-border" />
              </div>
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-act text-dusty-rose">
              <Users size={30} strokeWidth={1.5} />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-ink">
              {usuarios.length === 0
                ? "Todavía no hay clientes"
                : "No encontramos coincidencias"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted">
              {usuarios.length === 0
                ? "Cuando alguien se registre o compre en la tienda aparecerá aquí."
                : "Prueba con otro nombre, correo o cambia el filtro de rol."}
            </p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {lista.map((cliente) => {
                const contacto = contactoDe(cliente);

                return (
                <li key={cliente.id_usuario}>
                  <button
                    type="button"
                    onClick={() => setSeleccionado(cliente)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-page/50 sm:gap-4"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-act font-display text-base font-semibold text-dusty-rose"
                    >
                      {cliente.nombre?.charAt(0).toUpperCase() || "?"}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[16px] font-semibold text-ink">
                        {cliente.nombre}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">
                        {[contacto.email || "Correo no disponible", cliente.telefono]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>

                    <span
                      className={`hidden shrink-0 px-[9px] py-1 text-[10px] uppercase tracking-[0.12em] sm:inline-flex ${
                        rolDe(cliente) === "cliente"
                          ? "bg-act text-ink"
                          : "bg-champagne/35 text-ink"
                      }`}
                    >
                      {ROLES[rolDe(cliente)] ?? "Usuario"}
                    </span>

                    <span className="hidden shrink-0 text-right text-xs text-muted md:block">
                      <span className="block uppercase tracking-[0.12em]">
                        Registro
                      </span>
                      <span className="mt-0.5 block text-ink">
                        {formatoFecha(cliente.fecha_registro)}
                      </span>
                    </span>
                  </button>
                </li>
                );
              })}
            </ul>

            {filtrados.length > visibles && (
              <div className="border-t border-border px-5 py-4 text-center">
                <button
                  type="button"
                  onClick={() => setVisibles((n) => n + POR_PAGINA)}
                  className="h-10 border border-border px-6 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  Mostrar más ({filtrados.length - visibles} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </article>

      {seleccionado && (
        <DetalleCliente
          cliente={seleccionado}
          onCerrar={() => setSeleccionado(null)}
        />
      )}
    </section>
  );
}

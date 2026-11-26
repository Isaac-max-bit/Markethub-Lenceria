import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, HelpCircle, MapPin, Package, ShieldCheck, Truck, User } from "lucide-react";
import { obtenerPedidos } from "../api/carrito";
import { aTarjeta, formatoPrecio } from "../api/catalogo";
import { actualizarUsuarioSesion, cerrarSesion, obtenerToken } from "../api/sesion";
import { actualizarPerfil } from "../api/usuarios";
import ProductCarousel from "../components/ProductCarousel";
import { useProductos } from "../hooks/useProductos";
import { useSesion } from "../hooks/useSesion";

const ICON = 1.25;

const dinero = (v) => formatoPrecio.format(Number(v) || 0);
const fechaLarga = new Intl.DateTimeFormat("es-CO", { dateStyle: "long" });
const fechaCorta = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" });

const etiqueta = "text-[10px] uppercase tracking-[0.22em] text-mauve";
const campoClase =
  "mt-1.5 w-full border border-border bg-white px-3 py-2.5 text-sm text-plum outline-none focus:border-wine";
const botonClase =
  "bg-wine px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-plum disabled:opacity-50";

const tono = (estado) => {
  const n = String(estado || "").toLowerCase();
  if (/cancel|rechaz/.test(n)) return "text-red-800";
  if (/entreg|complet/.test(n)) return "text-emerald-800";
  if (/envi|camino|despach/.test(n)) return "text-sky-800";
  return "text-wine";
};

/* ---------- piezas pequeñas ---------- */

function Foto({ item, className = "h-20 w-16" }) {
  const [fallo, setFallo] = useState(!item.imagen);
  return fallo ? (
    <div className={`${className} flex shrink-0 items-center justify-center bg-silk text-dusty-rose`}>♡</div>
  ) : (
    <img
      src={item.imagen}
      alt={item.nombre}
      loading="lazy"
      onError={() => setFallo(true)}
      className={`${className} shrink-0 object-cover`}
    />
  );
}

function TarjetaPedido({ pedido, activa, onClick, to, state }) {
  const contenido = (
    <>
      <div className="flex h-28 items-center justify-center gap-2 bg-cream">
        {pedido.items.slice(0, 3).map((i) => (
          <Foto key={i.id_detalle} item={i} />
        ))}
      </div>
      <div className="px-4 py-3">
        <p className={`text-sm font-semibold capitalize ${tono(pedido.estado)}`}>
          {(pedido.estado || "Sin estado").toLowerCase()}
        </p>
        <p className="mt-0.5 text-xs text-mauve">
          {fechaCorta.format(new Date(pedido.fecha))} · {pedido.cantidad}{" "}
          {pedido.cantidad === 1 ? "artículo" : "artículos"}
        </p>
        <p className="mt-1 text-xs font-medium text-plum">{dinero(pedido.total)}</p>
      </div>
    </>
  );
  const clase = `block w-full overflow-hidden border text-left transition-colors hover:border-wine ${
    activa ? "border-wine" : "border-border"
  }`;

  return to ? (
    <Link to={to} state={state} className={clase}>
      {contenido}
    </Link>
  ) : (
    <button type="button" onClick={onClick} aria-pressed={activa} className={clase}>
      {contenido}
    </button>
  );
}

function DetallePedido({ pedido }) {
  return (
    <div className="mt-5 border border-border bg-white px-5 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
        <p className="text-[10px] uppercase tracking-[0.26em] text-champagne">
          Pedido #{pedido.id_pedido} · {fechaLarga.format(new Date(pedido.fecha))}
        </p>
        <span className={`text-xs font-semibold capitalize ${tono(pedido.estado)}`}>
          {(pedido.estado || "Sin estado").toLowerCase()}
        </span>
      </div>
      <ul className="divide-y divide-border/70">
        {pedido.items.map((i) => (
          <li key={i.id_detalle} className="flex gap-4 py-4">
            <Foto item={i} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-plum">{i.nombre}</p>
              <p className="mt-1 text-xs text-mauve">
                {[i.color, i.talla && `Talla ${i.talla}`].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-1 text-xs text-mauve">
                {i.cantidad} × {dinero(i.precio_unitario)}
              </p>
            </div>
            <p className="text-sm text-wine">{dinero(i.subtotal)}</p>
          </li>
        ))}
      </ul>
      <p className="flex justify-between border-t border-border py-4 text-sm font-medium text-wine">
        <span>Total</span>
        <span>{dinero(pedido.total)}</span>
      </p>
    </div>
  );
}

// Estado de carga de los pedidos (se comparte entre el inicio y /pedidos).
function EstadoPedidos({ pedidos, error }) {
  if (error) return <p className="text-sm text-wine" role="alert">{error.message}</p>;
  if (!pedidos) return <p className="text-sm text-mauve">Cargando tus pedidos…</p>;
  if (pedidos.length === 0) {
    return (
      <div className="border border-dashed border-border px-6 py-12 text-center">
        <Package size={36} strokeWidth={ICON} className="mx-auto text-dusty-rose" aria-hidden="true" />
        <p className="mt-3 text-sm text-mauve">Aún no tienes pedidos.</p>
        <Link to="/productos" className={`${botonClase} mt-5 inline-block`}>
          Ver productos
        </Link>
      </div>
    );
  }
  return null;
}

/* ---------- plantilla de las sub-páginas ---------- */

function Pagina({ titulo, descripcion, children }) {
  return (
    <div>
      <Link to="/cuenta" className="inline-flex items-center gap-1 text-sm text-dusty-rose hover:text-wine">
        <ChevronLeft size={16} strokeWidth={ICON} aria-hidden="true" />
        Tu cuenta
      </Link>
      <h2 className="mt-3 font-heading text-3xl text-wine">{titulo}</h2>
      {descripcion && <p className="mt-1 text-sm text-mauve">{descripcion}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

// Muestra los datos y, al pulsar "Editar", un formulario que guarda en el backend.
function Editor({ usuario, lectura, campos, validar, armar, textoOk, textoEditar = "Editar" }) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [aviso, setAviso] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const abrir = () => {
    setForm({ ...usuario, password: "", repetir: "" });
    setAviso(null);
    setEditando(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    const problema = validar?.(form);
    if (problema) return setAviso({ ok: false, texto: problema });

    setGuardando(true);
    setAviso(null);
    try {
      actualizarUsuarioSesion(await actualizarPerfil(armar(form)));
      setEditando(false);
      setAviso({ ok: true, texto: textoOk });
    } catch (err) {
      setAviso({ ok: false, texto: err.message });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="border border-border p-6">
      {aviso && (
        <p role={aviso.ok ? "status" : "alert"} className={`mb-4 text-sm ${aviso.ok ? "text-dusty-rose" : "text-wine"}`}>
          {aviso.texto}
        </p>
      )}

      {editando ? (
        <form onSubmit={guardar} className="grid gap-5 sm:grid-cols-2">
          {campos.map(({ name, label, type = "text", ...resto }) => (
            <label key={name} className="block">
              <span className={etiqueta}>{label}</span>
              <input
                type={type}
                value={form[name] ?? ""}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className={campoClase}
                {...resto}
              />
            </label>
          ))}
          <div className="flex items-center gap-3 sm:col-span-2">
            <button type="submit" disabled={guardando} className={botonClase}>
              {guardando ? "Guardando…" : "Guardar"}
            </button>
            <button type="button" onClick={() => setEditando(false)} className="px-4 py-2.5 text-sm text-mauve hover:text-wine">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-6">
          <dl className="grid flex-1 gap-5 sm:grid-cols-2">
            {lectura(usuario).map(([k, v]) => (
              <div key={k}>
                <dt className={etiqueta}>{k}</dt>
                <dd className="mt-1 break-words text-sm text-plum">{v || "—"}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={abrir} className="text-sm text-dusty-rose hover:text-wine">
            {textoEditar}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- páginas ---------- */

const accesos = [
  { to: "/cuenta/pedidos", icon: Package, titulo: "Tus pedidos", texto: "Rastrea, revisa o consulta tus compras" },
  { to: "/cuenta/datos", icon: User, titulo: "Tus datos", texto: "Edita tu nombre, correo y teléfono" },
  { to: "/cuenta/direccion", icon: MapPin, titulo: "Tu dirección", texto: "Administra tu dirección de envío" },
  { to: "/cuenta/seguridad", icon: ShieldCheck, titulo: "Inicio de sesión y seguridad", texto: "Cambia tu contraseña" },
  { to: "/envios", icon: Truck, titulo: "Envíos y devoluciones", texto: "Tiempos, costos y cambios" },
  { to: "/preguntas-frecuentes", icon: HelpCircle, titulo: "Atención al cliente", texto: "Resuelve tus dudas" },
];

function Inicio({ pedidos, error }) {
  const { productos, cargando } = useProductos();
  const recomendados = (productos ?? []).slice(0, 12).map(aTarjeta);

  return (
    <div className="space-y-14">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accesos.map(({ to, icon: Icono, titulo, texto }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex h-full items-start gap-4 border border-border px-5 py-5 transition-colors hover:border-wine hover:bg-cream"
            >
              <Icono size={26} strokeWidth={ICON} className="mt-0.5 shrink-0 text-dusty-rose" aria-hidden="true" />
              <span>
                <span className="block text-sm font-medium text-plum">{titulo}</span>
                <span className="mt-1 block text-xs leading-relaxed text-mauve">{texto}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-2xl text-wine">Tus pedidos</h2>
          {pedidos?.length > 0 && (
            <Link to="/cuenta/pedidos" className="text-sm text-dusty-rose hover:text-wine">
              Ver todos
            </Link>
          )}
        </div>
        <div className="mt-4">
          <EstadoPedidos pedidos={pedidos} error={error} />
          {pedidos?.length > 0 && (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {pedidos.slice(0, 3).map((p) => (
                <li key={p.id_pedido}>
                  <TarjetaPedido pedido={p} to="/cuenta/pedidos" state={{ abrir: p.id_pedido }} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {!cargando && recomendados.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl text-wine">Te puede gustar</h2>
          <div className="mt-4">
            <ProductCarousel products={recomendados} label="Productos recomendados" />
          </div>
        </section>
      )}
    </div>
  );
}

function Pedidos({ pedidos, error }) {
  const ubicacion = useLocation();
  const [abierto, setAbierto] = useState(ubicacion.state?.abrir ?? null);
  const [filtro, setFiltro] = useState("todos");

  const estados = [...new Set((pedidos ?? []).map((p) => p.estado).filter(Boolean))];
  const lista = (pedidos ?? []).filter((p) => filtro === "todos" || p.estado === filtro);
  const seleccionado = pedidos?.find((p) => p.id_pedido === abierto);

  return (
    <Pagina titulo="Tus pedidos" descripcion="Selecciona un pedido para ver su detalle.">
      <EstadoPedidos pedidos={pedidos} error={error} />

      {pedidos?.length > 0 && (
        <>
          {estados.length > 1 && (
            <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
              {["todos", ...estados].map((e) => (
                <button
                  key={e}
                  type="button"
                  aria-pressed={filtro === e}
                  onClick={() => setFiltro(e)}
                  className={`border px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    filtro === e ? "border-wine bg-wine text-white" : "border-border text-mauve hover:border-wine hover:text-wine"
                  }`}
                >
                  {e === "todos" ? "Todos" : e.toLowerCase()}
                </button>
              ))}
            </div>
          )}

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {lista.map((p) => (
              <li key={p.id_pedido}>
                <TarjetaPedido
                  pedido={p}
                  activa={abierto === p.id_pedido}
                  onClick={() => setAbierto(abierto === p.id_pedido ? null : p.id_pedido)}
                />
              </li>
            ))}
          </ul>

          {seleccionado && <DetallePedido pedido={seleccionado} />}
        </>
      )}
    </Pagina>
  );
}

function Datos({ usuario }) {
  return (
    <Pagina titulo="Tus datos" descripcion="Así te identificamos en tus pedidos.">
      <Editor
        usuario={usuario}
        textoOk="Cambios guardados."
        lectura={(u) => [["Nombre", u.nombre], ["Correo", u.email], ["Teléfono", u.telefono]]}
        campos={[
          { name: "nombre", label: "Nombre completo", required: true },
          { name: "email", label: "Correo", type: "email", required: true },
          { name: "telefono", label: "Teléfono", type: "tel" },
        ]}
        validar={(f) => (f.nombre.trim() ? null : "El nombre es obligatorio.")}
        armar={(f) => ({ nombre: f.nombre, email: f.email, telefono: f.telefono })}
      />
    </Pagina>
  );
}

function Direccion({ usuario }) {
  return (
    <Pagina titulo="Tu dirección" descripcion="Se usará como predeterminada en tus próximos pedidos.">
      <Editor
        usuario={usuario}
        textoOk="Dirección guardada."
        textoEditar={usuario.direccion ? "Editar" : "Agregar"}
        lectura={(u) => [["Dirección de envío", u.direccion || "Aún no has agregado una dirección."]]}
        campos={[{ name: "direccion", label: "Dirección", placeholder: "Calle, número, barrio, ciudad" }]}
        armar={(f) => ({ direccion: f.direccion })}
      />
    </Pagina>
  );
}

function Seguridad({ usuario }) {
  return (
    <Pagina titulo="Inicio de sesión y seguridad" descripcion="Protege el acceso a tu cuenta.">
      <Editor
        usuario={usuario}
        textoOk="Contraseña actualizada."
        textoEditar="Cambiar contraseña"
        lectura={(u) => [["Correo de acceso", u.email], ["Contraseña", "••••••••"]]}
        campos={[
          { name: "password", label: "Nueva contraseña", type: "password", autoComplete: "new-password" },
          { name: "repetir", label: "Repetir contraseña", type: "password", autoComplete: "new-password" },
        ]}
        validar={(f) =>
          f.password.length < 8
            ? "La contraseña debe tener al menos 8 caracteres."
            : f.password !== f.repetir
              ? "Las contraseñas no coinciden."
              : null
        }
        armar={(f) => ({ password: f.password })}
      />
    </Pagina>
  );
}

/* ---------- contenedor: guarda la sesión, el menú lateral y las rutas ---------- */

const enlaceLateral = ({ isActive }) =>
  `block py-2 text-sm transition-colors ${isActive ? "font-medium text-wine" : "text-dusty-rose hover:text-wine"}`;

export default function Account() {
  const usuario = useSesion();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState(null);
  const [error, setError] = useState(null);

  const logueado = Boolean(usuario && obtenerToken());

  useEffect(() => {
    if (!logueado) return;
    const control = new AbortController();
    obtenerPedidos({ signal: control.signal })
      .then((d) => setPedidos(Array.isArray(d) ? d : []))
      .catch((e) => e.name !== "AbortError" && setError(e));
    return () => control.abort();
  }, [logueado]);

  if (!logueado) return <Navigate to="/login" replace state={{ desde: "/cuenta" }} />;

  const salir = () => {
    cerrarSesion();
    navigate("/home", { replace: true });
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[240px_1fr]">
      <aside>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-petal font-heading text-2xl text-wine">
            {usuario.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl leading-tight text-wine">Hola,</h1>
            <p className="truncate font-heading text-xl text-wine">{usuario.nombre}</p>
          </div>
        </div>
        {usuario.fecha_registro && (
          <p className="mt-3 text-xs text-mauve">
            Cliente desde {fechaLarga.format(new Date(usuario.fecha_registro))}
          </p>
        )}

        <nav aria-label="Tu cuenta" className="mt-8 hidden border-t border-border pt-4 lg:block">
          <p className="pb-2 text-[11px] uppercase tracking-[0.2em] text-plum">Enlaces directos</p>
          <NavLink to="/cuenta" end className={enlaceLateral}>Resumen</NavLink>
          <NavLink to="/cuenta/pedidos" className={enlaceLateral}>Tus pedidos</NavLink>
          <NavLink to="/cuenta/datos" className={enlaceLateral}>Tus datos</NavLink>
          <NavLink to="/cuenta/direccion" className={enlaceLateral}>Dirección de envío</NavLink>
          <NavLink to="/cuenta/seguridad" className={enlaceLateral}>Contraseña y seguridad</NavLink>
          <Link to="/productos" className="block py-2 text-sm text-dusty-rose hover:text-wine">Seguir comprando</Link>
          <button type="button" onClick={salir} className="mt-4 text-sm text-mauve underline hover:text-wine">
            Cerrar sesión
          </button>
        </nav>

        <button type="button" onClick={salir} className="mt-4 text-sm text-mauve underline hover:text-wine lg:hidden">
          Cerrar sesión
        </button>
      </aside>

      <div className="min-w-0">
        <Routes>
          <Route index element={<Inicio pedidos={pedidos} error={error} />} />
          <Route path="pedidos" element={<Pedidos pedidos={pedidos} error={error} />} />
          <Route path="datos" element={<Datos usuario={usuario} />} />
          <Route path="direccion" element={<Direccion usuario={usuario} />} />
          <Route path="seguridad" element={<Seguridad usuario={usuario} />} />
          <Route path="*" element={<Navigate to="/cuenta" replace />} />
        </Routes>
      </div>
    </div>
  );
}

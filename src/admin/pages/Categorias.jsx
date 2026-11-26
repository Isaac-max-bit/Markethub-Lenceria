import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Pencil, Plus, Search, Tags, Trash2 } from "lucide-react";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategorias,
} from "../../api/admin";
import { normalizarTexto } from "../../api/catalogo";
import { cerrarSesion } from "../../api/sesion";
import Aviso from "../components/Aviso";
import Ventana from "../components/Ventana";

const campoBase =
  "h-11 w-full border border-border bg-page px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent";

function FormularioCategoria({ categoria, onCerrar, onGuardado }) {
  const editando = Boolean(categoria?.id_tipo);
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async (evento) => {
    evento.preventDefault();
    setError("");

    const limpio = nombre.trim().replace(/\s+/g, " ");

    if (limpio.length < 2) {
      setError("Escribe un nombre de al menos 2 caracteres.");
      return;
    }

    if (limpio.length > 60) {
      setError("El nombre no puede superar los 60 caracteres.");
      return;
    }

    setGuardando(true);

    try {
      if (editando) {
        await actualizarCategoria(categoria.id_tipo, { nombre: limpio });
      } else {
        await crearCategoria({ nombre: limpio });
      }

      await onGuardado(
        editando
          ? "Categoría actualizada correctamente."
          : "Categoría creada correctamente.",
      );
    } catch (errorGuardado) {
      if (errorGuardado?.estado === 401) {
        cerrarSesion();
        return;
      }
      setError(errorGuardado?.message || "No se pudo guardar la categoría.");
      setGuardando(false);
    }
  };

  return (
    <Ventana
      titulo={editando ? "Renombrar categoría" : "Nueva categoría"}
      descripcion={
        editando
          ? "El nuevo nombre se verá en la tienda y en los productos."
          : "Agrupa productos del mismo tipo en una categoría."
      }
      onCerrar={guardando ? () => {} : onCerrar}
      ancho="max-w-md"
    >
      <form onSubmit={enviar}>
        <div className="px-6 py-5">
          <label
            htmlFor="categoria-nombre"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted"
          >
            Nombre
          </label>
          <input
            id="categoria-nombre"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Ej. Conjuntos"
            maxLength={60}
            autoFocus
            className={campoBase}
          />
          <p className="mt-1.5 text-right text-[11px] text-muted">
            {nombre.trim().length}/60
          </p>

          {error && (
            <p
              role="alert"
              className="mt-3 flex items-start gap-2 border border-dusty-rose/40 bg-page px-3 py-2 text-sm text-accent"
            >
              <AlertCircle size={16} strokeWidth={1.8} className="mt-0.5" />
              {error}
            </p>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
            className="h-11 border border-border px-5 text-sm text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="h-11 bg-dusty-rose px-6 text-sm font-medium text-white transition-colors hover:bg-wine disabled:opacity-60"
          >
            {guardando
              ? "Guardando..."
              : editando
                ? "Guardar cambios"
                : "Crear categoría"}
          </button>
        </footer>
      </form>
    </Ventana>
  );
}

function ConfirmarEliminarCategoria({ categoria, onCerrar, onEliminada }) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const confirmar = async () => {
    setEliminando(true);
    setError("");

    try {
      await eliminarCategoria(categoria.id_tipo);
      await onEliminada();
    } catch (errorEliminar) {
      if (errorEliminar?.estado === 401) {
        cerrarSesion();
        return;
      }
      setError(errorEliminar?.message || "No se pudo eliminar la categoría.");
      setEliminando(false);
    }
  };

  return (
    <Ventana
      titulo="Eliminar categoría"
      descripcion="Esta acción no se puede deshacer."
      onCerrar={eliminando ? () => {} : onCerrar}
      ancho="max-w-md"
    >
      <div className="px-6 py-5">
        <p className="text-sm text-ink">
          ¿Seguro que quieres eliminar{" "}
          <strong className="font-semibold">{categoria.nombre}</strong>? Está
          vacía, así que ningún producto se verá afectado.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 border border-dusty-rose/40 bg-page px-3 py-2 text-sm text-accent"
          >
            <AlertCircle size={16} strokeWidth={1.8} className="mt-0.5" />
            {error}
          </p>
        )}
      </div>

      <footer className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button
          type="button"
          onClick={onCerrar}
          disabled={eliminando}
          className="h-11 border border-border px-5 text-sm text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={confirmar}
          disabled={eliminando}
          className="h-11 bg-dusty-rose px-6 text-sm font-medium text-white transition-colors hover:bg-wine disabled:opacity-60"
        >
          {eliminando ? "Eliminando..." : "Sí, eliminar"}
        </button>
      </footer>
    </Ventana>
  );
}

export default function Categorias() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cerrarAviso = useCallback(() => setAviso(null), []);

  const cargar = useCallback(
    async (signal, silencioso = false) => {
      if (!silencioso) setCargando(true);
      setError("");

      try {
        const lista = await obtenerCategorias({ signal });

        if (signal?.aborted) return;

        setCategorias(Array.isArray(lista) ? lista : []);
      } catch (errorCarga) {
        if (errorCarga?.name === "AbortError") return;

        if (errorCarga?.estado === 401) {
          cerrarSesion();
          navigate("/login", { replace: true });
          return;
        }

        if (errorCarga?.estado === 403) {
          setError("Esta sección es solo para administradores.");
        } else {
          setError(
            errorCarga?.message ||
              "No se pudieron cargar las categorías. Revisa que el backend esté encendido.",
          );
        }
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

  const alGuardar = useCallback(
    async (mensaje, tipo = "ok") => {
      setFormulario(null);
      setAviso({ tipo, texto: mensaje });
      await cargar(undefined, true);
    },
    [cargar],
  );

  const alEliminar = useCallback(async () => {
    setPorEliminar(null);
    setAviso({ tipo: "ok", texto: "Categoría eliminada correctamente." });
    await cargar(undefined, true);
  }, [cargar]);

  const filtradas = useMemo(() => {
    const termino = normalizarTexto(busqueda);
    if (!termino) return categorias;

    return categorias.filter((categoria) =>
      normalizarTexto(categoria.nombre).includes(termino),
    );
  }, [categorias, busqueda]);

  const resumen = useMemo(() => {
    const productos = categorias.reduce(
      (total, categoria) => total + (Number(categoria.productos) || 0),
      0,
    );
    const vacias = categorias.filter(
      (categoria) => (Number(categoria.productos) || 0) === 0,
    ).length;

    return { productos, vacias };
  }, [categorias]);

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-semibold text-ink">
            Categorías
          </h1>
          <p className="mt-1 text-base text-muted">
            {categorias.length} categorías · {resumen.productos} productos
            asignados · {resumen.vacias} vacías
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormulario({ categoria: null })}
          className="inline-flex h-11 items-center gap-2 bg-dusty-rose px-5 text-sm font-medium text-white transition-colors hover:bg-wine"
        >
          <Plus size={18} strokeWidth={1.9} />
          Nueva categoría
        </button>
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
          etiqueta="Categorías"
          valor={categorias.length}
          icono={Tags}
          tono="bg-dusty-rose text-white"
        />
        <Kpi
          etiqueta="Productos asignados"
          valor={resumen.productos}
          icono={Package}
          tono="bg-[#e9a9a6] text-plum"
        />
        <Kpi
          etiqueta="Categorías vacías"
          valor={resumen.vacias}
          icono={FolderOpen}
          tono="bg-vino text-silk"
        />
      </div>

      <article className="overflow-hidden rounded-lg border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              Todas las categorías
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Solo se pueden eliminar las que no tienen productos.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar categoría..."
              aria-label="Buscar categorías"
              className="h-10 w-full border border-border bg-page pl-10 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
            />
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
        ) : filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-act text-dusty-rose">
              <Tags size={30} strokeWidth={1.5} />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-ink">
              {categorias.length === 0
                ? "Todavía no hay categorías"
                : "No encontramos esa categoría"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted">
              {categorias.length === 0
                ? "Crea la primera categoría para organizar el catálogo."
                : "Prueba con otro nombre o crea una categoría nueva."}
            </p>
            <button
              type="button"
              onClick={() => setFormulario({ categoria: null })}
              className="mt-5 inline-flex h-11 items-center gap-2 bg-dusty-rose px-5 text-sm font-medium text-white transition-colors hover:bg-wine"
            >
              <Plus size={18} strokeWidth={1.9} />
              Nueva categoría
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtradas.map((categoria) => {
              const productos = Number(categoria.productos) || 0;
              const stock = Number(categoria.stock) || 0;
              const vacia = productos === 0;

              return (
                <li
                  key={categoria.id_tipo}
                  className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-page/50 sm:gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-act text-dusty-rose">
                    <Tags size={19} strokeWidth={1.7} aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-[16px] font-semibold text-ink">
                      {categoria.nombre}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {vacia
                        ? "Sin productos asignados"
                        : `${productos} producto${
                            productos === 1 ? "" : "s"
                          } · ${stock} unidad${
                            stock === 1 ? "" : "es"
                          } en stock`}
                    </p>
                  </div>

                  <span
                    className={`hidden shrink-0 px-[9px] py-1 text-[10px] uppercase tracking-[0.12em] sm:inline-flex ${
                      vacia ? "bg-champagne/35 text-ink" : "bg-act text-ink"
                    }`}
                  >
                    {vacia ? "Vacía" : "En uso"}
                  </span>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFormulario({ categoria })}
                      aria-label={`Renombrar ${categoria.nombre}`}
                      title="Renombrar"
                      className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-accent"
                    >
                      <Pencil size={17} strokeWidth={1.7} />
                    </button>

                    {vacia ? (
                      <button
                        type="button"
                        onClick={() => setPorEliminar(categoria)}
                        aria-label={`Eliminar ${categoria.nombre}`}
                        title="Eliminar"
                        className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-accent"
                      >
                        <Trash2 size={17} strokeWidth={1.7} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        aria-label={`No se puede eliminar ${categoria.nombre}: tiene productos asociados`}
                        title="No se puede eliminar: tiene productos asociados"
                        className="flex h-9 w-9 cursor-not-allowed items-center justify-center text-muted/30"
                      >
                        <Trash2 size={17} strokeWidth={1.7} />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </article>

      {formulario && (
        <FormularioCategoria
          key={formulario.categoria?.id_tipo ?? "nueva"}
          categoria={formulario.categoria}
          onCerrar={() => setFormulario(null)}
          onGuardado={alGuardar}
        />
      )}

      {porEliminar && (
        <ConfirmarEliminarCategoria
          categoria={porEliminar}
          onCerrar={() => setPorEliminar(null)}
          onEliminada={alEliminar}
        />
      )}

      <Aviso aviso={aviso} onCerrar={cerrarAviso} />
    </section>
  );
}

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ImageOff,
  Package,
  PackageX,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerCategorias,
  obtenerProductosAdmin,
  subirImagenesProducto,
} from "../../api/admin";
import { formatoPrecio, normalizarTexto } from "../../api/catalogo";
import { cerrarSesion } from "../../api/sesion";
import Aviso from "../components/Aviso";
import Ventana from "../components/Ventana";
import { Kpi } from "../components/Tarjetas";

const stockDe = (producto) => Number(producto?.stock) || 0;

const claseStock = (stock) => {
  if (stock === 0) return "bg-dusty-rose text-white";
  if (stock <= 5) return "bg-champagne/45 text-ink";
  return "bg-act text-ink";
};

const etiquetaStock = (stock) => {
  if (stock === 0) return "Agotado";
  if (stock <= 5) return `${stock} uds · bajo`;
  return `${stock} uds`;
};

function Etiqueta({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted"
    >
      {children}
    </label>
  );
}

const campoBase =
  "h-11 w-full border border-border bg-page px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent disabled:cursor-not-allowed disabled:opacity-60";

function FormularioProducto({ producto, categorias, onCerrar, onGuardado }) {
  const editando = Boolean(producto?.id_producto);
  const tieneVariantes = (producto?.variantes?.length ?? 0) > 0;
  const idArchivos = useId();

  const [form, setForm] = useState(() => ({
    nombre: producto?.nombre ?? "",
    descripcion: producto?.descripcion ?? "",
    tipo_id: producto?.tipo_id ? String(producto.tipo_id) : "",
    precio: producto?.precio !== undefined ? String(producto.precio) : "",
    precio_anterior:
      producto?.precio_anterior !== null &&
      producto?.precio_anterior !== undefined
        ? String(producto.precio_anterior)
        : "",
    stock: producto ? String(stockDe(producto)) : "0",
  }));
  const [archivos, setArchivos] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const cambiar = (campo) => (evento) => {
    setForm((actual) => ({ ...actual, [campo]: evento.target.value }));
  };

  const agregarArchivos = (evento) => {
    const nuevos = Array.from(evento.target.files ?? []);
    if (nuevos.length === 0) return;

    setArchivos((actuales) => [...actuales, ...nuevos].slice(0, 10));
    evento.target.value = "";
  };

  const quitarArchivo = (indice) => {
    setArchivos((actuales) => actuales.filter((_, i) => i !== indice));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setError("");

    const nombre = form.nombre.trim();
    if (nombre.length < 2) {
      setError("Escribe un nombre de al menos 2 caracteres.");
      return;
    }

    const precio = Number(form.precio);
    if (!form.precio.trim() || !Number.isFinite(precio) || precio < 0) {
      setError("El precio debe ser un número mayor o igual a cero.");
      return;
    }

    const stock = Number(form.stock);
    if (!tieneVariantes && (!Number.isInteger(stock) || stock < 0)) {
      setError("El stock debe ser un número entero mayor o igual a cero.");
      return;
    }

    if (!form.tipo_id) {
      setError("Selecciona una categoría.");
      return;
    }

    const anteriorTexto = form.precio_anterior.trim();
    const precioAnterior = anteriorTexto === "" ? null : Number(anteriorTexto);

    if (
      precioAnterior !== null &&
      (!Number.isFinite(precioAnterior) || precioAnterior < 0)
    ) {
      setError("El precio anterior debe ser un número mayor o igual a cero.");
      return;
    }

    const datos = {
      nombre,
      descripcion: form.descripcion.trim() || null,
      precio,
      precio_anterior: precioAnterior,
      tipo_id: Number(form.tipo_id),
    };

    if (!tieneVariantes) datos.stock = stock;

    setGuardando(true);

    try {
      const guardado = editando
        ? await actualizarProducto(producto.id_producto, datos)
        : await crearProducto(datos);

      const id = editando ? producto.id_producto : guardado?.id_producto;

      if (archivos.length > 0 && id) {
        try {
          await subirImagenesProducto(id, archivos);
        } catch (errorImagenes) {
          await onGuardado(
            `Producto guardado, pero las imágenes no se pudieron subir: ${
              errorImagenes?.message || "inténtalo de nuevo"
            }`,
            "error",
          );
          return;
        }
      }

      await onGuardado(
        editando
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente.",
      );
    } catch (errorGuardado) {
      if (errorGuardado?.estado === 401) {
        cerrarSesion();
        return;
      }
      setError(errorGuardado?.message || "No se pudo guardar el producto.");
      setGuardando(false);
    }
  };

  return (
    <Ventana
      titulo={editando ? "Editar producto" : "Nuevo producto"}
      descripcion={
        editando
          ? `Actualiza los datos de ${producto.nombre}.`
          : "Completa los datos para agregarlo al catálogo."
      }
      onCerrar={guardando ? () => {} : onCerrar}
    >
      <form onSubmit={enviar}>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Etiqueta htmlFor="producto-nombre">Nombre</Etiqueta>
            <input
              id="producto-nombre"
              value={form.nombre}
              onChange={cambiar("nombre")}
              placeholder="Ej. Conjunto de encaje Delicado"
              className={campoBase}
              autoFocus
            />
          </div>

          <div>
            <Etiqueta htmlFor="producto-categoria">Categoría</Etiqueta>
            <select
              id="producto-categoria"
              value={form.tipo_id}
              onChange={cambiar("tipo_id")}
              className={campoBase}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id_tipo} value={categoria.id_tipo}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Etiqueta htmlFor="producto-stock">Stock</Etiqueta>
            <input
              id="producto-stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={cambiar("stock")}
              disabled={tieneVariantes}
              className={campoBase}
            />
            {tieneVariantes && (
              <p className="mt-1.5 text-[11px] text-muted">
                Se calcula desde las {producto.variantes.length} variantes del
                producto.
              </p>
            )}
          </div>

          <div>
            <Etiqueta htmlFor="producto-precio">Precio</Etiqueta>
            <input
              id="producto-precio"
              type="number"
              min="0"
              step="1"
              value={form.precio}
              onChange={cambiar("precio")}
              placeholder="49900"
              className={campoBase}
            />
          </div>

          <div>
            <Etiqueta htmlFor="producto-precio-anterior">
              Precio anterior (opcional)
            </Etiqueta>
            <input
              id="producto-precio-anterior"
              type="number"
              min="0"
              step="1"
              value={form.precio_anterior}
              onChange={cambiar("precio_anterior")}
              placeholder="Sin descuento"
              className={campoBase}
            />
          </div>

          <div className="sm:col-span-2">
            <Etiqueta htmlFor="producto-descripcion">Descripción</Etiqueta>
            <textarea
              id="producto-descripcion"
              value={form.descripcion}
              onChange={cambiar("descripcion")}
              rows={3}
              placeholder="Materiales, detalles y cuidados del producto."
              className="w-full resize-y border border-border bg-page px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
            />
          </div>

          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Imágenes
            </span>

            {editando && producto.imagenes?.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {producto.imagenes.map((imagen) => (
                  <img
                    key={imagen.id_imagen ?? imagen.url}
                    src={imagen.url}
                    alt=""
                    className="h-16 w-12 rounded-sm border border-border object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <input
                id={idArchivos}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={agregarArchivos}
                className="sr-only"
              />
              <label
                htmlFor={idArchivos}
                className="inline-flex h-10 cursor-pointer items-center gap-2 border border-border bg-page px-4 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <Upload size={16} strokeWidth={1.8} />
                Elegir imágenes
              </label>
              <span className="text-xs text-muted">
                JPG, PNG, WEBP o AVIF · máx. 5 MB cada una
              </span>
            </div>

            {archivos.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {archivos.map((archivo, indice) => (
                  <li
                    key={`${archivo.name}-${indice}`}
                    className="flex items-center justify-between gap-3 border border-border bg-page px-3 py-2 text-xs text-ink"
                  >
                    <span className="truncate">{archivo.name}</span>
                    <button
                      type="button"
                      onClick={() => quitarArchivo(indice)}
                      aria-label={`Quitar ${archivo.name}`}
                      className="text-muted transition-colors hover:text-accent"
                    >
                      <X size={14} strokeWidth={1.8} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mx-6 mb-4 flex items-start gap-2 border border-dusty-rose/40 bg-page px-3 py-2 text-sm text-accent"
          >
            <AlertCircle size={16} strokeWidth={1.8} className="mt-0.5" />
            {error}
          </p>
        )}

        <footer className="flex flex-wrap justify-end gap-3 border-t border-border px-6 py-4">
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
                : "Crear producto"}
          </button>
        </footer>
      </form>
    </Ventana>
  );
}

function ConfirmarEliminar({ producto, onCerrar, onEliminado }) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const confirmar = async () => {
    setEliminando(true);
    setError("");

    try {
      await eliminarProducto(producto.id_producto);
      await onEliminado();
    } catch (errorEliminar) {
      if (errorEliminar?.estado === 401) {
        cerrarSesion();
        return;
      }
      setError(errorEliminar?.message || "No se pudo eliminar el producto.");
      setEliminando(false);
    }
  };

  return (
    <Ventana
      titulo="Eliminar producto"
      descripcion="Esta acción no se puede deshacer."
      onCerrar={eliminando ? () => {} : onCerrar}
      ancho="max-w-md"
    >
      <div className="px-6 py-5">
        <p className="text-sm text-ink">
          ¿Seguro que quieres eliminar{" "}
          <strong className="font-semibold">{producto.nombre}</strong>? Se
          quitará del catálogo de la tienda.
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

export default function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [formulario, setFormulario] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cerrarAviso = useCallback(() => setAviso(null), []);

  const cargar = useCallback(
    async (signal, silencioso = false) => {
      if (!silencioso) setCargando(true);
      setError("");

      try {
        const [lista, listaCategorias] = await Promise.all([
          obtenerProductosAdmin({ signal }),
          obtenerCategorias({ signal }),
        ]);

        if (signal?.aborted) return;

        setProductos(Array.isArray(lista) ? lista : []);
        setCategorias(Array.isArray(listaCategorias) ? listaCategorias : []);
      } catch (errorCarga) {
        if (errorCarga?.name === "AbortError") return;

        if (errorCarga?.estado === 401) {
          cerrarSesion();
          navigate("/login", { replace: true });
          return;
        }

        setError(
          errorCarga?.message ||
            "No se pudieron cargar los productos. Revisa que el backend esté encendido.",
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
    setAviso({ tipo: "ok", texto: "Producto eliminado correctamente." });
    await cargar(undefined, true);
  }, [cargar]);

  const filtrados = useMemo(() => {
    const termino = normalizarTexto(busqueda);

    return productos.filter((producto) => {
      const coincideTexto =
        !termino ||
        normalizarTexto(
          `${producto.nombre ?? ""} ${producto.categoria ?? ""}`,
        ).includes(termino);
      const coincideCategoria =
        filtro === "todas" || String(producto.tipo_id) === filtro;

      return coincideTexto && coincideCategoria;
    });
  }, [productos, busqueda, filtro]);

  const resumen = useMemo(() => {
    const total = productos.length;
    const bajo = productos.filter(
      (producto) => stockDe(producto) > 0 && stockDe(producto) <= 5,
    ).length;
    const agotados = productos.filter(
      (producto) => stockDe(producto) === 0,
    ).length;

    return { total, bajo, agotados };
  }, [productos]);

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-semibold text-ink">
            Productos
          </h1>
          <p className="mt-1 text-sm text-muted">
            Gestiona el catálogo, los precios y el stock.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormulario({ producto: null })}
          className="inline-flex h-11 items-center gap-2 bg-dusty-rose px-5 text-sm font-medium text-white transition-colors hover:bg-wine"
        >
          <Plus size={18} strokeWidth={1.9} />
          Nuevo producto
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
          etiqueta="Productos"
          valor={resumen.total}
          icono={Package}
          tono="bg-dusty-rose text-white"
        />
        <Kpi
          etiqueta="Stock bajo"
          valor={resumen.bajo}
          icono={TriangleAlert}
          tono="bg-[#e9a9a6] text-plum"
        />
        <Kpi
          etiqueta="Agotados"
          valor={resumen.agotados}
          icono={PackageX}
          tono="bg-vino text-silk"
        />
      </div>

      <article className="overflow-hidden rounded-lg border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">
              Catálogo
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {filtrados.length} de {productos.length} productos
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
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Buscar producto..."
                aria-label="Buscar productos"
                className="h-10 w-full border border-border bg-page pl-10 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
              />
            </div>

            <select
              value={filtro}
              onChange={(evento) => setFiltro(evento.target.value)}
              aria-label="Filtrar por categoría"
              className="h-10 border border-border bg-page px-3 text-sm text-ink outline-none transition-colors focus:border-accent sm:w-52"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id_tipo} value={categoria.id_tipo}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        </header>

        {cargando ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 6 }).map((_, indice) => (
              <div
                key={indice}
                className="h-16 animate-pulse rounded-md bg-border"
              />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-act text-dusty-rose">
              <Package size={30} strokeWidth={1.5} />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-ink">
              {productos.length === 0
                ? "Todavía no hay productos"
                : "No encontramos coincidencias"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted">
              {productos.length === 0
                ? "Crea el primer producto para empezar a llenar el catálogo."
                : "Prueba con otro nombre o cambia la categoría seleccionada."}
            </p>
            {productos.length === 0 && (
              <button
                type="button"
                onClick={() => setFormulario({ producto: null })}
                className="mt-5 inline-flex h-11 items-center gap-2 bg-dusty-rose px-5 text-sm font-medium text-white transition-colors hover:bg-wine"
              >
                <Plus size={18} strokeWidth={1.9} />
                Nuevo producto
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  <th className="px-5 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((producto) => {
                  const stock = stockDe(producto);

                  return (
                    <tr
                      key={producto.id_producto}
                      className="border-b border-border transition-colors last:border-0 hover:bg-page/50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {producto.imagen ? (
                            <img
                              src={producto.imagen}
                              alt=""
                              loading="lazy"
                              className="h-14 w-11 shrink-0 rounded-sm border border-border object-cover"
                            />
                          ) : (
                            <span className="flex h-14 w-11 shrink-0 items-center justify-center rounded-sm bg-act text-muted">
                              <ImageOff size={18} strokeWidth={1.6} />
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block max-w-[220px] truncate font-medium text-ink">
                              {producto.nombre}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted">
                              #{producto.id_producto}
                              {producto.variantes?.length > 0 &&
                                ` · ${producto.variantes.length} variantes`}
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex bg-act px-[9px] py-1 text-[10px] uppercase tracking-[0.12em] text-ink">
                          {producto.categoria || "Sin categoría"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="block font-medium text-ink">
                          {formatoPrecio.format(Number(producto.precio) || 0)}
                        </span>
                        {Number(producto.precio_anterior) >
                          Number(producto.precio) && (
                          <span className="mt-0.5 block text-xs text-muted line-through">
                            {formatoPrecio.format(
                              Number(producto.precio_anterior),
                            )}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-[9px] py-[3px] text-xs ${claseStock(
                            stock,
                          )}`}
                        >
                          {etiquetaStock(stock)}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setFormulario({ producto })}
                            aria-label={`Editar ${producto.nombre}`}
                            title="Editar"
                            className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-accent"
                          >
                            <Pencil size={17} strokeWidth={1.7} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPorEliminar(producto)}
                            aria-label={`Eliminar ${producto.nombre}`}
                            title="Eliminar"
                            className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-accent"
                          >
                            <Trash2 size={17} strokeWidth={1.7} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>

      {formulario && (
        <FormularioProducto
          key={formulario.producto?.id_producto ?? "nuevo"}
          producto={formulario.producto}
          categorias={categorias}
          onCerrar={() => setFormulario(null)}
          onGuardado={alGuardar}
        />
      )}

      {porEliminar && (
        <ConfirmarEliminar
          producto={porEliminar}
          onCerrar={() => setPorEliminar(null)}
          onEliminado={alEliminar}
        />
      )}

      <Aviso aviso={aviso} onCerrar={cerrarAviso} />
    </section>
  );
}

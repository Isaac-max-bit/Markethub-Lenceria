import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Check, Minus, Plus } from "lucide-react";
import { COLOR_HEX, formatoPrecio } from "../api/catalogo";
import { useCarrito } from "../context/CarritoContext";
import { useProductos } from "../hooks/useProductos";

const ORDEN_TALLAS = ["XS", "S", "M", "L", "XL"];

const ordenarTallas = (tallas) =>
  [...tallas].sort((a, b) => {
    const ia = ORDEN_TALLAS.indexOf(a);
    const ib = ORDEN_TALLAS.indexOf(b);
    if (ia === -1 && ib === -1) return String(a).localeCompare(String(b));
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

// Color del check dentro de cada muestra según qué tan clara sea.
const colorContraste = (hex) => {
  const limpio = String(hex).replace("#", "");

  if (limpio.length !== 6) return "#ffffff";

  const r = parseInt(limpio.slice(0, 2), 16);
  const g = parseInt(limpio.slice(2, 4), 16);
  const b = parseInt(limpio.slice(4, 6), 16);
  const luz = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luz > 0.62 ? "#3e1a26" : "#ffffff";
};

const beneficios = [
  {
    icono: "fa-truck-fast",
    titulo: "Envíos gratis",
    texto: "Aplica para prendas sin descuento.",
  },
  {
    icono: "fa-clock",
    titulo: "Te llega en 6 días",
    texto: "Solo 6 días hábiles para ciudades principales.",
  },
  {
    icono: "fa-rotate-left",
    titulo: "Devoluciones gratis",
    texto: "Aplica para prendas sin descuento.",
  },
  {
    icono: "fa-credit-card",
    titulo: "Métodos de pago",
    texto: "Tarjeta de crédito, débito, contraentrega y ADDI.",
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const { agregar, abrirCarrito } = useCarrito();
  const { productos, cargando, error, recargar } = useProductos();
  const [talla, setTalla] = useState("");
  const [color, setColor] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [urlsRotas, setUrlsRotas] = useState([]);
  const [idAnterior, setIdAnterior] = useState(id);

  // Al pasar de un producto a otro se reinician talla, color e imagen.
  // (Ajustar el estado durante el render evita un render extra.)
  if (idAnterior !== id) {
    setIdAnterior(id);
    setTalla("");
    setColor("");
    setCantidad(1);
    setAgregando(false);
    setAviso(null);
    setUrlsRotas([]);
  }

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const producto = productos.find((p) => p.id === String(id));

  if (cargando && productos.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20 text-center text-sm text-mauve">
        Cargando producto…
      </main>
    );
  }

  if (error && productos.length === 0) {
    return (
      <main className="mx-auto max-w-md px-6 py-20 text-center" role="alert">
        <p className="text-sm text-wine">{error.message}</p>
        <button
          type="button"
          onClick={recargar}
          className="mt-5 border border-wine px-7 py-2 text-sm text-wine transition-colors hover:bg-wine hover:text-white"
        >
          Reintentar
        </button>
      </main>
    );
  }

  if (!producto) {
    return <Navigate to="/productos" replace />;
  }

  const descuento = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100)
    : 0;

  const galeria = (producto.imagenes ?? [])
    .map((imagen) => imagen.url)
    .filter(Boolean);

  const imagenPrincipal = producto.imagen || galeria[0];

  // Se muestran dos fotos: la principal y la siguiente distinta de la galería.
  const imagenesVisibles = [imagenPrincipal, ...galeria]
    .filter((url, indice, lista) => url && lista.indexOf(url) === indice)
    .filter((url) => !urlsRotas.includes(url))
    .slice(0, 2);

  const variantes = producto.variantes ?? [];

  const coloresDisponibles = producto.colores?.length
    ? producto.colores
    : [...new Set(variantes.map((variante) => variante.color).filter(Boolean))];

  const colorSeleccionado = color || coloresDisponibles[0] || "";

  const tallasDisponibles = ordenarTallas([
    ...new Set(
      variantes.length > 0
        ? variantes
            .filter(
              (variante) =>
                !colorSeleccionado || variante.color === colorSeleccionado,
            )
            .map((variante) => variante.talla)
            .filter(Boolean)
        : producto.tallas?.length
          ? producto.tallas
          : ORDEN_TALLAS,
    ),
  ]);

  const varianteSeleccionada = talla
    ? variantes.find(
        (variante) =>
          variante.talla === talla &&
          (!colorSeleccionado || variante.color === colorSeleccionado),
      )
    : null;

  const stockSeleccionado = varianteSeleccionada
    ? Number(varianteSeleccionada.stock) || 0
    : producto.stock;

  const agotado = talla ? stockSeleccionado <= 0 : producto.stock <= 0;

  const puedeAgregar = Boolean(varianteSeleccionada) && !agotado;
  const cantidadMaxima = Math.max(
    1,
    varianteSeleccionada ? stockSeleccionado : producto.stock,
  );

  const agregarAlCarrito = async () => {
    if (!puedeAgregar) return;

    setAgregando(true);
    setAviso(null);

    try {
      await agregar({
        variante_id: varianteSeleccionada.id_variante,
        cantidad,
        talla: varianteSeleccionada.talla,
        color: varianteSeleccionada.color,
        stock: Number(varianteSeleccionada.stock) || 0,
        producto_id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        precio_anterior: producto.precioAnterior ?? null,
        imagen: imagenPrincipal ?? producto.imagen ?? null,
      });

      setAviso({ tipo: "ok", texto: "Producto agregado a tu carrito." });
      abrirCarrito();
    } catch (fallo) {
      setAviso({ tipo: "error", texto: fallo.message });
    } finally {
      setAgregando(false);
    }
  };

  const relacionados = productos
    .filter(
      (p) => p.categoriaId === producto.categoriaId && p.id !== producto.id,
    )
    .slice(0, 3);

  return (
    <main className="bg-white font-body text-plum">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <nav aria-label="Ruta de navegación" className="text-xs text-mauve">
          <Link to="/productos" className="hover:text-wine">
            Productos
          </Link>
          <span className="mx-2">/</span>
          <Link
            to={`/productos?categoria=${producto.categoriaId}`}
            className="hover:text-wine"
          >
            {producto.categoriaNombre}
          </Link>
        </nav>
      </div>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-8 pt-4 lg:grid-cols-[1.75fr_1fr] lg:gap-12 lg:pb-12 lg:pt-6">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="relative">
            {imagenesVisibles.length === 0 ? (
              <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 bg-silk text-dusty-rose">
                <span className="text-5xl">♡</span>
                <p className="text-sm text-mauve">Fotografía del producto</p>
              </div>
            ) : (
              <div
                className={`grid gap-2 ${
                  imagenesVisibles.length > 1 ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                {imagenesVisibles.map((url, indice) => (
                  <div
                    key={url}
                    className="relative aspect-[3/4] overflow-hidden bg-silk"
                  >
                    <img
                      src={url}
                      alt={`${producto.nombre} ${indice + 1}`}
                      onError={() =>
                        setUrlsRotas((prev) =>
                          prev.includes(url) ? prev : [...prev, url],
                        )
                      }
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {descuento > 0 && (
              <span className="absolute left-0 top-4 bg-dusty-rose px-3 py-1 text-xs font-medium text-white">
                -{descuento}%
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 bg-white">
          <div className="bg-wine px-4 py-3 text-xs text-white">
            <span className="font-medium tracking-wide">LUXURY COLLECTION</span>
            <span className="mx-2">|</span>
            <span className="text-petal">Suave al tacto, hecha para ti</span>
          </div>

          <div className="border-b border-border px-4 pb-5 pt-4">
            <h1 className="font-heading text-3xl text-wine">
              {producto.nombre}
            </h1>

            <p className="mt-3 flex items-baseline gap-3">
              <span className="text-lg font-medium text-dusty-rose">
                {formatoPrecio.format(producto.precio)}
              </span>
              {producto.precioAnterior && (
                <span className="text-sm text-mauve line-through">
                  {formatoPrecio.format(producto.precioAnterior)}
                </span>
              )}
            </p>
          </div>

          <div className="px-4 pb-5 pt-4">
            {coloresDisponibles.length > 0 && (
              <div>
                <p className="text-sm text-mauve">
                  Color:{" "}
                  <span className="font-medium text-plum">
                    {colorSeleccionado}
                  </span>
                </p>

                <div
                  role="group"
                  aria-label="Seleccionar color"
                  className="mt-3 flex flex-wrap items-center gap-3"
                >
                  {coloresDisponibles.map((item) => {
                    const activo = colorSeleccionado === item;
                    const fondo = COLOR_HEX[item] ?? "#d8c3a5";

                    return (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={activo}
                        aria-label={`Color ${item}`}
                        title={item}
                        onClick={() => {
                          setColor(item);
                          setCantidad(1);
                          setAviso(null);

                          if (
                            talla &&
                            !variantes.some(
                              (variante) =>
                                variante.color === item &&
                                variante.talla === talla &&
                                (Number(variante.stock) || 0) > 0,
                            )
                          ) {
                            setTalla("");
                          }
                        }}
                        style={{
                          backgroundColor: fondo,
                          borderRadius: "9999px",
                        }}
                        className={`flex h-10 w-10 items-center justify-center transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose ${
                          activo
                            ? "ring-2 ring-plum ring-offset-2 ring-offset-white"
                            : "ring-1 ring-border hover:ring-mauve"
                        }`}
                      >
                        {activo && (
                          <Check
                            size={16}
                            strokeWidth={2.5}
                            style={{ color: colorContraste(fondo) }}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-mauve">Talla:</p>
              <Link
                to="/guia-de-tallas"
                className="text-xs font-medium uppercase tracking-wide text-dusty-rose underline underline-offset-4 hover:text-wine"
              >
                Guía de Tallas
              </Link>
            </div>

            <div
              role="group"
              aria-label="Seleccionar talla"
              className="mt-2 flex flex-wrap gap-2"
            >
              {tallasDisponibles.map((item) => {
                const variante = variantes.find(
                  (opcion) =>
                    opcion.talla === item &&
                    (!colorSeleccionado || opcion.color === colorSeleccionado),
                );
                const sinStock =
                  !variante || (Number(variante.stock) || 0) <= 0;
                const activa = talla === item;

                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={activa}
                    aria-label={
                      sinStock ? `Talla ${item} agotada` : `Talla ${item}`
                    }
                    disabled={sinStock}
                    onClick={() => {
                      setTalla(item);
                      setCantidad(1);
                      setAviso(null);
                    }}
                    style={{ borderRadius: "0.5rem" }}
                    className={`h-11 min-w-14 border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose ${
                      sinStock
                        ? "cursor-not-allowed border-border text-mauve/40 line-through"
                        : activa
                          ? "border-wine bg-wine text-white"
                          : "border-border text-plum hover:border-wine"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-mauve">
              {talla
                ? agotado
                  ? "Esa talla está agotada"
                  : `${stockSeleccionado} unidades disponibles`
                : `${producto.stock} unidades disponibles en total`}
            </p>
          </div>

          <div className="px-4 pb-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div
                role="group"
                aria-label="Cantidad"
                className="flex h-11 w-32 shrink-0 items-center justify-between rounded-full border border-border px-2"
              >
                <button
                  type="button"
                  onClick={() => setCantidad((valor) => Math.max(1, valor - 1))}
                  disabled={cantidad <= 1}
                  aria-label="Quitar una unidad"
                  style={{ borderRadius: "9999px" }}
                  className="flex h-8 w-8 items-center justify-center text-mauve transition-colors hover:bg-silk hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={14} strokeWidth={1.5} />
                </button>

                <span className="text-sm text-plum">{cantidad}</span>

                <button
                  type="button"
                  onClick={() =>
                    setCantidad((valor) => Math.min(cantidadMaxima, valor + 1))
                  }
                  disabled={cantidad >= cantidadMaxima}
                  aria-label="Agregar una unidad"
                  style={{ borderRadius: "9999px" }}
                  className="flex h-8 w-8 items-center justify-center text-mauve transition-colors hover:bg-silk hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>

              <button
                type="button"
                onClick={agregarAlCarrito}
                disabled={!puedeAgregar || agregando}
                style={{ borderRadius: "9999px" }}
                className="h-11 flex-1 bg-wine px-6 text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-dusty-rose disabled:cursor-not-allowed disabled:bg-petal disabled:text-wine/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
              >
                {agregando
                  ? "Agregando…"
                  : agotado
                    ? "Agotado"
                    : !varianteSeleccionada
                      ? talla
                        ? "No disponible"
                        : "Selecciona una talla"
                      : "Agregar a tu carrito"}
              </button>
            </div>

            {aviso && (
              <p
                role={aviso.tipo === "error" ? "alert" : "status"}
                className={`mt-3 text-xs ${
                  aviso.tipo === "error" ? "text-wine" : "text-mauve"
                }`}
              >
                {aviso.texto}
                {aviso.tipo === "ok" && (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={abrirCarrito}
                      className="font-medium text-dusty-rose underline underline-offset-4 hover:text-wine"
                    >
                      Ver carrito
                    </button>
                  </>
                )}
              </p>
            )}
          </div>

          <ul className="grid gap-4 border-y border-border px-4 py-5">
            {beneficios.map((beneficio) => (
              <li key={beneficio.titulo} className="flex items-start gap-4">
                <i
                  className={`fa-solid ${beneficio.icono} mt-0.5 w-6 text-center text-lg text-champagne`}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wide text-wine">
                    {beneficio.titulo}
                  </h3>
                  <p className="mt-1 text-xs text-mauve">{beneficio.texto}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-4 py-5">
            <h2 className="font-heading text-2xl text-wine">
              Sobre el producto
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mauve">
              {producto.descripcion ||
                `${producto.nombre}${
                  colorSeleccionado
                    ? ` en color ${colorSeleccionado.toLowerCase()}`
                    : ""
                }, de la categoría ${producto.categoriaNombre.toLowerCase()}. Confeccionado en tela premium, suave y cómoda para el uso diario.`}
            </p>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="bg-silk/30">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-center font-heading text-3xl italic text-wine">
              También te puede gustar
            </h2>

            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relacionados.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/productos/${item.id}`}
                    className="group block border border-border bg-white"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-silk">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-xl text-plum">
                        {item.nombre}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-wine">
                        {formatoPrecio.format(item.precio)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

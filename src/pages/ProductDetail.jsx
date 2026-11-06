import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { productos, formatoPrecio } from "../data/products";

const tallas = ["XS", "S", "M", "L", "XL"];

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
  const [talla, setTalla] = useState("");

  useEffect(() => {
    setTalla("");
    window.scrollTo({ top: 0 });
  }, [id]);

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return <Navigate to="/productos" replace />;
  }

  const descuento = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100)
    : 0;

  const relacionados = productos
    .filter(
      (p) => p.categoriaId === producto.categoriaId && p.id !== producto.id,
    )
    .slice(0, 3);

  return (
    <main className="bg-white font-body text-plum">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-8 md:grid-cols-2 md:gap-14 md:py-12">
        <div className="md:sticky md:top-8 md:self-start">
          <div className="relative aspect-[3/4] overflow-hidden bg-silk">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-dusty-rose">
              <span className="text-5xl">♡</span>
              <p className="text-sm text-mauve">Fotografía del producto</p>
            </div>

            {descuento > 0 && (
              <span className="absolute left-0 top-4 bg-dusty-rose px-3 py-1 text-xs font-medium text-white">
                -{descuento}%
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 bg-white">
          <div className="bg-wine px-8 py-4 text-xs text-white">
            <span className="font-medium tracking-wide">LUXURY COLLECTION</span>
            <span className="mx-2">|</span>
            <span className="text-petal">Suave al tacto, hecha para ti</span>
          </div>

          <div className="border-b border-border px-8 py-6">
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

            <h1 className="mt-3 font-heading text-4xl text-wine">
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

          <div className="px-8 pb-6 pt-5">
            <p className="text-sm text-mauve">
              Color:{" "}
              <span className="font-medium text-plum">{producto.color}</span>
            </p>

            <div className="mt-4 flex flex-wrap items-center">
              <div role="group" aria-label="Seleccionar talla" className="flex">
                {tallas.map((item, indice) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={talla === item}
                    onClick={() => setTalla(item)}
                    className={`h-11 w-12 border text-sm transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose ${
                      indice > 0 ? "-ml-px" : ""
                    } ${
                      talla === item
                        ? "border-wine bg-wine text-white"
                        : "border-mauve text-plum hover:bg-silk"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <Link
                to="/guia-de-tallas"
                className="ml-4 text-xs font-medium uppercase tracking-wide text-dusty-rose underline underline-offset-4 hover:text-wine"
              >
                Guía de medidas
              </Link>
            </div>
          </div>

          <div className="px-8 pb-6">
            <button
              type="button"
              disabled={!talla}
              className="block h-11 w-full bg-wine text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-dusty-rose disabled:cursor-not-allowed disabled:bg-petal disabled:text-wine/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
            >
              {talla ? "Agregar al carrito" : "Selecciona una talla"}
            </button>
          </div>

          <ul className="grid gap-5 border-y border-border px-8 py-6">
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

          <div className="px-8 py-6">
            <h2 className="font-heading text-2xl text-wine">
              Sobre el producto
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mauve">
              {producto.nombre} en color {producto.color.toLowerCase()}, de la
              categoría {producto.categoriaNombre.toLowerCase()}. Confeccionado
              en tela premium, suave y cómoda para el uso diario.
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
                    <div className="flex aspect-[3/4] items-center justify-center bg-silk text-3xl text-dusty-rose transition-colors group-hover:bg-petal">
                      ♡
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

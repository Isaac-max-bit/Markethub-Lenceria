import { Link, useSearchParams } from "react-router-dom";
import { aTarjeta, normalizarTexto } from "../api/catalogo";
import { useProductos } from "../hooks/useProductos";
import ProductCard from "../components/ProductCard";
import EstadoCatalogo from "../components/EstadoCatalogo";

export default function Search() {
  const [searchParams] = useSearchParams();
  const { productos, cargando, error, recargar } = useProductos();

  const termino = (searchParams.get("q") || "").trim();
  const palabras = normalizarTexto(termino).split(/\s+/).filter(Boolean);

  const resultados = palabras.length
    ? productos.filter((producto) => {
        const texto = normalizarTexto(
          [
            producto.nombre,
            producto.color,
            producto.categoriaNombre,
            producto.descripcion,
          ]
            .filter(Boolean)
            .join(" "),
        );

        return palabras.every((palabra) => texto.includes(palabra));
      })
    : [];

  return (
    <main className="min-h-screen bg-white font-body text-plum">
      <section className="bg-silk px-6 py-14 text-center">
        <nav
          aria-label="Ruta de navegación"
          className="mb-4 text-sm text-mauve"
        >
          <Link to="/home" className="hover:text-wine">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-wine">Búsqueda</span>
        </nav>
        <h1 className="font-heading text-4xl text-wine sm:text-5xl">
          {termino ? `Resultados para “${termino}”` : "Búsqueda"}
        </h1>
        <p className="mt-3 text-mauve">
          {cargando || error
            ? "Consultando el catálogo…"
            : termino
              ? `${resultados.length} ${
                  resultados.length === 1
                    ? "producto encontrado"
                    : "productos encontrados"
                }`
              : "Escribe lo que buscas en el buscador."}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {cargando || error ? (
          <EstadoCatalogo
            cargando={cargando}
            error={error}
            onReintentar={recargar}
          >
            {null}
          </EstadoCatalogo>
        ) : resultados.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {resultados.map((producto) => (
              <ProductCard key={producto.id} product={aTarjeta(producto)} />
            ))}
          </ul>
        ) : (
          <div className="mx-auto max-w-md py-10 text-center">
            <i
              className="fa-solid fa-magnifying-glass text-xl text-champagne"
              aria-hidden="true"
            />
            <h2 className="mt-4 font-heading text-2xl text-wine">
              No encontramos resultados
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mauve">
              Revisa la ortografía o prueba con otra palabra, por ejemplo el
              tipo de prenda o el color.
            </p>

            <Link
              to="/productos"
              className="mt-8 inline-block border border-wine px-8 py-3 text-sm text-wine transition-colors hover:bg-wine hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
            >
              Ver todos los productos
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

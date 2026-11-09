import { Link, useLocation, useSearchParams } from "react-router-dom";
import { categorias, aTarjeta } from "../api/catalogo";
import { useProductos } from "../hooks/useProductos";
import ProductCard from "../components/ProductCard";
import EstadoCatalogo from "../components/EstadoCatalogo";

export default function Products() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { productos, cargando, error, recargar } = useProductos();

  const enOfertas = pathname === "/ofertas";

  const categoriaParam = searchParams.get("categoria");
  const categoriaActiva = categorias.some((c) => c.id === categoriaParam)
    ? categoriaParam
    : "todos";

  const seleccionarCategoria = (id) => {
    if (id === "todos") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: id });
    }
  };

  let productosVisibles = productos;

  if (enOfertas) {
    productosVisibles = productos.filter((p) => p.precioAnterior);
  } else if (categoriaActiva !== "todos") {
    productosVisibles = productos.filter(
      (p) => p.categoriaId === categoriaActiva,
    );
  }

  let titulo = "Nuestra colección";
  let subtitulo = "Encuentra tu estilo, celebra tu esencia.";

  if (enOfertas) {
    titulo = "Ofertas";
    subtitulo =
      "Tus prendas favoritas con precios especiales, por tiempo limitado.";
  } else if (categoriaActiva !== "todos") {
    titulo = categorias.find((c) => c.id === categoriaActiva).nombre;
  }

  const opciones = [{ id: "todos", nombre: "Todos" }, ...categorias];

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
          <span className="text-wine">
            {enOfertas ? "Ofertas" : "Productos"}
          </span>
        </nav>
        <h1 className="font-heading text-4xl text-wine sm:text-5xl">
          {titulo}
        </h1>
        <p className="mt-3 text-mauve">{subtitulo}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {!enOfertas && (
          <div
            role="group"
            aria-label="Filtrar por categoría"
            className="flex flex-wrap justify-center gap-2"
          >
            {opciones.map((opcion) => {
              const activa = categoriaActiva === opcion.id;
              return (
                <button
                  key={opcion.id}
                  type="button"
                  aria-pressed={activa}
                  onClick={() => seleccionarCategoria(opcion.id)}
                  className={`border px-5 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose ${
                    activa
                      ? "border-wine bg-wine text-white"
                      : "border-border text-plum hover:border-dusty-rose hover:text-dusty-rose"
                  }`}
                >
                  {opcion.nombre}
                </button>
              );
            })}
          </div>
        )}

        {!cargando && !error && (
          <p className={`text-sm text-mauve ${enOfertas ? "" : "mt-8"}`}>
            {productosVisibles.length}{" "}
            {productosVisibles.length === 1 ? "producto" : "productos"}
          </p>
        )}

        <EstadoCatalogo
          cargando={cargando}
          error={error}
          vacio={productosVisibles.length === 0}
          mensajeVacio={
            enOfertas
              ? "Todavía no hay productos en oferta."
              : "No hay productos en esta categoría."
          }
          onReintentar={recargar}
        >
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {productosVisibles.map((producto) => (
              <ProductCard key={producto.id} product={aTarjeta(producto)} />
            ))}
          </ul>
        </EstadoCatalogo>
      </section>
    </main>
  );
}

import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const categorias = [
  {
    id: "conjuntos",
    nombre: "Conjuntos",
    productos: [
      ["Conjunto Encaje", "Negro", 79900, 99900],
      ["Conjunto Romance", "Rosado", 74900],
      ["Conjunto Delicado", "Beige", 69900],
    ],
  },
  {
    id: "brasieres",
    nombre: "Brasieres",
    productos: [
      ["Brasier Clásico", "Negro", 49900],
      ["Brasier Comodidad", "Beige", 54900, 64900],
      ["Brasier Encanto", "Vino", 59900],
    ],
  },
  {
    id: "tops",
    nombre: "Tops",
    productos: [
      ["Top Essential", "Negro", 34900],
      ["Top Rosé", "Rosado", 39900, 49900],
      ["Top Natural", "Blanco", 36900],
    ],
  },
  {
    id: "panties",
    nombre: "Panties",
    productos: [
      ["Pantie Clásico", "Negro", 19900],
      ["Pantie Suave", "Beige", 22900],
      ["Pantie Encaje", "Vino", 24900, 29900],
    ],
  },
  {
    id: "pijamas",
    nombre: "Pijamas",
    productos: [
      ["Pijama Satinada", "Rosado", 94900, 119900],
      ["Pijama Nocturna", "Negro", 89900],
      ["Pijama Sueños", "Lila", 84900],
    ],
  },
  {
    id: "bodies",
    nombre: "Bodies",
    productos: [
      ["Body Elegante", "Negro", 89900],
      ["Body Romance", "Vino", 84900],
      ["Body Natural", "Beige", 79900, 99900],
    ],
  },
  {
    id: "medias",
    nombre: "Medias",
    productos: [
      ["Medias Clásicas", "Negro", 14900],
      ["Medias Delicadas", "Beige", 17900],
      ["Medias Elegantes", "Vino", 19900],
    ],
  },
];

const productos = categorias.flatMap((categoria) =>
  categoria.productos.map(([nombre, color, precio, precioAnterior], indice) => ({
    nombre,
    color,
    precio,
    precioAnterior,
    categoriaId: categoria.id,
    categoriaNombre: categoria.nombre,
    imagen: `/images/${categoria.id}-${indice + 1}.jpg`,
  }))
);

const formatoPrecio = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function TarjetaProducto({ producto }) {
  const [sinImagen, setSinImagen] = useState(false);

  const descuento = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100)
    : 0;

  return (
    <article className="group flex flex-col bg-white border border-border">
      <div className="relative aspect-[3/4] overflow-hidden bg-silk">
        {sinImagen ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-dusty-rose">
            <span className="text-3xl">♡</span>
            <p className="text-xs text-mauve">Fotografía del producto</p>
          </div>
        ) : (
          <img
            src={producto.imagen}
            alt={`${producto.nombre} color ${producto.color}`}
            onError={() => setSinImagen(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {descuento > 0 && (
          <span className="absolute left-0 top-3 bg-dusty-rose px-2 py-1 text-xs font-medium text-white">
            -{descuento}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs text-mauve">{producto.categoriaNombre}</p>
        <h3 className="font-heading text-xl text-plum">{producto.nombre}</h3>
        <p className="text-sm text-mauve">Color: {producto.color}</p>

        <p className="mt-1 flex items-baseline gap-2">
          <span className="font-medium text-wine">
            {formatoPrecio.format(producto.precio)}
          </span>
          {producto.precioAnterior && (
            <span className="text-sm text-mauve line-through">
              {formatoPrecio.format(producto.precioAnterior)}
            </span>
          )}
        </p>

        <button
          type="button"
          className="mt-3 border border-wine py-2 text-sm text-wine transition-colors hover:bg-wine hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
        >
          Ver producto
        </button>
      </div>
    </article>
  );
}

export default function Products() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

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
    productosVisibles = productos.filter((p) => p.categoriaId === categoriaActiva);
  }

  let titulo = "Nuestra colección";
  let subtitulo = "Encuentra tu estilo, celebra tu esencia.";

  if (enOfertas) {
    titulo = "Ofertas";
    subtitulo = "Tus prendas favoritas con precios especiales, por tiempo limitado.";
  } else if (categoriaActiva !== "todos") {
    titulo = categorias.find((c) => c.id === categoriaActiva).nombre;
  }

  const opciones = [{ id: "todos", nombre: "Todos" }, ...categorias];

  return (
    <main className="min-h-screen bg-white font-body text-plum">
      <section className="bg-silk px-6 py-14 text-center">
        <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-mauve">
          <Link to="/home" className="hover:text-wine">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-wine">{enOfertas ? "Ofertas" : "Productos"}</span>
        </nav>
        <h1 className="font-heading text-4xl text-wine sm:text-5xl">{titulo}</h1>
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

        <p className={`text-sm text-mauve ${enOfertas ? "" : "mt-8"}`}>
          {productosVisibles.length}{" "}
          {productosVisibles.length === 1 ? "producto" : "productos"}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {productosVisibles.map((producto) => (
            <TarjetaProducto
              key={`${producto.categoriaId}-${producto.nombre}`}
              producto={producto}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

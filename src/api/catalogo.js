import { api } from "./client";

// ============================================================
// CATÁLOGO
// Une la API del backend con la forma que usan los componentes.
// La tabla Producto solo guarda id, nombre, descripción, precio,
// stock y fecha; categoría, color e imagen se deducen del texto.
// Si más adelante agregas esas columnas en Supabase, se usan solas.
// ============================================================

export const categorias = [
  { id: "conjuntos", nombre: "Conjuntos", claves: ["conjunto"] },
  {
    id: "brasieres",
    nombre: "Brasieres",
    claves: ["brasier", "brassiere", "sujetador"],
  },
  { id: "tops", nombre: "Tops", claves: ["top"] },
  {
    id: "panties",
    nombre: "Panties",
    claves: ["pantie", "panty", "panties", "braga"],
  },
  { id: "pijamas", nombre: "Pijamas", claves: ["pijama"] },
  { id: "bodies", nombre: "Bodies", claves: ["body", "bodie", "bodies"] },
  {
    id: "medias",
    nombre: "Medias",
    claves: ["media", "medias", "calcetin", "calcetines"],
  },
];

const COLORES = [
  { nombre: "Negro", claves: ["negro", "negra"] },
  { nombre: "Blanco", claves: ["blanco", "blanca"] },
  { nombre: "Beige", claves: ["beige", "nude", "arena"] },
  { nombre: "Rosado", claves: ["rosado", "rosada", "rosa", "palo de rosa"] },
  { nombre: "Vino", claves: ["vino", "vinotinto", "burdeos"] },
  { nombre: "Lila", claves: ["lila", "lavanda"] },
  { nombre: "Morado", claves: ["morado", "morada", "purpura"] },
  { nombre: "Rojo", claves: ["rojo", "roja"] },
  { nombre: "Azul", claves: ["azul", "azulino"] },
  { nombre: "Verde", claves: ["verde"] },
  { nombre: "Champán", claves: ["champan", "champagne", "dorado"] },
  { nombre: "Gris", claves: ["gris"] },
  { nombre: "Café", claves: ["cafe", "marron", "marrón"] },
];

export const formatoPrecio = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const normalizarTexto = (valor = "") =>
  String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const aNumero = (valor) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : null;
};

const inferirCategoria = (producto) => {
  // Si la base de datos ya trae una columna de categoría, se respeta.
  const explicita = normalizarTexto(
    producto.categoria ?? producto.categoria_id ?? "",
  );

  if (explicita) {
    const encontrada = categorias.find(
      (categoria) =>
        categoria.id === explicita ||
        normalizarTexto(categoria.nombre) === explicita,
    );

    if (encontrada) return encontrada;
  }

  const texto = normalizarTexto(
    `${producto.nombre ?? ""} ${producto.descripcion ?? ""}`,
  );

  return (
    categorias.find((categoria) =>
      categoria.claves.some((clave) => texto.includes(clave)),
    ) ?? null
  );
};

const inferirColor = (producto) => {
  if (producto.color) return String(producto.color);

  const texto = normalizarTexto(
    `${producto.nombre ?? ""} ${producto.descripcion ?? ""}`,
  );

  return COLORES.find((color) =>
    color.claves.some((clave) => texto.includes(clave)),
  )?.nombre ?? null;
};

const imagenPorDefecto = (nombre) =>
  `https://placehold.co/600x750/f8d0cb/3e1a26?text=${encodeURIComponent(
    nombre || "Producto",
  )}`;

/** Convierte una fila de Supabase en el producto que usan las páginas. */
export const aProducto = (fila) => {
  const categoria = inferirCategoria(fila);
  const precio = aNumero(fila.precio) ?? 0;
  const precioAnterior =
    aNumero(fila.precio_anterior ?? fila.precioAnterior) ?? undefined;

  const variantes = Array.isArray(fila.variantes) ? fila.variantes : [];
  const imagenes = Array.isArray(fila.imagenes) ? fila.imagenes : [];

  const colores = [
    ...new Set(
      (Array.isArray(fila.colores) && fila.colores.length > 0
        ? fila.colores
        : variantes.map((variante) => variante.color)
      ).filter(Boolean),
    ),
  ];

  const tallas = [
    ...new Set(
      (Array.isArray(fila.tallas) && fila.tallas.length > 0
        ? fila.tallas
        : variantes.map((variante) => variante.talla)
      ).filter(Boolean),
    ),
  ];

  return {
    id: String(fila.id_producto ?? fila.id),
    nombre: fila.nombre ?? "Producto sin nombre",
    descripcion: fila.descripcion ?? null,
    precio,
    precioAnterior:
      precioAnterior && precioAnterior > precio ? precioAnterior : undefined,
    stock: aNumero(fila.stock) ?? 0,
    color: fila.color || colores[0] || inferirColor(fila),
    colores,
    tallas,
    variantes,
    imagenes,
    categoriaId: categoria?.id ?? "otros",
    categoriaNombre: categoria?.nombre ?? "Otros",
    imagen:
      fila.imagen ||
      imagenes[0]?.url ||
      fila.imagen_url ||
      imagenPorDefecto(fila.nombre),
  };
};

/** Forma corta que espera <ProductCard />. */
export const aTarjeta = (producto) => ({
  id: producto.id,
  name: producto.nombre,
  price: producto.precio,
  oldPrice: producto.precioAnterior,
  image: producto.imagen,
});

// ============================================================
// LLAMADAS A LA API
// ============================================================

export async function listarProductos({ signal } = {}) {
  const filas = await api("/productos", { signal });
  return Array.isArray(filas) ? filas.map(aProducto) : [];
}

export async function buscarProductos(termino, { signal } = {}) {
  const filas = await api(
    `/productos/buscar?q=${encodeURIComponent(termino)}`,
    { signal },
  );
  return Array.isArray(filas) ? filas.map(aProducto) : [];
}

export async function obtenerProducto(id, { signal } = {}) {
  const fila = await api(`/productos/${encodeURIComponent(id)}`, { signal });
  return fila ? aProducto(fila) : null;
}

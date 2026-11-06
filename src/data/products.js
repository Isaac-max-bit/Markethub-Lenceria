export const categorias = [
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

export const productos = categorias.flatMap((categoria) =>
  categoria.productos.map(
    ([nombre, color, precio, precioAnterior], indice) => ({
      id: `${categoria.id}-${indice + 1}`,
      nombre,
      color,
      precio,
      precioAnterior,
      categoriaId: categoria.id,
      categoriaNombre: categoria.nombre,
      imagen: `/images/${categoria.id}-${indice + 1}.jpg`,
    }),
  ),
);

export const formatoPrecio = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

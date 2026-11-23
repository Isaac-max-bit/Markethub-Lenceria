import hero1 from "../assets/hero1.webp";
import bannerEditorial from "../assets/banner-editorial.webp";
import categoriaConjunto from "../assets/categoria-conjunto.jpg";
import categoriaBrasier from "../assets/categoria-brasier.jpg";
import categoriaPantie from "../assets/categoria-pantie.jpg";
import categoriaBody from "../assets/categoria-body.jpg";
import categoriaPijama from "../assets/categoria-pijama.jpg";
import { productos } from "./products";

const desdeCatalogo = (items) =>
  items.map(({ id, ...extra }) => {
    const producto = productos.find((p) => p.id === id);
    return {
      id: producto.id,
      name: producto.nombre,
      price: producto.precio,
      oldPrice: producto.precioAnterior,
      ...extra,
    };
  });

export const heroPrincipal = {
  to: "/ofertas",
  alt: "Super Sale: hasta 50% off en referencias seleccionadas",
  image: hero1,
  mobileImage: hero1,
  // El encuadre deja ver el titular, el 50% y el botón sin cortar la cabeza.
  position: "center 33%",
};

// Cinco fotos editoriales en blanco y negro, recortadas 4:5 y con el mismo
// tono (ver scripts de conversión). La primera ocupa el bloque grande.
export const categories = [
  {
    id: 1,
    slug: "conjuntos",
    name: "Conjunto",
    image: categoriaConjunto,
    position: "50% 26%",
  },
  {
    id: 2,
    slug: "brasieres",
    name: "Brasier",
    image: categoriaBrasier,
    position: "center",
  },
  {
    id: 3,
    slug: "panties",
    name: "Pantie",
    image: categoriaPantie,
    position: "center",
  },
  {
    id: 4,
    slug: "bodies",
    name: "Body",
    image: categoriaBody,
    position: "center",
  },
  {
    id: 5,
    slug: "pijamas",
    name: "Pijama",
    image: categoriaPijama,
    position: "center",
  },
];

export const bestSellers = desdeCatalogo([
  {
    id: "brasieres-3",
    badge: "Más vendido",
    image: "https://placehold.co/400x500/f8d0cb/3e1a26?text=Producto+1",
  },
  {
    id: "panties-2",
    badge: "Más vendido",
    image: "https://placehold.co/400x500/f3c4c0/3e1a26?text=Producto+2",
  },
  {
    id: "conjuntos-2",
    badge: "Más vendido",
    image: "https://placehold.co/400x500/ebd3ce/3e1a26?text=Producto+3",
  },
  {
    id: "tops-1",
    badge: "Más vendido",
    image: "https://placehold.co/400x500/f8d0cb/3e1a26?text=Producto+4",
  },
  {
    id: "pijamas-2",
    badge: "Más vendido",
    image: "https://placehold.co/400x500/f3c4c0/3e1a26?text=Producto+5",
  },
  {
    id: "brasieres-1",
    badge: "Más vendido",
    image: "https://placehold.co/400x500/ebd3ce/3e1a26?text=Producto+6",
  },
]);

export const discounted = desdeCatalogo([
  {
    id: "brasieres-2",
    image: "https://placehold.co/400x500/f8d0cb/3e1a26?text=Producto+7",
  },
  {
    id: "pijamas-1",
    image: "https://placehold.co/400x500/f3c4c0/3e1a26?text=Producto+8",
  },
  {
    id: "tops-2",
    image: "https://placehold.co/400x500/ebd3ce/3e1a26?text=Producto+9",
  },
  {
    id: "conjuntos-1",
    image: "https://placehold.co/400x500/f8d0cb/3e1a26?text=Producto+10",
  },
]);

export const editorialBanner = {
  to: "/productos?categoria=conjuntos",
  eyebrow: "Luxury collection",
  title: "Elegancia que comienza contigo",
  cta: "Descubrir la colección",
  alt: "Mujer luciendo un brasier blanco de la colección",
  image: bannerEditorial,
};

export const benefits = [
  {
    id: 1,
    icon: "envio",
    title: "Envíos a todo el país",
    text: "Recibe tu pedido en la puerta de tu casa.",
  },
  {
    id: 2,
    icon: "cambios",
    title: "Cambios fáciles",
    text: "Si la talla no es la ideal, lo resolvemos.",
  },
  {
    id: 3,
    icon: "pago",
    title: "Pago seguro",
    text: "Tus datos siempre protegidos.",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "María G.",
    rating: 5,
    comment: "La calidad es increíble y el ajuste perfecto.",
  },
  {
    id: 2,
    name: "Camila R.",
    rating: 5,
    comment: "Llegó rápido y el empaque es precioso.",
  },
  {
    id: 3,
    name: "Laura P.",
    rating: 4,
    comment: "Muy cómodo, volveré a comprar.",
  },
];

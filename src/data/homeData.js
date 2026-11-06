import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
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

export const carouselSlides = [
  {
    id: 1,
    to: "/productos?categoria=conjuntos",
    alt: "Conjuntos de encaje en tonos suaves",
    image: hero1,
    mobileImage: "https://placehold.co/800x1000/f8d0cb/3e1a26?text=Coleccion+1",
  },
  {
    id: 2,
    to: "/productos?categoria=brasieres",
    alt: "Brasieres cómodos para todos los días",
    image: hero2,
    mobileImage: "https://placehold.co/800x1000/f3c4c0/3e1a26?text=Coleccion+2",
  },
  {
    id: 3,
    to: "/productos?categoria=pijamas",
    alt: "Pijamas suaves para descansar",
    image: "https://placehold.co/1600x700/ebd3ce/3e1a26?text=Coleccion+3",
    mobileImage: "https://placehold.co/800x1000/ebd3ce/3e1a26?text=Coleccion+3",
  },
];

export const categories = [
  {
    id: 1,
    slug: "brasieres",
    name: "Brasier",
    image: "https://placehold.co/600x700/f8d0cb/3e1a26?text=Brasier",
  },
  {
    id: 2,
    slug: "panties",
    name: "Pantie",
    image: "https://placehold.co/600x700/f3c4c0/3e1a26?text=Pantie",
  },
  {
    id: 3,
    slug: "conjuntos",
    name: "Conjunto",
    image: "https://placehold.co/600x700/ebd3ce/3e1a26?text=Conjunto",
  },
  {
    id: 4,
    slug: "pijamas",
    name: "Pijama",
    image: "https://placehold.co/900x700/f8d0cb/3e1a26?text=Pijama",
  },
  {
    id: 5,
    slug: "tops",
    name: "Top",
    image: "https://placehold.co/900x700/f3c4c0/3e1a26?text=Top",
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
  alt: "Mujer luciendo un conjunto de la colección",
  image: "https://placehold.co/1600x700/f3c4c0/3e1a26?text=Banner+editorial",
};

export const benefits = [
  {
    id: 1,
    icon: "fa-truck-fast",
    title: "Envíos a todo el país",
    text: "Recibe tu pedido en la puerta de tu casa.",
  },
  {
    id: 2,
    icon: "fa-rotate",
    title: "Cambios fáciles",
    text: "Si la talla no es la ideal, lo resolvemos.",
  },
  {
    id: 3,
    icon: "fa-lock",
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

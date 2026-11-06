import { useState } from "react";
import { Link } from "react-router-dom";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductCard({ product, className = "" }) {
  const [sinImagen, setSinImagen] = useState(false);

  const badge = product.oldPrice
    ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`
    : product.badge;

  return (
    <li className={className}>
      <Link to={`/productos/${product.id}`} className="group block">
        <div className="relative overflow-hidden bg-silk">
          {sinImagen ? (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 text-dusty-rose">
              <span className="text-3xl">♡</span>
              <p className="text-xs text-mauve">Fotografía del producto</p>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setSinImagen(true)}
              className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {badge && (
            <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] uppercase tracking-widest text-plum">
              {badge}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-sm font-medium text-plum">{product.name}</h3>
        <p className="text-sm text-mauve">
          {formatPrice(product.price)}
          {product.oldPrice && (
            <span className="ml-2 text-xs text-mauve/60 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </p>
      </Link>
    </li>
  );
}

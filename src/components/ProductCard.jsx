import { Link } from "react-router-dom";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductCard({ product, className = "" }) {
  const badge = product.oldPrice
    ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`
    : product.badge;

  return (
    <li className={className}>
      <Link to={`/productos/${product.id}`} className="group block">
        <div className="relative overflow-hidden bg-silk">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
          />
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

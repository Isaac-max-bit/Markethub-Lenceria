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
  const [indice, setIndice] = useState(0);

  const imagenes = (product.images?.length ? product.images : [product.image])
    .filter(Boolean);
  const total = imagenes.length;

  const badge = product.oldPrice
    ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`
    : product.badge;

  const mover = (evento, paso) => {
    evento.preventDefault();
    evento.stopPropagation();
    setIndice((valor) => (valor + paso + total) % total);
  };

  return (
    <li className={className}>
      <Link to={`/productos/${product.id}`} className="group block">
        <div className="relative overflow-hidden bg-[#F1EFEC]">
          {sinImagen ? (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 text-dusty-rose">
              <span className="text-3xl">♡</span>
              <p className="text-xs text-mauve">Fotografía del producto</p>
            </div>
          ) : (
            <>
              {imagenes.map((url, posicion) => (
                <img
                  key={url}
                  src={url}
                  alt={product.name}
                  loading="lazy"
                  onError={() => setSinImagen(true)}
                  className={`aspect-[4/5] w-full object-cover transition-opacity duration-500 ${
                    posicion === indice ? "opacity-100" : "opacity-0"
                  } ${posicion === 0 ? "" : "absolute inset-0 h-full"}`}
                />
              ))}

              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(evento) => mover(evento, -1)}
                    aria-label="Imagen anterior"
                    className="absolute left-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-lg text-plum/70 opacity-0 transition-opacity hover:text-plum focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(evento) => mover(evento, 1)}
                    aria-label="Imagen siguiente"
                    className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-lg text-plum/70 opacity-0 transition-opacity hover:text-plum focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    ›
                  </button>
                </>
              )}
            </>
          )}

          {badge && (
            <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-plum">
              {badge}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-[11px] font-medium uppercase leading-snug tracking-[0.08em] text-plum">
          {product.name}
        </h3>
        <p className="mt-1 text-[13px] text-plum/85">
          {formatPrice(product.price)}
          {product.oldPrice && (
            <span className="ml-2 text-[11px] text-mauve/60 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </p>
      </Link>
    </li>
  );
}

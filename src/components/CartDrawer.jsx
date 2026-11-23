import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { formatoPrecio } from "../api/catalogo";
import { useCarrito } from "../context/CarritoContext";

const ICON_STROKE = 1.25;

function ImagenItem({ item }) {
  const [sinImagen, setSinImagen] = useState(!item.imagen);

  return (
    <div className="h-24 w-20 shrink-0 overflow-hidden border border-border/70 bg-silk">
      {sinImagen ? (
        <div className="flex h-full w-full items-center justify-center text-lg text-dusty-rose">
          ♡
        </div>
      ) : (
        <img
          src={item.imagen}
          alt={item.nombre}
          loading="lazy"
          onError={() => setSinImagen(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function LineaCarrito({ item, ocupado, deshabilitado, onCantidad, onEliminar }) {
  const detalle = [item.color, item.talla ? `Talla ${item.talla}` : null]
    .filter(Boolean)
    .join(" · ");

  const enMaximo = item.stock > 0 && item.cantidad >= item.stock;

  return (
    <li className="flex gap-3 py-4">
      <Link
        to={`/productos/${item.producto_id}`}
        className="shrink-0"
        aria-label={`Ver ${item.nombre}`}
      >
        <ImagenItem item={item} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/productos/${item.producto_id}`}
              className="block truncate text-sm text-plum transition-colors hover:text-wine"
            >
              {item.nombre}
            </Link>
            {detalle && <p className="mt-0.5 text-xs text-mauve">{detalle}</p>}
            <p className="mt-1 text-xs text-mauve">
              {formatoPrecio.format(item.precio)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onEliminar(item)}
            disabled={deshabilitado}
            aria-label={`Eliminar ${item.nombre} del carrito`}
            className="flex h-7 w-7 shrink-0 items-center justify-center text-mauve transition-colors hover:text-wine disabled:opacity-40"
          >
            <X size={14} strokeWidth={ICON_STROKE} />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div
            role="group"
            aria-label={`Cantidad de ${item.nombre}`}
            className="flex h-8 w-fit items-center border border-border"
          >
            <button
              type="button"
              onClick={() => onCantidad(item, item.cantidad - 1)}
              disabled={deshabilitado || item.cantidad <= 1}
              aria-label={`Quitar una unidad de ${item.nombre}`}
              className="flex h-full w-7 items-center justify-center text-mauve transition-colors hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={12} strokeWidth={ICON_STROKE} />
            </button>

            <span className="w-7 text-center text-xs text-plum">
              {ocupado ? "…" : item.cantidad}
            </span>

            <button
              type="button"
              onClick={() => onCantidad(item, item.cantidad + 1)}
              disabled={deshabilitado || enMaximo}
              aria-label={`Agregar una unidad de ${item.nombre}`}
              className="flex h-full w-7 items-center justify-center text-mauve transition-colors hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={12} strokeWidth={ICON_STROKE} />
            </button>
          </div>

          <p className="text-sm font-medium text-wine">
            {formatoPrecio.format(item.subtotal)}
          </p>
        </div>
      </div>
    </li>
  );
}

export default function CartDrawer() {
  const {
    items,
    total,
    cantidad,
    cargando,
    procesando,
    error,
    carritoAbierto,
    actualizar,
    eliminar,
    cerrarCarrito,
    limpiarError,
  } = useCarrito();

  const [idEnProceso, setIdEnProceso] = useState(null);
  const cerrarRef = useRef(null);

  useEffect(() => {
    if (!carritoAbierto) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") cerrarCarrito();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    cerrarRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [carritoAbierto, cerrarCarrito]);

  const cambiarCantidad = async (item, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    if (item.stock > 0 && nuevaCantidad > item.stock) return;

    setIdEnProceso(item.id_carrito);
    limpiarError();

    try {
      await actualizar(item.id_carrito, nuevaCantidad);
    } catch {
      // El mensaje se muestra desde el contexto.
    } finally {
      setIdEnProceso(null);
    }
  };

  const quitar = async (item) => {
    setIdEnProceso(item.id_carrito);
    limpiarError();

    try {
      await eliminar(item.id_carrito);
    } catch {
      // El mensaje se muestra desde el contexto.
    } finally {
      setIdEnProceso(null);
    }
  };

  const bloqueado = procesando || idEnProceso !== null;

  return (
    <>
      <div
        onClick={cerrarCarrito}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-plum/30 transition-opacity duration-300 ${
          carritoAbierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl transition-[transform,visibility] duration-300 ${
          carritoAbierto ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
          <h2 className="font-heading text-2xl text-wine">
            Carrito{cantidad > 0 ? ` (${cantidad})` : ""}
          </h2>

          <button
            ref={cerrarRef}
            type="button"
            onClick={cerrarCarrito}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center text-plum transition-colors hover:text-dusty-rose"
          >
            <X size={20} strokeWidth={ICON_STROKE} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start justify-between gap-3 border border-[#c98b8b] bg-[#fdf1f1] px-3 py-2 text-xs text-[#7a2e2e]"
            >
              <p>{error.message}</p>
              <button
                type="button"
                onClick={limpiarError}
                aria-label="Cerrar aviso"
                className="shrink-0 transition-colors hover:text-wine"
              >
                <X size={14} strokeWidth={ICON_STROKE} />
              </button>
            </div>
          )}

          {cargando && items.length === 0 ? (
            <p className="py-16 text-center text-sm text-mauve" role="status">
              Cargando tu carrito…
            </p>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center border border-border text-dusty-rose">
                <ShoppingBag size={24} strokeWidth={ICON_STROKE} />
              </span>
              <h3 className="mt-5 font-heading text-2xl text-wine">
                Tu carrito está vacío
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mauve">
                Descubre la colección y agrega tus prendas favoritas.
              </p>
              <Link
                to="/productos"
                onClick={cerrarCarrito}
                className="mt-6 bg-wine px-7 py-3 text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-dusty-rose"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <LineaCarrito
                  key={item.id_carrito}
                  item={item}
                  ocupado={idEnProceso === item.id_carrito}
                  deshabilitado={bloqueado}
                  onCantidad={cambiarCantidad}
                  onEliminar={quitar}
                />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 border-t border-border bg-white px-5 py-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-mauve">Subtotal</span>
              <span className="text-lg font-medium text-wine">
                {formatoPrecio.format(total)}
              </span>
            </div>

            <p className="mt-1 text-[11px] leading-relaxed text-mauve">
              El envío se coordina al confirmar el pedido.
            </p>

            <Link
              to="/pago"
              onClick={cerrarCarrito}
              className="mt-4 flex h-11 w-full items-center justify-center bg-wine text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-dusty-rose"
            >
              Ir a pagar
            </Link>

            <Link
              to="/carrito"
              onClick={cerrarCarrito}
              className="mt-2 flex h-10 w-full items-center justify-center border border-border text-xs font-medium uppercase tracking-wide text-plum transition-colors hover:border-petal hover:bg-silk"
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { formatoPrecio } from "../api/catalogo";
import { useCarrito } from "../context/CarritoContext";

const ICON_STROKE = 1.25;

function Encabezado({ titulo, subtitulo }) {
  return (
    <section className="bg-silk px-6 py-14 text-center">
      <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-mauve">
        <Link to="/home" className="hover:text-wine">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-wine">Carrito</span>
      </nav>
      <h1 className="font-heading text-4xl text-wine sm:text-5xl">{titulo}</h1>
      {subtitulo && <p className="mt-3 text-mauve">{subtitulo}</p>}
    </section>
  );
}

function ImagenProducto({ item }) {
  const [sinImagen, setSinImagen] = useState(!item.imagen);

  return (
    <div className="h-32 w-24 shrink-0 overflow-hidden bg-silk sm:h-36 sm:w-28">
      {sinImagen ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-dusty-rose">
          <span className="text-2xl">♡</span>
          <span className="px-1 text-center text-[10px] text-mauve">
            Sin foto
          </span>
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

function ItemCarrito({
  item,
  ocupado,
  deshabilitado,
  onCantidad,
  onEliminar,
}) {
  const detalle = [item.color, item.talla ? `Talla ${item.talla}` : null]
    .filter(Boolean)
    .join(" · ");

  const enMaximo = item.stock > 0 && item.cantidad >= item.stock;

  return (
    <li className="flex gap-4 py-6 sm:gap-6">
      <Link
        to={`/productos/${item.producto_id}`}
        className="shrink-0"
        aria-label={`Ver ${item.nombre}`}
      >
        <ImagenProducto item={item} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/productos/${item.producto_id}`}
              className="block truncate text-sm font-medium text-plum transition-colors hover:text-wine"
            >
              {item.nombre}
            </Link>

            {detalle && <p className="mt-1 text-xs text-mauve">{detalle}</p>}

            <p className="mt-1 text-xs text-mauve">
              {formatoPrecio.format(item.precio)} c/u
            </p>
          </div>

          <button
            type="button"
            onClick={() => onEliminar(item)}
            disabled={deshabilitado}
            aria-label={`Eliminar ${item.nombre} del carrito`}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-mauve transition-colors hover:text-wine disabled:opacity-40"
          >
            <X size={16} strokeWidth={ICON_STROKE} />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <div>
            <div
              role="group"
              aria-label={`Cantidad de ${item.nombre}`}
              className="flex h-9 w-fit items-center border border-border"
            >
              <button
                type="button"
                onClick={() => onCantidad(item, item.cantidad - 1)}
                disabled={deshabilitado || item.cantidad <= 1}
                aria-label={`Quitar una unidad de ${item.nombre}`}
                className="flex h-full w-8 items-center justify-center text-mauve transition-colors hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={14} strokeWidth={ICON_STROKE} />
              </button>

              <span className="w-8 text-center text-sm text-plum">
                {ocupado ? "…" : item.cantidad}
              </span>

              <button
                type="button"
                onClick={() => onCantidad(item, item.cantidad + 1)}
                disabled={deshabilitado || enMaximo}
                aria-label={`Agregar una unidad de ${item.nombre}`}
                className="flex h-full w-8 items-center justify-center text-mauve transition-colors hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={14} strokeWidth={ICON_STROKE} />
              </button>
            </div>

            {enMaximo && (
              <p className="mt-1 text-[11px] text-mauve">
                Máximo disponible: {item.stock}
              </p>
            )}
          </div>

          <p className="text-sm font-medium text-wine">
            {formatoPrecio.format(item.subtotal)}
          </p>
        </div>
      </div>
    </li>
  );
}

function CarritoVacio({ error, onReintentar }) {
  return (
    <main className="min-h-screen bg-white font-body text-plum">
      <Encabezado
        titulo="Tu carrito"
        subtitulo="Las prendas que elijas te estarán esperando aquí."
      />

      <section className="mx-auto max-w-md px-6 py-16 text-center">
        {error ? (
          <>
            <p className="text-sm text-wine" role="alert">
              {error.message}
            </p>
            <button
              type="button"
              onClick={onReintentar}
              className="mt-6 border border-wine px-7 py-2 text-sm text-wine transition-colors hover:bg-wine hover:text-white"
            >
              Reintentar
            </button>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center border border-border text-dusty-rose">
              <ShoppingBag size={26} strokeWidth={ICON_STROKE} />
            </span>
            <h2 className="mt-6 font-heading text-3xl text-wine">
              Tu carrito está vacío
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mauve">
              Descubre la colección y agrega tus prendas favoritas.
            </p>
            <Link
              to="/productos"
              className="mt-8 inline-block bg-wine px-8 py-3 text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-dusty-rose"
            >
              Ver productos
            </Link>
          </>
        )}
      </section>
    </main>
  );
}

export default function Cart() {
  const {
    items,
    total,
    cantidad,
    cargando,
    procesando,
    error,
    recargar,
    actualizar,
    eliminar,
    vaciar,
    limpiarError,
    esInvitado,
  } = useCarrito();

  const [idEnProceso, setIdEnProceso] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cambiarCantidad = async (item, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    if (item.stock > 0 && nuevaCantidad > item.stock) return;

    setAviso(null);
    setIdEnProceso(item.id_carrito);

    try {
      await actualizar(item.id_carrito, nuevaCantidad);
    } catch (fallo) {
      setAviso({ tipo: "error", texto: fallo.message });
    } finally {
      setIdEnProceso(null);
    }
  };

  const quitar = async (item) => {
    setAviso(null);
    setIdEnProceso(item.id_carrito);

    try {
      await eliminar(item.id_carrito);
    } catch (fallo) {
      setAviso({ tipo: "error", texto: fallo.message });
    } finally {
      setIdEnProceso(null);
    }
  };

  const vaciarCarrito = async () => {
    if (!window.confirm("¿Seguro que quieres vaciar el carrito?")) return;

    setAviso(null);

    try {
      await vaciar();
    } catch (fallo) {
      setAviso({ tipo: "error", texto: fallo.message });
    }
  };

  if (cargando && items.length === 0) {
    return (
      <main className="min-h-screen bg-white font-body text-plum">
        <Encabezado titulo="Tu carrito" />
        <p className="px-6 py-16 text-center text-sm text-mauve" role="status">
          Cargando tu carrito…
        </p>
      </main>
    );
  }

  if (items.length === 0) {
    return <CarritoVacio error={error} onReintentar={recargar} />;
  }

  const bloqueado = procesando || idEnProceso !== null;

  return (
    <main className="min-h-screen bg-white font-body text-plum">
      <Encabezado
        titulo="Tu carrito"
        subtitulo="Revisa tus prendas y continúa al pago."
      />

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        {(aviso || error) && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 border border-[#c98b8b] bg-[#fdf1f1] px-4 py-3 text-sm text-[#7a2e2e]"
          >
            <p>{aviso?.texto || error?.message}</p>
            <button
              type="button"
              onClick={() => {
                setAviso(null);
                limpiarError();
              }}
              aria-label="Cerrar aviso"
              className="shrink-0 transition-colors hover:text-wine"
            >
              <X size={16} strokeWidth={ICON_STROKE} />
            </button>
          </div>
        )}

        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div>
            <div className="flex items-end justify-between border-b border-border pb-3">
              <h2 className="font-heading text-2xl text-wine">Artículos</h2>
              <span className="text-xs uppercase tracking-wide text-mauve">
                {cantidad} {cantidad === 1 ? "unidad" : "unidades"}
              </span>
            </div>

            <ul className="divide-y divide-border border-b border-border">
              {items.map((item) => (
                <ItemCarrito
                  key={item.id_carrito}
                  item={item}
                  ocupado={idEnProceso === item.id_carrito}
                  deshabilitado={bloqueado || idEnProceso === item.id_carrito}
                  onCantidad={cambiarCantidad}
                  onEliminar={quitar}
                />
              ))}
            </ul>

            <Link
              to="/productos"
              className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-dusty-rose underline underline-offset-4 transition-colors hover:text-wine"
            >
              <ArrowLeft size={14} strokeWidth={ICON_STROKE} />
              Seguir comprando
            </Link>
          </div>

          <aside className="h-fit border border-border bg-white p-6 md:sticky md:top-24">
            <h2 className="font-heading text-2xl text-wine">
              Resumen del pedido
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-mauve">Artículos ({cantidad})</dt>
                <dd className="text-plum">{formatoPrecio.format(total)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mauve">Envío</dt>
                <dd className="text-right text-mauve">
                  Se coordina al confirmar
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-4 text-base">
                <dt className="font-medium text-wine">Total</dt>
                <dd className="font-medium text-wine">
                  {formatoPrecio.format(total)}
                </dd>
              </div>
            </dl>

            <Link
              to="/pago"
              className={`mt-6 flex h-11 w-full items-center justify-center bg-wine text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-dusty-rose ${
                bloqueado ? "pointer-events-none opacity-60" : ""
              }`}
            >
              Ir a pagar
            </Link>

            <button
              type="button"
              onClick={vaciarCarrito}
              disabled={bloqueado}
              className="mt-3 w-full text-xs uppercase tracking-wide text-mauve underline underline-offset-4 transition-colors hover:text-wine disabled:cursor-not-allowed disabled:opacity-50"
            >
              Vaciar carrito
            </button>

            {esInvitado ? (
              <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-mauve">
                Estás comprando como invitado. Al pagar solo te pediremos los
                datos para la entrega.{" "}
                <Link
                  to="/login"
                  state={{ desde: "/pago" }}
                  className="font-medium text-dusty-rose underline underline-offset-4 hover:text-wine"
                >
                  ¿Ya tienes cuenta?
                </Link>
              </p>
            ) : (
              <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-mauve">
                Al confirmar, el stock se descuenta automáticamente y tu pedido
                queda registrado en tu cuenta.
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

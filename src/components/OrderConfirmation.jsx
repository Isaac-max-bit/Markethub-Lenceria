import { Link } from "react-router-dom";
import { CheckCircle2, Mail, Truck } from "lucide-react";
import { formatoPrecio } from "../api/catalogo";

const ICON_STROKE = 1.25;

const formato = (valor) => formatoPrecio.format(Number(valor) || 0);

const detalleItem = (item) =>
  [item.color, item.talla ? `Talla ${item.talla}` : null]
    .filter(Boolean)
    .join(" · ");

const METODOS = {
  contraentrega: {
    nombre: "Contraentrega",
    nota: "Pagarás en efectivo cuando recibas tu pedido.",
  },
  transferencia: {
    nombre: "Transferencia bancaria",
    nota: "Te enviaremos los datos de la cuenta a tu correo para completar la transferencia.",
  },
  tarjeta: {
    nombre: "Tarjeta débito / crédito",
    nota: "Te contactaremos para completar el pago de forma segura.",
  },
  addi: {
    nombre: "ADDI",
    nota: "Te contactaremos para completar tu compra con ADDI.",
  },
};

/**
 * Confirmación del pedido. Recibe la respuesta del backend
 * (`{ pedido, items, total, contacto }`) y el método de pago elegido.
 */
export default function OrderConfirmation({ resultado, metodoPago }) {
  const pedido = resultado?.pedido;
  const items = Array.isArray(resultado?.items) ? resultado.items : [];
  const total = Number(resultado?.total ?? pedido?.total) || 0;
  const idPedido = pedido?.id_pedido;
  const metodo = pedido?.metodo_pago ?? metodoPago;
  const metodoInfo = METODOS[metodo] ?? METODOS.contraentrega;
  const nombreMetodo = pedido?.metodo_pago_nombre ?? metodoInfo.nombre;
  const contacto = resultado?.contacto;

  return (
    <main className="min-h-screen bg-white font-body text-plum">
      <section className="bg-silk px-6 py-14 text-center">
        <CheckCircle2
          size={40}
          strokeWidth={ICON_STROKE}
          className="mx-auto text-dusty-rose"
          aria-hidden="true"
        />
        <p className="mt-5 text-[10px] uppercase tracking-[0.42em] text-champagne">
          {idPedido ? `Pedido #${idPedido}` : "Pedido confirmado"}
        </p>
        <h1 className="mt-3 font-heading text-4xl text-wine sm:text-5xl">
          Pedido confirmado
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mauve">
          Gracias por tu compra. Te avisaremos cuando tu pedido salga de nuestra
          bodega.
        </p>
      </section>

      <section className="mx-auto max-w-xl px-6 py-14">
        <div className="border border-border bg-white px-6 py-9 shadow-sm sm:px-8">
          {contacto?.nombre && (
            <p className="text-sm leading-relaxed text-mauve">
              Te contactaremos a nombre de{" "}
              <span className="font-medium text-wine">{contacto.nombre}</span>.
            </p>
          )}

          {items.length > 0 && (
            <>
              <h2 className="mt-6 text-[10px] uppercase tracking-[0.26em] text-mauve">
                Resumen de tu pedido
              </h2>

              <ul className="mt-3 divide-y divide-border border-y border-border">
                {items.map((item, index) => {
                  const detalle = detalleItem(item);

                  return (
                    <li
                      key={item.variante_id ?? item.id_carrito ?? index}
                      className="flex gap-3 py-3"
                    >
                      <div className="h-16 w-12 shrink-0 overflow-hidden bg-silk">
                        {item.imagen ? (
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-dusty-rose">
                            ♡
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-plum">
                          {item.nombre}
                        </p>
                        {detalle && (
                          <p className="mt-0.5 text-xs text-mauve">{detalle}</p>
                        )}
                        <p className="mt-0.5 text-xs text-mauve">
                          Cantidad: {item.cantidad}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-medium text-wine">
                        {formato(item.subtotal)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-mauve">Total</dt>
              <dd className="font-medium text-wine">{formato(total)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mauve">Método de pago</dt>
              <dd className="text-plum">{nombreMetodo}</dd>
            </div>
            {contacto?.email && (
              <div className="flex justify-between gap-4">
                <dt className="text-mauve">Correo</dt>
                <dd className="truncate text-plum">{contacto.email}</dd>
              </div>
            )}
            {contacto?.telefono && (
              <div className="flex justify-between gap-4">
                <dt className="text-mauve">Teléfono</dt>
                <dd className="text-plum">{contacto.telefono}</dd>
              </div>
            )}
          </dl>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-xs leading-relaxed text-mauve">
            <p className="flex items-start gap-2">
              <Mail
                size={14}
                strokeWidth={ICON_STROKE}
                className="mt-0.5 shrink-0 text-champagne"
                aria-hidden="true"
              />
              {metodoInfo.nota}
            </p>
            <p className="flex items-start gap-2">
              <Truck
                size={14}
                strokeWidth={ICON_STROKE}
                className="mt-0.5 shrink-0 text-champagne"
                aria-hidden="true"
              />
              Coordinamos la entrega por teléfono o correo.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <Link
              to="/productos"
              className="bg-wine px-8 py-3 text-center text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-dusty-rose"
            >
              Seguir comprando
            </Link>
            <Link
              to="/home"
              className="border border-border px-8 py-3 text-center text-xs font-medium uppercase tracking-wide text-plum transition-colors hover:border-petal hover:bg-silk"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

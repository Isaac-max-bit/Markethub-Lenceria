import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, ShoppingBag, Truck, X } from "lucide-react";
import { formatoPrecio } from "../api/catalogo";
import { actualizarPerfil } from "../api/usuarios";
import { useCarrito } from "../context/CarritoContext";
import { useSesion } from "../hooks/useSesion";
import { PAIS_POR_DEFECTO, UBICACIONES } from "../data/ubicaciones";
import OrderConfirmation from "../components/OrderConfirmation";

const ICON_STROKE = 1.25;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Igual que formatoPrecio pero tolera totales nulos.
const formatoPreciso = (valor) => formatoPrecio.format(Number(valor) || 0);

const METODOS = [
  {
    id: "contraentrega",
    nombre: "Contraentrega",
    descripcion: "Pagas en efectivo cuando recibes tu pedido.",
  },
  {
    id: "transferencia",
    nombre: "Transferencia bancaria",
    descripcion: "Te enviamos los datos de la cuenta por correo.",
  },
  {
    id: "tarjeta",
    nombre: "Tarjeta débito / crédito",
    descripcion: "Pago seguro en línea.",
  },
  {
    id: "addi",
    nombre: "ADDI",
    descripcion: "Compra ahora y paga después.",
  },
];

const formInicial = (usuario) => ({
  nombre: usuario?.nombre ?? "",
  email: usuario?.email ?? "",
  telefono: usuario?.telefono ?? "",
  direccion: usuario?.direccion ?? "",
  pais: PAIS_POR_DEFECTO,
  ciudad: "",
  departamento: "",
  notas: "",
  metodo_pago: "contraentrega",
});

const claseInput = (error) =>
  `mt-2 h-11 w-full border bg-white px-3 text-sm text-plum outline-none transition-colors placeholder:text-mauve/60 focus:border-wine ${
    error ? "border-[#c98b8b]" : "border-border"
  }`;

function Encabezado() {
  return (
    <section className="bg-silk px-6 py-14 text-center">
      <nav aria-label="Ruta de navegación" className="mb-4 text-sm text-mauve">
        <Link to="/home" className="hover:text-wine">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link to="/carrito" className="hover:text-wine">
          Carrito
        </Link>
        <span className="mx-2">/</span>
        <span className="text-wine">Pago</span>
      </nav>
      <h1 className="font-heading text-4xl text-wine sm:text-5xl">
        Finalizar compra
      </h1>
      <p className="mt-3 text-mauve">
        Solo necesitamos tus datos para entregar el pedido.
      </p>
    </section>
  );
}

function Campo({ id, label, error, ayuda, className = "", children }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-wide text-mauve"
      >
        {label}
      </label>
      {children}
      {ayuda && !error && <p className="mt-1 text-[11px] text-mauve">{ayuda}</p>}
      {error && (
        <p className="mt-1 text-xs text-wine" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function ResumenLinea({ item }) {
  const detalle = [item.color, item.talla ? `Talla ${item.talla}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="flex gap-3 py-3">
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
        <p className="truncate text-sm text-plum">{item.nombre}</p>
        {detalle && <p className="mt-0.5 text-xs text-mauve">{detalle}</p>}
        <p className="mt-0.5 text-xs text-mauve">Cantidad: {item.cantidad}</p>
      </div>

      <p className="shrink-0 text-sm font-medium text-wine">
        {formatoPrecio.format(item.subtotal)}
      </p>
    </li>
  );
}

export default function Payment() {
  const usuario = useSesion();
  const {
    items,
    total,
    cantidad,
    cargando,
    procesando,
    error,
    esInvitado,
    confirmar,
    pagarComoInvitado,
    limpiarError,
  } = useCarrito();

  const [form, setForm] = useState(() => formInicial(usuario));
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [metodoConfirmado, setMetodoConfirmado] = useState("contraentrega");

  // Si la persona inicia sesión, la página se vuelve a montar y los
  // campos se completan con los datos de su cuenta (ver formInicial).

  const ciudades =
    UBICACIONES.find((ubicacion) => ubicacion.pais === form.pais)?.ciudades ??
    [];

  const regionSeleccionada =
    ciudades.find((ciudad) => ciudad.nombre === form.ciudad)?.region ?? "";

  const cambiar = (campo) => (event) => {
    const { value } = event.target;

    setForm((actual) => ({ ...actual, [campo]: value }));
    setErrores((actual) => {
      if (!actual[campo]) return actual;
      const siguiente = { ...actual };
      delete siguiente[campo];
      return siguiente;
    });
    setAviso(null);
  };

  const cambiarCiudad = (event) => {
    const { value } = event.target;
    const ciudad = ciudades.find((opcion) => opcion.nombre === value);

    setForm((actual) => ({
      ...actual,
      ciudad: value,
      departamento: ciudad?.region ?? "",
    }));
    setErrores((actual) => {
      if (!actual.ciudad) return actual;
      const siguiente = { ...actual };
      delete siguiente.ciudad;
      return siguiente;
    });
    setAviso(null);
  };

  const cambiarPais = (event) => {
    const { value } = event.target;

    setForm((actual) => ({
      ...actual,
      pais: value,
      ciudad: "",
      departamento: "",
    }));
    setErrores((actual) => {
      const siguiente = { ...actual };
      delete siguiente.pais;
      delete siguiente.ciudad;
      return siguiente;
    });
    setAviso(null);
  };

  const validar = () => {
    const encontrados = {};

    if (form.nombre.trim().length < 2) {
      encontrados.nombre = "Escribe tu nombre completo.";
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      encontrados.email = "Escribe un correo electrónico válido.";
    }
    if (form.telefono.replace(/\D/g, "").length < 7) {
      encontrados.telefono = "Escribe un teléfono de contacto válido.";
    }
    if (form.direccion.trim().length < 5) {
      encontrados.direccion = "Escribe la dirección de entrega.";
    }
    if (!form.pais) {
      encontrados.pais = "Selecciona tu país.";
    }
    if (!form.ciudad) {
      encontrados.ciudad = "Selecciona tu ciudad de entrega.";
    }

    return encontrados;
  };

  const enviar = async (event) => {
    event.preventDefault();

    if (enviando || procesando) return;

    const encontrados = validar();
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      document.getElementById(`pago-${Object.keys(encontrados)[0]}`)?.focus();
      return;
    }

    setEnviando(true);
    setAviso(null);
    setMetodoConfirmado(form.metodo_pago);

    try {
      let resultado;

      if (esInvitado) {
        resultado = await pagarComoInvitado({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          telefono: form.telefono.trim(),
          direccion: form.direccion.trim(),
          pais: form.pais,
          ciudad: form.ciudad.trim(),
          departamento: form.departamento.trim(),
          notas: form.notas.trim(),
          metodo_pago: form.metodo_pago,
        });
      } else {
        // Guardar los datos de entrega en el perfil. Si falla, el pedido
        // se completa igual: no vale la pena bloquear la compra por esto.
        const direccion = `${form.direccion.trim()}, ${form.ciudad.trim()}${
          form.departamento.trim() ? `, ${form.departamento.trim()}` : ""
        }`.slice(0, 200);

        try {
          await actualizarPerfil({
            telefono: form.telefono.trim().slice(0, 20),
            direccion,
          });
        } catch {
          // Silencioso: el pedido sigue adelante.
        }

        resultado = await confirmar();
      }

      setPedido(resultado);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (fallo) {
      setAviso(fallo.message);
    } finally {
      setEnviando(false);
    }
  };

  if (pedido) {
    return (
      <OrderConfirmation resultado={pedido} metodoPago={metodoConfirmado} />
    );
  }

  if (cargando && items.length === 0) {
    return (
      <main className="min-h-screen bg-white font-body text-plum">
        <Encabezado />
        <p className="px-6 py-16 text-center text-sm text-mauve" role="status">
          Cargando tu pedido…
        </p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white font-body text-plum">
        <Encabezado />
        <section className="mx-auto max-w-md px-6 py-16 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center border border-border text-dusty-rose">
            <ShoppingBag size={26} strokeWidth={ICON_STROKE} />
          </span>
          <h2 className="mt-6 font-heading text-3xl text-wine">
            No hay productos para pagar
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mauve">
            Agrega tus prendas favoritas y vuelve a finalizar la compra.
          </p>
          <Link
            to="/productos"
            className="mt-8 inline-block bg-wine px-8 py-3 text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-dusty-rose"
          >
            Ver productos
          </Link>
        </section>
      </main>
    );
  }

  const bloqueado = enviando || procesando;
  const mensajeError = aviso || error?.message;

  return (
    <main className="min-h-screen bg-white font-body text-plum">
      <Encabezado />

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <Link
          to="/carrito"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-dusty-rose underline underline-offset-4 transition-colors hover:text-wine"
        >
          <ArrowLeft size={14} strokeWidth={ICON_STROKE} />
          Volver al carrito
        </Link>

        {mensajeError && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 border border-[#c98b8b] bg-[#fdf1f1] px-4 py-3 text-sm text-[#7a2e2e]"
          >
            <p>{mensajeError}</p>
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

        <form
          onSubmit={enviar}
          noValidate
          className="grid gap-10 md:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14"
        >
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <span className="flex h-6 w-6 items-center justify-center bg-wine text-xs font-medium text-white">
                  1
                </span>
                <h2 className="font-heading text-2xl text-wine">
                  Datos de contacto
                </h2>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Campo id="pago-nombre" label="Nombre completo" error={errores.nombre}>
                  <input
                    id="pago-nombre"
                    type="text"
                    autoComplete="name"
                    value={form.nombre}
                    onChange={cambiar("nombre")}
                    placeholder="Tu nombre"
                    maxLength={100}
                    className={claseInput(errores.nombre)}
                  />
                </Campo>

                <Campo id="pago-telefono" label="Teléfono" error={errores.telefono}>
                  <input
                    id="pago-telefono"
                    type="tel"
                    autoComplete="tel"
                    value={form.telefono}
                    onChange={cambiar("telefono")}
                    placeholder="300 123 4567"
                    maxLength={20}
                    className={claseInput(errores.telefono)}
                  />
                </Campo>

                <Campo
                  id="pago-email"
                  label="Correo electrónico"
                  error={errores.email}
                  ayuda="Aquí enviaremos la confirmación del pedido."
                  className="sm:col-span-2"
                >
                  <input
                    id="pago-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={cambiar("email")}
                    placeholder="tu@email.com"
                    maxLength={254}
                    className={claseInput(errores.email)}
                  />
                </Campo>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <span className="flex h-6 w-6 items-center justify-center bg-wine text-xs font-medium text-white">
                  2
                </span>
                <h2 className="font-heading text-2xl text-wine">
                  Datos de envío
                </h2>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Campo
                  id="pago-direccion"
                  label="Dirección"
                  error={errores.direccion}
                  className="sm:col-span-2"
                >
                  <input
                    id="pago-direccion"
                    type="text"
                    autoComplete="street-address"
                    value={form.direccion}
                    onChange={cambiar("direccion")}
                    placeholder="Calle 123 #45-67, Apto 201"
                    maxLength={160}
                    className={claseInput(errores.direccion)}
                  />
                </Campo>

                <Campo id="pago-pais" label="País" error={errores.pais}>
                  <select
                    id="pago-pais"
                    autoComplete="country-name"
                    value={form.pais}
                    onChange={cambiarPais}
                    className={`${claseInput(errores.pais)} cursor-pointer`}
                  >
                    {UBICACIONES.map((ubicacion) => (
                      <option key={ubicacion.pais} value={ubicacion.pais}>
                        {ubicacion.pais}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo
                  id="pago-ciudad"
                  label="Ciudad"
                  error={errores.ciudad}
                  ayuda={
                    regionSeleccionada
                      ? `Departamento: ${regionSeleccionada}`
                      : "El departamento se completa al elegir la ciudad."
                  }
                >
                  <select
                    id="pago-ciudad"
                    autoComplete="address-level2"
                    value={form.ciudad}
                    onChange={cambiarCiudad}
                    className={`${claseInput(errores.ciudad)} cursor-pointer`}
                  >
                    <option value="">Selecciona tu ciudad</option>
                    {ciudades.map((ciudad) => (
                      <option key={ciudad.nombre} value={ciudad.nombre}>
                        {ciudad.nombre}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo
                  id="pago-notas"
                  label="Notas para la entrega (opcional)"
                  ayuda="Punto de referencia, horario o indicaciones."
                  className="sm:col-span-2"
                >
                  <textarea
                    id="pago-notas"
                    rows={3}
                    value={form.notas}
                    onChange={cambiar("notas")}
                    placeholder="Ej.: entregar en la portería, llamar antes de llegar."
                    maxLength={300}
                    className="mt-2 w-full border border-border bg-white px-3 py-2 text-sm text-plum outline-none transition-colors placeholder:text-mauve/60 focus:border-wine"
                  />
                </Campo>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <span className="flex h-6 w-6 items-center justify-center bg-wine text-xs font-medium text-white">
                  3
                </span>
                <h2 className="font-heading text-2xl text-wine">
                  Método de pago
                </h2>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {METODOS.map((metodo) => {
                  const activo = form.metodo_pago === metodo.id;

                  return (
                    <label
                      key={metodo.id}
                      className={`flex cursor-pointer gap-3 border p-4 transition-colors ${
                        activo
                          ? "border-wine bg-silk/30"
                          : "border-border hover:border-mauve"
                      }`}
                    >
                      <input
                        type="radio"
                        name="metodo_pago"
                        value={metodo.id}
                        checked={activo}
                        onChange={cambiar("metodo_pago")}
                        className="mt-1 accent-wine"
                      />
                      <span>
                        <span className="block text-sm font-medium text-plum">
                          {metodo.nombre}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-mauve">
                          {metodo.descripcion}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

            </section>
          </div>

          <aside className="h-fit border border-border bg-white p-6 md:sticky md:top-24">
            <h2 className="font-heading text-2xl text-wine">Tu pedido</h2>

            <ul className="mt-3 max-h-72 divide-y divide-border overflow-y-auto border-y border-border">
              {items.map((item) => (
                <ResumenLinea key={item.id_carrito} item={item} />
              ))}
            </ul>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-mauve">Artículos ({cantidad})</dt>
                <dd className="text-plum">{formatoPreciso(total)}</dd>
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
                  {formatoPreciso(total)}
                </dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={bloqueado}
              className="mt-6 h-11 w-full bg-wine text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-dusty-rose disabled:cursor-not-allowed disabled:bg-petal disabled:text-wine/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
            >
              {bloqueado ? "Confirmando…" : "Confirmar pedido"}
            </button>

            {esInvitado ? (
              <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-mauve">
                Compras como invitado, sin crear cuenta.{" "}
                <Link
                  to="/login"
                  state={{ desde: "/pago" }}
                  className="font-medium text-dusty-rose underline underline-offset-4 hover:text-wine"
                >
                  Iniciar sesión
                </Link>
              </p>
            ) : (
              <p className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-xs leading-relaxed text-mauve">
                <Lock
                  size={14}
                  strokeWidth={ICON_STROKE}
                  className="mt-0.5 shrink-0 text-champagne"
                  aria-hidden="true"
                />
                Tu pedido quedará registrado en tu cuenta.
              </p>
            )}

            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-mauve">
              <Truck
                size={14}
                strokeWidth={ICON_STROKE}
                className="mt-0.5 shrink-0 text-champagne"
                aria-hidden="true"
              />
              Coordinamos la entrega por teléfono o correo.
            </p>
          </aside>
        </form>
      </section>
    </main>
  );
}

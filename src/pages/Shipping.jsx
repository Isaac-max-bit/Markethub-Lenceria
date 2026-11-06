import { Link } from "react-router-dom";

const opciones = [
  {
    icono: "fa-truck-fast",
    titulo: "Envíos gratis",
    texto: "Aplica para prendas sin descuento a todo el país.",
  },
  {
    icono: "fa-clock",
    titulo: "Te llega en 6 días",
    texto: "Solo 6 días hábiles para ciudades principales.",
  },
  {
    icono: "fa-credit-card",
    titulo: "Paga como prefieras",
    texto: "Tarjeta de crédito, débito, contraentrega y ADDI.",
  },
];

const tablaEnvios = [
  {
    zona: "Ciudades principales",
    tiempo: "6 días hábiles",
    sinDescuento: "Gratis",
    conDescuento: "$12.900",
  },
  {
    zona: "Otras ciudades",
    tiempo: "8 a 10 días hábiles",
    sinDescuento: "Gratis",
    conDescuento: "$15.900",
  },
  {
    zona: "Zonas rurales",
    tiempo: "10 a 12 días hábiles",
    sinDescuento: "Gratis",
    conDescuento: "$19.900",
  },
];

const pasos = [
  {
    titulo: "Confirmamos tu pedido",
    texto:
      "Recibirás un correo con el resumen de tu compra apenas se confirme el pago.",
  },
  {
    titulo: "Lo preparamos",
    texto:
      "Alistamos y empacamos tus prendas con cuidado en 1 a 2 días hábiles.",
  },
  {
    titulo: "Sale a tu dirección",
    texto:
      "Te enviamos el número de guía para que sigas el recorrido de tu paquete.",
  },
  {
    titulo: "Lo recibes",
    texto:
      "La transportadora entrega en la dirección que registraste al comprar.",
  },
];

export default function Shipping() {
  return (
    <main className="min-h-screen bg-white font-body text-plum">
      <section className="bg-silk px-6 py-14 text-center">
        <nav
          aria-label="Ruta de navegación"
          className="mb-4 text-sm text-mauve"
        >
          <Link to="/home" className="hover:text-wine">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-wine">Envíos</span>
        </nav>
        <h1 className="font-heading text-4xl text-wine sm:text-5xl">Envíos</h1>
        <p className="mt-3 text-mauve">
          Recibe tus prendas favoritas donde estés, de forma rápida y segura.
        </p>
      </section>

      <section className="border-b border-border">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3">
          {opciones.map((opcion) => (
            <li key={opcion.titulo} className="text-center">
              <i
                className={`fa-solid ${opcion.icono} text-xl text-champagne`}
                aria-hidden="true"
              />
              <h2 className="mt-4 text-sm font-medium uppercase tracking-widest">
                {opcion.titulo}
              </h2>
              <p className="mt-2 text-sm text-mauve">{opcion.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="text-center font-heading text-3xl italic text-wine">
          Tiempos y costos
        </h2>
        <p className="mt-2 text-center text-sm text-mauve">
          Los tiempos se cuentan desde que sale tu pedido de nuestra bodega.
        </p>

        <div className="mt-8 overflow-x-auto border border-border">
          <table className="w-full min-w-[34rem] text-center text-sm">
            <thead className="bg-wine text-white">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-4 font-medium uppercase tracking-wide"
                >
                  Zona
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 font-medium uppercase tracking-wide"
                >
                  Tiempo de entrega
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 font-medium uppercase tracking-wide"
                >
                  Prendas sin descuento
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 font-medium uppercase tracking-wide"
                >
                  Prendas con descuento
                </th>
              </tr>
            </thead>
            <tbody>
              {tablaEnvios.map((fila, indice) => (
                <tr
                  key={fila.zona}
                  className={indice % 2 === 0 ? "bg-white" : "bg-silk/30"}
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-heading text-lg text-wine"
                  >
                    {fila.zona}
                  </th>
                  <td className="px-4 py-4 text-mauve">{fila.tiempo}</td>
                  <td className="px-4 py-4 font-medium text-dusty-rose">
                    {fila.sinDescuento}
                  </td>
                  <td className="px-4 py-4 text-mauve">{fila.conDescuento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-silk/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center font-heading text-3xl italic text-wine">
            Así llega tu pedido
          </h2>

          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map((paso, indice) => (
              <li
                key={paso.titulo}
                className="border border-border bg-white p-8 text-center"
              >
                <span className="font-heading text-4xl text-champagne">
                  {indice + 1}
                </span>
                <h3 className="mt-3 text-sm font-medium uppercase tracking-widest text-wine">
                  {paso.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mauve">
                  {paso.texto}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14 text-center">
        <i
          className="fa-solid fa-heart text-xl text-champagne"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-heading text-2xl text-wine">
          ¿Tienes dudas sobre tu envío?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-mauve">
          Revisa nuestras preguntas frecuentes o escríbenos y con gusto te
          ayudamos a rastrear tu pedido.
        </p>

        <Link
          to="/preguntas-frecuentes"
          className="mt-8 inline-block border border-wine px-8 py-3 text-sm text-wine transition-colors hover:bg-wine hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
        >
          Ver preguntas frecuentes
        </Link>
      </section>
    </main>
  );
}

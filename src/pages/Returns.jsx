import { Link } from "react-router-dom";

const beneficios = [
  {
    icono: "fa-rotate-left",
    titulo: "Devoluciones gratis",
    texto: "Aplica para prendas sin descuento.",
  },
  {
    icono: "fa-calendar-check",
    titulo: "30 días para cambiar",
    texto: "Cuentas con 30 días desde que recibes tu pedido.",
  },
  {
    icono: "fa-shirt",
    titulo: "Cambio de talla o color",
    texto: "Elige otra talla o color según disponibilidad.",
  },
];

const aplica = [
  "Prendas sin uso, con etiquetas y empaque original.",
  "Solicitudes hechas dentro de los 30 días siguientes a la entrega.",
  "Prendas con defectos de fabricación o errores en el pedido.",
  "Cambios de talla o color sujetos a disponibilidad.",
];

const noAplica = [
  "Prendas usadas, lavadas o sin etiquetas.",
  "Prendas íntimas sin el sello de higiene intacto.",
  "Prendas en descuento, salvo defecto de fabricación.",
  "Solicitudes hechas después de los 30 días.",
];

const pasos = [
  {
    titulo: "Escríbenos",
    texto:
      "Cuéntanos tu número de pedido y qué prenda quieres cambiar o devolver.",
  },
  {
    titulo: "Empaca tu prenda",
    texto:
      "Guárdala con sus etiquetas y su empaque original, tal como la recibiste.",
  },
  {
    titulo: "Envíala",
    texto:
      "Te indicamos cómo entregarla a la transportadora, sin costo para ti.",
  },
  {
    titulo: "Recibe tu cambio",
    texto:
      "Revisamos tu prenda y te enviamos la nueva o gestionamos tu reembolso.",
  },
];

export default function Returns() {
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
          <span className="text-wine">Cambios y devoluciones</span>
        </nav>
        <h1 className="font-heading text-4xl text-wine sm:text-5xl">
          Cambios y devoluciones
        </h1>
        <p className="mt-3 text-mauve">
          Queremos que ames tu prenda. Si no es así, te ayudamos a cambiarla.
        </p>
      </section>

      <section className="border-b border-border">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3">
          {beneficios.map((beneficio) => (
            <li key={beneficio.titulo} className="text-center">
              <i
                className={`fa-solid ${beneficio.icono} text-xl text-champagne`}
                aria-hidden="true"
              />
              <h2 className="mt-4 text-sm font-medium uppercase tracking-widest">
                {beneficio.titulo}
              </h2>
              <p className="mt-2 text-sm text-mauve">{beneficio.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="text-center font-heading text-3xl italic text-wine">
          Condiciones
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="border border-border p-8">
            <h3 className="font-heading text-2xl text-wine">Sí aplica</h3>
            <ul className="mt-5 grid gap-4">
              {aplica.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-mauve"
                >
                  <i
                    className="fa-solid fa-check mt-1 text-champagne"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-silk/30 p-8">
            <h3 className="font-heading text-2xl text-wine">No aplica</h3>
            <ul className="mt-5 grid gap-4">
              {noAplica.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-mauve"
                >
                  <i
                    className="fa-solid fa-xmark mt-1 text-dusty-rose"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-silk/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center font-heading text-3xl italic text-wine">
            Cómo solicitar tu cambio
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
        <h2 className="font-heading text-2xl text-wine">Sobre tu reembolso</h2>
        <p className="mt-3 text-sm leading-relaxed text-mauve">
          Si prefieres que te devolvamos tu dinero, lo hacemos por el mismo
          medio de pago que usaste al comprar. Una vez aprobada la devolución,
          el reembolso se refleja en 5 a 10 días hábiles, según tu banco.
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

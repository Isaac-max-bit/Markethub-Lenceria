import { Link } from "react-router-dom";

const tablaTallas = [
  { talla: "XS", busto: "80 - 84", cintura: "60 - 64", cadera: "86 - 90" },
  { talla: "S", busto: "84 - 88", cintura: "64 - 68", cadera: "90 - 94" },
  { talla: "M", busto: "88 - 92", cintura: "68 - 72", cadera: "94 - 98" },
  { talla: "L", busto: "92 - 96", cintura: "72 - 76", cadera: "98 - 102" },
  { talla: "XL", busto: "96 - 100", cintura: "76 - 80", cadera: "102 - 106" },
];

const pasos = [
  {
    titulo: "Busto",
    texto:
      "Rodea con la cinta la parte más prominente del pecho, manteniéndola recta y paralela al suelo.",
  },
  {
    titulo: "Cintura",
    texto:
      "Mide la parte más estrecha de tu torso, justo por encima del ombligo, sin apretar la cinta.",
  },
  {
    titulo: "Cadera",
    texto:
      "Pasa la cinta por la parte más ancha de tus caderas, con los pies juntos.",
  },
];

export default function SizeGuide() {
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
          <span className="text-wine">Guía de tallas</span>
        </nav>
        <h1 className="font-heading text-4xl text-wine sm:text-5xl">
          Guía de tallas
        </h1>
        <p className="mt-3 text-mauve">
          Encuentra la talla que se ajusta a ti con total comodidad.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="text-center font-heading text-3xl italic text-wine">
          Tabla de medidas
        </h2>
        <p className="mt-2 text-center text-sm text-mauve">
          Todas las medidas están en centímetros.
        </p>

        <div className="mt-8 overflow-x-auto border border-border">
          <table className="w-full min-w-[28rem] text-center text-sm">
            <thead className="bg-wine text-white">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-4 font-medium uppercase tracking-wide"
                >
                  Talla
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 font-medium uppercase tracking-wide"
                >
                  Busto
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 font-medium uppercase tracking-wide"
                >
                  Cintura
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 font-medium uppercase tracking-wide"
                >
                  Cadera
                </th>
              </tr>
            </thead>
            <tbody>
              {tablaTallas.map((fila, indice) => (
                <tr
                  key={fila.talla}
                  className={indice % 2 === 0 ? "bg-white" : "bg-silk/30"}
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-heading text-xl text-wine"
                  >
                    {fila.talla}
                  </th>
                  <td className="px-4 py-4 text-mauve">{fila.busto}</td>
                  <td className="px-4 py-4 text-mauve">{fila.cintura}</td>
                  <td className="px-4 py-4 text-mauve">{fila.cadera}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-silk/30">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-heading text-3xl italic text-wine">
            Cómo medirte
          </h2>

          <ol className="mt-10 grid gap-6 md:grid-cols-3">
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
          ¿Estás entre dos tallas?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-mauve">
          Te recomendamos elegir la talla mayor si prefieres una prenda más
          cómoda y holgada, o la menor si buscas un ajuste firme. Mídete usando
          ropa ligera y sin apretar la cinta.
        </p>

        <Link
          to="/productos"
          className="mt-8 inline-block border border-wine px-8 py-3 text-sm text-wine transition-colors hover:bg-wine hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
        >
          Ver productos
        </Link>
      </section>
    </main>
  );
}

import { Link } from "react-router-dom";

const grupos = [
  {
    titulo: "Tallas",
    preguntas: [
      {
        pregunta: "¿Cómo sé cuál es mi talla?",
        respuesta: (
          <>
            Mídete busto, cintura y cadera y compáralas con nuestra{" "}
            <Link
              to="/guia-de-tallas"
              className="text-dusty-rose underline underline-offset-4 hover:text-wine"
            >
              guía de tallas
            </Link>
            .
          </>
        ),
      },
      {
        pregunta: "¿Qué hago si estoy entre dos tallas?",
        respuesta:
          "Elige la talla mayor si prefieres una prenda más cómoda y holgada, o la menor si buscas un ajuste firme.",
      },
    ],
  },
  {
    titulo: "Pedidos y envíos",
    preguntas: [
      {
        pregunta: "¿Cuánto tarda en llegar mi pedido?",
        respuesta: (
          <>
            En ciudades principales llega en 6 días hábiles. Consulta los demás
            tiempos en la página de{" "}
            <Link
              to="/envios"
              className="text-dusty-rose underline underline-offset-4 hover:text-wine"
            >
              envíos
            </Link>
            .
          </>
        ),
      },
      {
        pregunta: "¿El envío tiene costo?",
        respuesta:
          "El envío es gratis para prendas sin descuento. En prendas con descuento se cobra un valor según tu zona.",
      },
      {
        pregunta: "¿Cómo puedo rastrear mi pedido?",
        respuesta:
          "Cuando tu pedido sale de nuestra bodega te enviamos al correo el número de guía para que sigas su recorrido.",
      },
    ],
  },
  {
    titulo: "Pagos",
    preguntas: [
      {
        pregunta: "¿Qué métodos de pago aceptan?",
        respuesta:
          "Aceptamos tarjeta de crédito, tarjeta débito, pago contraentrega y ADDI.",
      },
      {
        pregunta: "¿Es seguro pagar en la tienda?",
        respuesta:
          "Sí. Tus datos de pago se procesan por medios seguros y no los almacenamos.",
      },
    ],
  },
  {
    titulo: "Cambios y devoluciones",
    preguntas: [
      {
        pregunta: "¿Puedo cambiar mi prenda?",
        respuesta: (
          <>
            Sí, tienes 30 días desde que recibes tu pedido. Conoce las
            condiciones en{" "}
            <Link
              to="/devoluciones"
              className="text-dusty-rose underline underline-offset-4 hover:text-wine"
            >
              cambios y devoluciones
            </Link>
            .
          </>
        ),
      },
      {
        pregunta: "¿Las devoluciones tienen costo?",
        respuesta:
          "No, las devoluciones son gratis para prendas sin descuento.",
      },
    ],
  },
  {
    titulo: "Cuidado de las prendas",
    preguntas: [
      {
        pregunta: "¿Cómo debo lavar mis prendas?",
        respuesta:
          "Lávalas a mano o en ciclo delicado con agua fría, sin blanqueador, y sécalas a la sombra para conservar la forma y el color.",
      },
      {
        pregunta: "¿Puedo usar secadora?",
        respuesta:
          "No lo recomendamos, porque el calor puede dañar los elásticos y el encaje.",
      },
    ],
  },
];

export default function Faq() {
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
          <span className="text-wine">Preguntas frecuentes</span>
        </nav>
        <h1 className="font-heading text-4xl text-wine sm:text-5xl">
          Preguntas frecuentes
        </h1>
        <p className="mt-3 text-mauve">
          Resolvemos las dudas más comunes sobre tus compras.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="grid gap-12">
          {grupos.map((grupo) => (
            <div key={grupo.titulo}>
              <h2 className="font-heading text-3xl italic text-wine">
                {grupo.titulo}
              </h2>

              <div className="mt-4 border-t border-border">
                {grupo.preguntas.map((item) => (
                  <details
                    key={item.pregunta}
                    className="group border-b border-border py-4"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose">
                      {item.pregunta}
                      <span className="text-xl text-dusty-rose transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-mauve">
                      {item.respuesta}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-silk/30">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <i
            className="fa-solid fa-heart text-xl text-champagne"
            aria-hidden="true"
          />
          <h2 className="mt-4 font-heading text-2xl text-wine">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mauve">
            Escríbenos y con gusto te ayudamos a resolver tu duda.
          </p>

          <Link
            to="/productos"
            className="mt-8 inline-block border border-wine px-8 py-3 text-sm text-wine transition-colors hover:bg-wine hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusty-rose"
          >
            Seguir comprando
          </Link>
        </div>
      </section>
    </main>
  );
}

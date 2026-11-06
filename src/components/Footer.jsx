import { Link } from "react-router-dom";

const shopLinks = [
  { label: "Ofertas", to: "/ofertas" },
  { label: "Productos", to: "/productos" },
  { label: "Conjuntos", to: "/productos?categoria=conjuntos" },
  { label: "Brasieres", to: "/productos?categoria=brasieres" },
  { label: "Panties", to: "/productos?categoria=panties" },
  { label: "Pijamas", to: "/productos?categoria=pijamas" },
];

const helpLinks = [
  { label: "Guía de tallas", to: "/guia-de-tallas" },
  { label: "Envíos", to: "/envios" },
  { label: "Cambios y devoluciones", to: "/devoluciones" },
  { label: "Preguntas frecuentes", to: "/preguntas-frecuentes" },
];

const paymentMethods = ["VISA", "MASTERCARD", "PSE", "NEQUI"];

const columnTitle =
  "mb-[18px] text-[10px] font-semibold uppercase tracking-[0.18em] text-silk sm:mb-6 sm:text-[11px]";

const columnLink =
  "text-xs text-petal transition-colors hover:text-champagne sm:text-[13px]";

const socialLink =
  "flex size-9 items-center justify-center rounded-full border border-champagne/35 text-champagne transition-colors hover:border-champagne hover:bg-champagne hover:text-plum";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="0.8" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M9 8.5c.3-.5.6-.5.9-.5.2 0 .4 0 .6.5l.8 1.7c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.7 1.1 1.6 2 2.8 2.6.3.2.5.1.7-.1l.8-1c.2-.2.4-.3.7-.1l1.7.8c.3.2.5.3.5.6 0 .3-.2 1-.6 1.3-.5.5-1.2.8-2 .8-1.1 0-2.4-.5-4-1.5-2-1.3-3.5-3.3-3.9-4.5-.4-1.1-.4-2.1.1-2.7Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-plum font-body text-silk">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 px-6 pb-12 pt-14 sm:gap-x-9 sm:gap-y-12 sm:px-[6%] sm:pb-14 sm:pt-[60px] lg:grid-cols-[1.5fr_1fr_1.2fr_1.2fr] lg:gap-14 lg:px-[6.25%] lg:pb-16 lg:pt-[76px]">
        <div className="col-span-2 flex flex-col items-start sm:col-span-1">
          <Link
            to="/home"
            className="font-heading text-[26px] font-medium tracking-[0.2em] text-silk transition-colors hover:text-champagne sm:text-[30px]"
          >
            LENCERÍA LR
          </Link>

          <p className="mt-3.5 max-w-[230px] font-heading text-[17px] italic leading-normal text-petal sm:text-[19px]">
            Porque la lencería también es amor propio.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={socialLink}
            >
              <InstagramIcon />
            </a>

            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className={socialLink}
            >
              <FacebookIcon />
            </a>

            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className={socialLink}
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className={columnTitle}>Comprar</h3>
          <ul className="flex flex-col gap-[13px] sm:gap-[15px]">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className={columnLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={columnTitle}>Ayuda</h3>
          <ul className="flex flex-col gap-[13px] sm:gap-[15px]">
            {helpLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className={columnLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={columnTitle}>Contacto</h3>
          <ul className="flex flex-col gap-[13px] sm:gap-[15px]">
            <li>
              <a
                href="https://wa.me/573000000000"
                target="_blank"
                rel="noreferrer"
                className={columnLink}
              >
                +57 300 000 0000
              </a>
            </li>
            <li>
              <a href="mailto:hola@lenceria-lr.com" className={columnLink}>
                hola@lenceria-lr.com
              </a>
            </li>
          </ul>

          <div className="mt-6 sm:mt-[30px]">
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-champagne">
              Horario de atención
            </span>
            <p className="mt-1.5 text-xs text-petal sm:text-[13px]">
              Lunes a sábado
            </p>
            <p className="mt-1.5 text-xs text-petal sm:text-[13px]">
              9:00 a. m. a 6:00 p. m.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-[18px] border-t border-silk/20 px-6 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-5 sm:px-[6%] lg:px-[6.25%]">
        <p className="text-[11px] text-petal">
          © {new Date().getFullYear()} Lencería LR. Todos los derechos
          reservados.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
          <Link
            to="/terminos-y-condiciones"
            className="text-[11px] text-petal transition-colors hover:text-champagne"
          >
            Términos y condiciones
          </Link>
          <Link
            to="/politica-de-privacidad"
            className="text-[11px] text-petal transition-colors hover:text-champagne"
          >
            Política de privacidad
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="border border-silk/25 px-2 py-1.5 text-[9px] font-semibold tracking-[0.04em] text-silk"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

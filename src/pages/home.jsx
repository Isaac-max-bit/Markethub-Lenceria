import { Link } from "react-router-dom";
import { PackageCheck, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import SectionTitle from "../components/SectionTitle";
import EstadoCatalogo from "../components/EstadoCatalogo";
import { aTarjeta } from "../api/catalogo";
import { useProductos } from "../hooks/useProductos";
import {
  heroPrincipal,
  categories,
  editorialBanner,
  benefits,
  testimonials,
} from "../data/homeData";

const ICONOS_SERVICIO = {
  envio: Truck,
  cambios: PackageCheck,
  pago: ShieldCheck,
};

function Section({ title, subtitle, children, className = "" }) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionTitle subtitle={subtitle}>{title}</SectionTitle>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const { productos, cargando, error, recargar } = useProductos();

  const bestSellers = productos
    .slice(0, 6)
    .map((producto) => ({ ...aTarjeta(producto), badge: "Más vendido" }));

  const discounted = productos
    .filter((producto) => producto.precioAnterior)
    .slice(0, 4)
    .map(aTarjeta);

  return (
    <>
      <section className="relative w-full overflow-hidden bg-white">
        <Link
          to={heroPrincipal.to}
          className="relative block aspect-[32/19] w-full md:aspect-[96/37]"
        >
          <picture className="absolute inset-0 block h-full w-full">
            <source media="(min-width: 768px)" srcSet={heroPrincipal.image} />
            <img
              src={heroPrincipal.mobileImage}
              alt={heroPrincipal.alt}
              style={{ objectPosition: heroPrincipal.position ?? "center" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        </Link>
      </section>

      {/* Cuadrícula editorial de categorías */}
      <section className="border-y border-border/60 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-10 md:mb-12">
            <h2 className="font-heading text-3xl italic leading-none text-plum md:text-5xl">
              Comprar por categoría
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mauve md:text-base">
              Piezas pensadas para acompañarte todos los días. Elige tu
              esencial.
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {categories.map((category, index) => {
              const destacada = index === 0;

              return (
                <li
                  key={category.id}
                  className={
                    destacada
                      ? "col-span-2 md:col-span-2 md:row-span-2"
                      : undefined
                  }
                >
                  <Link
                    to={`/productos?categoria=${category.slug}`}
                    className={`group relative block overflow-hidden bg-[#E8E4DF] ${
                      destacada
                        ? "aspect-[4/3] md:aspect-auto md:h-full"
                        : "aspect-[4/5]"
                    }`}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      style={{ objectPosition: category.position ?? "center" }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/75"
                    />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
                      <span>
                        <span className="block text-[9px] tracking-[0.3em] text-white/55">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mt-1.5 block font-heading text-xl italic leading-none text-white md:text-2xl">
                          {category.name}
                        </span>
                      </span>
                      <span className="translate-y-1 text-[9px] uppercase tracking-[0.24em] text-white/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white/80">
                        Ver
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Más vendidos: mismo ritmo editorial que la cuadrícula de categorías */}
      <section className="border-b border-border/60 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 md:mb-12">
            <div>
              <h2 className="font-heading text-3xl italic leading-none text-plum md:text-5xl">
                Más vendidos
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mauve md:text-base">
                Las favoritas de nuestras clientas, elegidas por su comodidad y
                su ajuste.
              </p>
            </div>

            <Link
              to="/productos"
              className="group inline-flex items-center gap-2 border-b border-plum/20 pb-1.5 text-[10px] uppercase tracking-[0.24em] text-plum transition-colors duration-300 hover:border-plum/70 hover:text-wine md:text-[11px]"
            >
              Ver todo
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          <EstadoCatalogo
            cargando={cargando}
            error={error}
            vacio={bestSellers.length === 0}
            mensajeVacio="Todavía no hay productos cargados."
            onReintentar={recargar}
          >
            <ProductCarousel
              products={bestSellers}
              label="Productos más vendidos"
            />
          </EstadoCatalogo>
        </div>
      </section>

      <section className="relative h-[26rem] overflow-hidden bg-petal md:h-[34rem]">
        <img
          src={editorialBanner.image}
          alt={editorialBanner.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[68%_22%] md:object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-plum/85 via-plum/45 to-plum/5 md:from-plum/80 md:via-plum/25 md:to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="max-w-sm text-white md:max-w-md">
              <h2 className="font-heading text-[2.1rem] italic leading-[1.12] md:text-6xl">
                {editorialBanner.title}
              </h2>
              <Link
                to={editorialBanner.to}
                className="mt-9 inline-flex items-center border border-white/70 px-8 py-3.5 text-[10px] uppercase tracking-[0.26em] transition-colors duration-300 hover:border-white hover:bg-white hover:text-plum md:text-[11px]"
              >
                {editorialBanner.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section
        title="Productos en descuento"
        subtitle="Las prendas que más te gustan con precios especiales, por tiempo limitado"
      >
        <EstadoCatalogo
          cargando={cargando}
          error={error}
          vacio={discounted.length === 0}
          mensajeVacio="Por ahora no hay productos en descuento."
          onReintentar={recargar}
        >
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {discounted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        </EstadoCatalogo>
      </Section>

      {/* Servicios: íconos de línea fina y títulos serif con subrayado */}
      <section className="border-y border-border/60 bg-cream">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border/70 px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
          {benefits.map((benefit) => {
            const Icono = ICONOS_SERVICIO[benefit.icon] ?? Truck;

            return (
              <li
                key={benefit.id}
                className="flex flex-col items-center px-6 py-8 text-center md:py-9"
              >
                <Icono
                  size={32}
                  strokeWidth={1}
                  aria-hidden="true"
                  className="text-plum"
                />
                <h3 className="mt-4 inline-block border-b border-plum/25 pb-1 font-heading text-[18px] leading-none text-plum md:text-[20px]">
                  {benefit.title}
                </h3>
                <p className="mt-2 font-heading text-[12px] italic leading-relaxed text-mauve md:text-[13px]">
                  {benefit.text}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <Section
        title="Qué dicen nuestros clientes"
        subtitle="Opiniones reales de quienes ya usan nuestras prendas todos los días"
        className="bg-white"
      >
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => {
            const iniciales = item.name
              .split(/\s+/)
              .map((parte) => parte[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <li
                key={item.id}
                className="group relative flex flex-col border border-border/70 bg-cream px-7 pb-7 pt-8 shadow-[0_12px_32px_-26px_rgba(74,21,38,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-champagne/60 hover:shadow-[0_18px_40px_-24px_rgba(74,21,38,0.35)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-4 select-none font-heading text-6xl leading-none text-champagne/25"
                >
                  ”
                </span>

                <p
                  className="flex items-center gap-1 text-[13px] tracking-[0.18em] text-champagne"
                  aria-label={`${item.rating} de 5 estrellas`}
                >
                  {"★".repeat(item.rating)}
                  <span className="text-champagne/30">
                    {"★".repeat(5 - item.rating)}
                  </span>
                </p>

                <blockquote className="mt-5 font-heading text-[1.45rem] italic leading-snug text-plum">
                  “{item.comment}”
                </blockquote>

                <div className="mt-auto flex items-center gap-3 border-t border-border/60 pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-silk font-heading text-sm text-wine"
                  >
                    {iniciales}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-plum">
                    {item.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}

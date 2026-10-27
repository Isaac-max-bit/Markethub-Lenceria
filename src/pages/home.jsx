import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";
import SectionTitle from "../components/SectionTitle";
import {
  carouselSlides,
  categories,
  bestSellers,
  discounted,
  editorialBanner,
  benefits,
  testimonials,
} from "../data/homeData";

function Section({ title, subtitle, children, className = "" }) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle subtitle={subtitle}>{title}</SectionTitle>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroCarousel slides={carouselSlides} />

      <Section title="Comprar por categoría">
        <ul className="grid grid-cols-2 gap-1.5 md:grid-cols-6">
          {categories.map((category, index) => (
            <li
              key={category.id}
              className={
                index < 3
                  ? "md:col-span-2"
                  : index === categories.length - 1
                    ? "col-span-2 md:col-span-3"
                    : "md:col-span-3"
              }
            >
              <Link
                to={`/categoria/${category.slug}`}
                className="group relative block h-56 overflow-hidden bg-silk md:h-72"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30" />
                <span className="absolute inset-0 flex items-center justify-center px-2 text-center font-heading text-2xl italic text-white md:text-3xl">
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Más vendidos"
        subtitle="Las favoritas de nuestras clientas, elegidas por su comodidad y su ajuste"
        className="bg-silk/30"
      >
        <ProductCarousel
          products={bestSellers}
          label="Productos más vendidos"
        />
      </Section>

      <section className="border-b border-border">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3">
          {benefits.map((benefit) => (
            <li key={benefit.id} className="text-center">
              <i
                className={`fa-solid ${benefit.icon} text-xl text-champagne`}
                aria-hidden="true"
              />
              <h3 className="mt-4 text-sm font-medium uppercase tracking-widest">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-mauve">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative h-[26rem] overflow-hidden bg-petal md:h-[32rem]">
        <img
          src={editorialBanner.image}
          alt={editorialBanner.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-xs uppercase tracking-[0.3em]">
            {editorialBanner.eyebrow}
          </p>
          <h2 className="mt-4 max-w-2xl font-heading text-4xl italic md:text-6xl">
            {editorialBanner.title}
          </h2>
          <Link
            to={editorialBanner.to}
            className="mt-8 border border-white px-8 py-3 text-sm font-medium tracking-wide transition-colors hover:bg-white hover:text-plum"
          >
            {editorialBanner.cta}
          </Link>
        </div>
      </section>

      <Section
        title="Productos en descuento"
        subtitle="Las prendas que más te gustan con precios especiales, por tiempo limitado"
      >
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {discounted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      </Section>

      <Section
        title="Qué dicen nuestros clientes"
        subtitle="Opiniones reales de quienes ya usan nuestras prendas todos los días"
        className="bg-silk/30"
      >
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <li
              key={item.id}
              className="border border-border bg-white p-8 text-center"
            >
              <p
                className="text-champagne"
                aria-label={`${item.rating} de 5 estrellas`}
              >
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </p>
              <blockquote className="mt-4 font-heading text-xl italic text-plum">
                {item.comment}
              </blockquote>
              <p className="mt-5 text-xs uppercase tracking-widest text-mauve">
                {item.name}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

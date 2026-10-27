import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HeroCarousel({ slides, interval = 6500 }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (index) => {
    setCurrent((index + slides.length) % slides.length);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (paused || reduceMotion || slides.length < 2) return;

    const timer = setTimeout(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, interval);

    return () => clearTimeout(timer);
  }, [current, paused, slides.length, interval]);

  if (!slides.length) return null;

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Colecciones destacadas"
      className="group relative w-full overflow-hidden bg-silk"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <ul
        className="flex w-full transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <li
            key={slide.id}
            className="w-full min-w-0 shrink-0"
            aria-hidden={index !== current}
          >
            <Link
              to={slide.to}
              tabIndex={index === current ? 0 : -1}
              className="relative block w-full aspect-[1920/700]"
            >
              <picture className="absolute inset-0 block h-full w-full">
                <source media="(min-width: 768px)" srcSet={slide.image} />

                <img
                  src={slide.mobileImage}
                  alt={slide.alt}
                  className="absolute inset-0 h-full w-full object-contain md:object-cover"
                />
              </picture>
            </Link>
          </li>
        ))}
      </ul>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            aria-label="Imagen anterior"
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/80 text-2xl text-plum opacity-0 transition-all duration-300 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => goTo(current + 1)}
            aria-label="Imagen siguiente"
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/80 text-2xl text-plum opacity-0 transition-all duration-300 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
          >
            ›
          </button>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir a la imagen ${index + 1}`}
                aria-current={index === current}
                className={`h-[3px] w-8 transition-colors ${
                  index === current
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

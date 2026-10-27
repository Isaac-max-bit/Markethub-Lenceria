import { useRef } from "react";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products, label }) {
  const trackRef = useRef(null);

  const scrollByPage = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9 });
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
    >
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth motion-reduce:scroll-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="w-[60%] shrink-0 snap-start sm:w-[42%] md:w-[calc((100%-4.5rem)/4)]"
          />
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        aria-label="Productos anteriores"
        className="absolute left-2 top-[40%] flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-2xl text-plum shadow-sm transition-colors hover:bg-white"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        aria-label="Productos siguientes"
        className="absolute right-2 top-[40%] flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-2xl text-plum shadow-sm transition-colors hover:bg-white"
      >
        ›
      </button>
    </div>
  );
}

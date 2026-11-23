import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const arrowClass =
  "absolute top-[38%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-plum/15 bg-white/85 text-plum shadow-[0_14px_30px_-24px_rgba(62,26,38,0.6)] backdrop-blur transition-colors duration-300 hover:border-plum/40 hover:bg-plum hover:text-silk md:flex";

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
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth motion-reduce:scroll-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="w-[62%] shrink-0 snap-start sm:w-[42%] md:w-[calc((100%-4.5rem)/4)]"
          />
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        aria-label="Productos anteriores"
        className={`${arrowClass} -left-5`}
      >
        <ChevronLeft size={18} strokeWidth={1.2} />
      </button>
      <button
        type="button"
        onClick={() => scrollByPage(1)}
        aria-label="Productos siguientes"
        className={`${arrowClass} -right-5`}
      >
        <ChevronRight size={18} strokeWidth={1.2} />
      </button>
    </div>
  );
}

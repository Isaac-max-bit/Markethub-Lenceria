export default function SectionTitle({ children, subtitle }) {
  return (
    <div className="mb-10 md:mb-12">
      <h2 className="font-heading text-3xl italic leading-none text-plum md:text-5xl">
        {children}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mauve md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

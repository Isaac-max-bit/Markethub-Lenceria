export default function SectionTitle({ children, subtitle }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="font-heading text-3xl leading-tight text-plum md:text-4xl">
        {children}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-mauve md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

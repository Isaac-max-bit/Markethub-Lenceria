export default function SectionTitle({ children, subtitle }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="font-heading text-2xl md:text-3xl text-plum">
        {children}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-lg text-sm text-mauve">{subtitle}</p>
      )}
      <span className="mx-auto mt-5 block h-px w-16 bg-champagne" />
    </div>
  );
}

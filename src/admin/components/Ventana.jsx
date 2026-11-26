import { useEffect } from "react";
import { X } from "lucide-react";

// Ventana modal compartida por las páginas del panel. Cierra con Escape
// y con clic en el fondo, y bloquea el scroll de la página mientras está abierta.
export default function Ventana({
  titulo,
  descripcion,
  onCerrar,
  children,
  ancho = "max-w-2xl",
}) {
  useEffect(() => {
    const alPresionar = (evento) => {
      if (evento.key === "Escape") onCerrar();
    };

    document.addEventListener("keydown", alPresionar);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-plum/45 p-4 py-8 sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 h-full w-full"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`relative z-10 w-full ${ancho} rounded-lg border border-border bg-card shadow-2xl shadow-plum/20`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">
              {titulo}
            </h2>
            {descripcion && (
              <p className="mt-1 text-sm text-muted">{descripcion}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink"
          >
            <X size={20} strokeWidth={1.7} />
          </button>
        </header>

        {children}
      </div>
    </div>
  );
}

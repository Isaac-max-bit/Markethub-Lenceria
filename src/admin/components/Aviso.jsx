import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

// Aviso flotante que se cierra solo. tipo: "ok" | "error".
export default function Aviso({ aviso, onCerrar }) {
  useEffect(() => {
    if (!aviso) return undefined;
    const temporizador = setTimeout(onCerrar, 4500);
    return () => clearTimeout(temporizador);
  }, [aviso, onCerrar]);

  if (!aviso) return null;

  const esError = aviso.tipo === "error";
  const Icono = esError ? AlertCircle : CheckCircle2;

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-[60] flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${
        esError
          ? "border-dusty-rose/50 bg-card text-accent"
          : "border-border bg-card text-ink"
      }`}
    >
      <Icono
        size={18}
        strokeWidth={1.8}
        className={esError ? "mt-0.5 text-accent" : "mt-0.5 text-dusty-rose"}
        aria-hidden="true"
      />
      <span className="flex-1">{aviso.texto}</span>
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar aviso"
        className="text-muted transition-colors hover:text-ink"
      >
        <X size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}

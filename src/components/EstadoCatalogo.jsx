// Estados compartidos por las páginas que cargan el catálogo desde la API.
export default function EstadoCatalogo({
  cargando,
  error,
  vacio,
  mensajeVacio = "Todavía no hay productos disponibles.",
  onReintentar,
  children,
}) {
  if (cargando) {
    return (
      <p className="py-12 text-center text-sm text-mauve" role="status">
        Cargando productos…
      </p>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md py-12 text-center" role="alert">
        <p className="text-sm text-wine">{error.message}</p>
        {onReintentar && (
          <button
            type="button"
            onClick={onReintentar}
            className="mt-5 border border-wine px-7 py-2 text-sm text-wine transition-colors hover:bg-wine hover:text-white"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (vacio) {
    return (
      <p className="mx-auto max-w-md py-12 text-center text-sm text-mauve">
        {mensajeVacio}
      </p>
    );
  }

  return children;
}

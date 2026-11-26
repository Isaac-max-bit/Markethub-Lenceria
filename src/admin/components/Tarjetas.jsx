// Tarjetas compartidas del panel. Mantienen el mismo lenguaje visual que
// el resumen general: KPI saturados, indicadores blancos y paneles.
export function Kpi({ etiqueta, valor, icono: Icono, tono }) {
  return (
    <article
      className={`flex flex-col items-center justify-center gap-2.5 rounded-lg px-4 py-7 text-center ${tono}`}
    >
      <Icono size={34} strokeWidth={1.5} aria-hidden="true" />
      <p className="text-[15px]">{etiqueta}</p>
      <p className="font-display text-[30px] font-semibold leading-none">
        {valor}
      </p>
    </article>
  );
}

export function Indicador({ etiqueta, valor, icono: Icono, tono }) {
  return (
    <article className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-5.5">
      <span
        className={`flex h-14.5 w-14.5 shrink-0 items-center justify-center rounded-full text-white ${tono}`}
      >
        <Icono size={22} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] text-muted">{etiqueta}</span>
        <span className="mt-1 block truncate font-display text-[28px] font-semibold leading-tight text-ink">
          {valor}
        </span>
      </span>
    </article>
  );
}

export function Panel({ titulo, detalle, children }) {
  return (
    <article className="min-w-0 rounded-lg border border-border bg-card p-6">
      <header className="flex flex-wrap items-baseline gap-3">
        <h3 className="font-display text-lg font-semibold text-ink">
          {titulo}
        </h3>
        {detalle && (
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
            {detalle}
          </span>
        )}
      </header>
      {children}
    </article>
  );
}

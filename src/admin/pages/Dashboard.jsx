import { useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  Layers,
  ShoppingBag,
  Truck,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RESUMEN = [
  {
    etiqueta: "Pedidos de hoy",
    valor: "$897.400",
    icono: Layers,
    tono: "bg-dusty-rose text-white",
  },
  {
    etiqueta: "Este mes",
    valor: "$13,1 M",
    icono: Clock,
    tono: "bg-[#e9a9a6] text-plum",
  },
  {
    etiqueta: "Ventas totales",
    valor: "$626,5 M",
    icono: Calendar,
    tono: "bg-vino text-silk",
  },
];

const INDICADORES = [
  {
    etiqueta: "Total pedidos",
    valor: 815,
    icono: ShoppingBag,
    tono: "bg-dusty-rose",
  },
  { etiqueta: "Pendientes", valor: 263, icono: Clock, tono: "bg-champagne" },
  { etiqueta: "En camino", valor: 97, icono: Truck, tono: "bg-mauve" },
  { etiqueta: "Entregados", valor: 418, icono: Check, tono: "bg-vino" },
];

const VENTAS_SEMANA = [
  { dia: "23 nov", ventas: 400, pedidos: 4 },
  { dia: "22 nov", ventas: 300, pedidos: 3 },
  { dia: "21 nov", ventas: 100, pedidos: 1 },
  { dia: "20 nov", ventas: 250, pedidos: 3 },
  { dia: "19 nov", ventas: 200, pedidos: 2 },
  { dia: "18 nov", ventas: 300, pedidos: 3 },
  { dia: "17 nov", ventas: 1000, pedidos: 10 },
];

const MAS_VENDIDOS = [
  { nombre: "Conjunto Encaje Rosé", valor: 32, color: "#a94f63" },
  { nombre: "Body Seda Champagne", valor: 26, color: "#c6a27c" },
  { nombre: "Bralette Petal", valor: 24, color: "#8a5a6b" },
  { nombre: "Pijama Satín Vino", valor: 18, color: "var(--vino)" },
];

const ULTIMOS_PEDIDOS = [
  {
    id: 11,
    cliente: "Manuela Bolivar",
    fecha: "21 de nov",
    estado: "pendiente",
    total: "$ 139.800",
  },
  {
    id: 9,
    cliente: "Manuela Bolivar",
    fecha: "21 de nov",
    estado: "pendiente",
    total: "$ 69.900",
  },
  {
    id: 2,
    cliente: "ADMIN",
    fecha: "21 de oct",
    estado: "entregado",
    total: "$ 95.000",
  },
  {
    id: 1,
    cliente: "ADMIN",
    fecha: "21 de oct",
    estado: "pendiente",
    total: "$ 90.000",
  },
];

const STOCK_BAJO = [
  { producto: "Body Elegante", variante: "L · Negro", unidades: 2 },
  { producto: "Body Elegante", variante: "M · Negro", unidades: 2 },
  { producto: "Pijama Satinada", variante: "S · Rosado", unidades: 2 },
  { producto: "Pijama Sueños", variante: "M · Blanco", unidades: 2 },
  { producto: "Pijama Satinada", variante: "M · Rosado", unidades: 2 },
  { producto: "Pijama Sueños", variante: "S · Blanco", unidades: 2 },
];

const PEDIDOS_POR_ESTADO = [
  {
    estado: "pendiente",
    porcentaje: 75,
    cantidad: 3,
    total: "$ 299.700",
    color: "#c6a27c",
  },
  {
    estado: "en camino",
    porcentaje: 0,
    cantidad: 0,
    total: "$ 0",
    color: "#a94f63",
  },
  {
    estado: "entregado",
    porcentaje: 25,
    cantidad: 1,
    total: "$ 95.000",
    color: "#8a5a6b",
  },
  {
    estado: "cancelado",
    porcentaje: 0,
    cantidad: 0,
    total: "$ 0",
    color: "var(--vino)",
  },
];

const BADGES = {
  pendiente: "bg-champagne/35 text-ink",
  "en camino": "bg-act text-ink",
  entregado: "bg-solid text-silk",
  cancelado: "bg-dusty-rose text-white",
};

const SERIES = {
  ventas: {
    ticks: [0, 200, 400, 600, 800, 1000],
    eje: (valor) => `$${valor}k`,
    detalle: (valor) => [`$${valor}k`, "Ventas"],
  },
  pedidos: {
    ticks: [0, 2, 4, 6, 8, 10],
    eje: (valor) => valor,
    detalle: (valor) => [`${valor} pedidos`, "Pedidos"],
  },
};

const ESTILO_TOOLTIP = {
  border: "1px solid var(--border)",
  borderRadius: 0,
  backgroundColor: "var(--card)",
  color: "var(--ink)",
  fontSize: 12,
};

function Kpi({ etiqueta, valor, icono: Icono, tono }) {
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

function Indicador({ etiqueta, valor, icono: Icono, tono }) {
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

function Panel({ titulo, detalle, children }) {
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

export default function Dashboard() {
  const [metrica, setMetrica] = useState("ventas");
  const serie = SERIES[metrica];

  return (
    <section className="space-y-5">
      <h1 className="font-display text-[28px] font-semibold text-ink">
        Resumen general
      </h1>

      <div className="grid gap-3.5 md:grid-cols-3">
        {RESUMEN.map((item) => (
          <Kpi key={item.etiqueta} {...item} />
        ))}
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {INDICADORES.map((item) => (
          <Indicador key={item.etiqueta} {...item} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel titulo="Ventas de la semana">
          <div className="mb-4 mt-4 flex gap-1.5 border-b border-border">
            {[
              { clave: "ventas", texto: "Ventas" },
              { clave: "pedidos", texto: "Pedidos" },
            ].map((opcion) => (
              <button
                key={opcion.clave}
                type="button"
                onClick={() => setMetrica(opcion.clave)}
                className={`-mb-px border-b-2 px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  metrica === opcion.clave
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {opcion.texto}
              </button>
            ))}
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={VENTAS_SEMANA}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="dia"
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  ticks={serie.ticks}
                  domain={[0, serie.ticks[serie.ticks.length - 1]]}
                  tickFormatter={serie.eje}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={serie.detalle}
                  contentStyle={ESTILO_TOOLTIP}
                  labelStyle={{ color: "var(--ink)" }}
                  cursor={{ stroke: "var(--border)" }}
                />
                <Line
                  type="linear"
                  dataKey={metrica}
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "var(--vino)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel titulo="Productos más vendidos">
          <ul className="mb-2.5 mt-5 flex flex-wrap justify-center gap-x-[18px] gap-y-1.5 text-xs text-muted">
            {MAS_VENDIDOS.map((fila) => (
              <li key={fila.nombre} className="flex items-center">
                <span
                  aria-hidden="true"
                  className="mr-1.5 inline-block h-[9px] w-[22px]"
                  style={{ backgroundColor: fila.color }}
                />
                {fila.nombre}
              </li>
            ))}
          </ul>

          <div className="mx-auto h-[300px] max-w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MAS_VENDIDOS}
                  dataKey="valor"
                  nameKey="nombre"
                  outerRadius="95%"
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {MAS_VENDIDOS.map((fila) => (
                    <Cell key={fila.nombre} fill={fila.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(valor, nombre) => [`${valor} uds`, nombre]}
                  contentStyle={ESTILO_TOOLTIP}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Panel titulo="Últimos pedidos">
            <table className="mt-3.5 w-full border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  <th className="pb-2.5 font-medium">Pedido</th>
                  <th className="pb-2.5 font-medium">Cliente</th>
                  <th className="pb-2.5 font-medium">Estado</th>
                  <th className="pb-2.5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {ULTIMOS_PEDIDOS.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-[13px] pr-2 text-muted">#{pedido.id}</td>
                    <td className="py-[13px] pr-2 text-ink">
                      {pedido.cliente}
                      <small className="block text-xs text-muted">
                        {pedido.fecha}
                      </small>
                    </td>
                    <td className="py-[13px] pr-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-[9px] py-1 text-[10px] uppercase tracking-[0.12em] ${BADGES[pedido.estado]}`}
                      >
                        <span className="h-1.5 w-1.5 bg-current" />
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="py-[13px] text-right text-ink">
                      {pedido.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel titulo="Stock bajo">
            <ul className="mt-2.5">
              {STOCK_BAJO.map((fila) => (
                <li
                  key={`${fila.producto}-${fila.variante}`}
                  className="flex items-center justify-between gap-2.5 border-b border-border py-3 last:border-0"
                >
                  <span className="text-ink">
                    {fila.producto}
                    <small className="block text-[11px] uppercase tracking-[0.1em] text-muted">
                      {fila.variante}
                    </small>
                  </span>
                  <span className="bg-act px-[9px] py-[3px] text-xs text-ink">
                    {fila.unidades} uds
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel titulo="Pedidos por estado" detalle="Historial completo">
        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {PEDIDOS_POR_ESTADO.map((fila) => (
            <article
              key={fila.estado}
              className="rounded-lg border border-border bg-page p-4"
            >
              <header className="flex justify-between text-[11px] uppercase tracking-[0.14em] text-muted">
                <span>{fila.estado}</span>
                <span>{fila.porcentaje}%</span>
              </header>
              <p className="mt-2.5 font-display text-[26px] font-semibold leading-none text-ink">
                {fila.cantidad}
              </p>
              <p className="mt-1 text-[13px] text-muted">{fila.total}</p>
              <div className="mt-3 h-1 bg-card">
                <div
                  className="h-full"
                  style={{
                    width: `${Math.max(fila.porcentaje, 4)}%`,
                    backgroundColor: fila.color,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  obtenerMasVendidos,
  obtenerPedidosPorDia,
  obtenerPedidosPorEstado,
  obtenerPedidosRecientes,
  obtenerProductosBajoStock,
  obtenerResumenDashboard,
  obtenerVentasPorDia,
  obtenerVentasTotales,
} from "../../api/admin";
import { formatoPrecio } from "../../api/catalogo";
import { cerrarSesion } from "../../api/sesion";
import { useSesion } from "../../hooks/useSesion";
import { Indicador, Kpi, Panel } from "../components/Tarjetas";

// Las rutas del dashboard responden { success, mensaje, data }.
const datosDe = (respuesta, defecto) => respuesta?.data ?? defecto;

const dinero = (valor) => formatoPrecio.format(Number(valor) || 0);

// Cifras grandes abreviadas para las tarjetas: "$394,7 k" / "$13,1 M".
const dineroCorto = (valor) => {
  const numero = Number(valor) || 0;

  if (numero >= 1000000) {
    return `$${(numero / 1000000).toFixed(1).replace(".", ",")} M`;
  }

  if (numero >= 10000) {
    return `$${(numero / 1000).toFixed(1).replace(".", ",")} k`;
  }

  return dinero(numero);
};

const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

// "2026-11-23" -> "23 nov"
const fechaDia = (clave) => {
  const [, mes, dia] = String(clave).split("-");
  return `${Number(dia)} ${MESES[Number(mes) - 1] ?? mes}`;
};

// Fecha completa del pedido en hora local: "21 de nov".
const fechaPedido = (valor) => {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "";
  return `${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
};

const claveLocal = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
    fecha.getDate(),
  ).padStart(2, "0")}`;

const PALETA = ["#a94f63", "#c6a27c", "#8a5a6b", "#5b2333", "#e9a9a6"];

// Los cuatro estados de la tabla EstadoPedido, en orden de operación.
const ESTADOS = [
  { clave: "PENDIENTE", etiqueta: "pendiente", color: "#c6a27c" },
  { clave: "EN CAMINO", etiqueta: "en camino", color: "#a94f63" },
  { clave: "ENTREGADO", etiqueta: "entregado", color: "#8a5a6b" },
  { clave: "CANCELADO", etiqueta: "cancelado", color: "#5b2333" },
];

const BADGES = {
  pendiente: "bg-champagne/35 text-ink",
  "en camino": "bg-act text-ink",
  entregado: "bg-solid text-silk",
  cancelado: "bg-dusty-rose text-white",
};

const SERIES = {
  ventas: {
    eje: (valor) => `$${valor}k`,
    detalle: (valor) => [`$${valor}k`, "Ventas"],
  },
  pedidos: {
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

export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = useSesion();
  const esAdmin = String(usuario?.rol || "").toLowerCase() === "admin";
  const [metrica, setMetrica] = useState(esAdmin ? "ventas" : "pedidos");
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(
    async (signal) => {
      setCargando(true);
      setError("");

      const ahora = new Date();
      const inicioMes = `${claveLocal(ahora).slice(0, 7)}-01`;
      const finMes = claveLocal(ahora);

      // El vendedor no consulta nada que devuelva dinero.
      const consultas = {
        resumen: esAdmin ? obtenerResumenDashboard({ signal }) : null,
        hoy: esAdmin ? obtenerVentasPorDia(1, { signal }) : null,
        semana: esAdmin
          ? obtenerVentasPorDia(7, { signal })
          : obtenerPedidosPorDia(7, { signal }),
        totales: esAdmin ? obtenerVentasTotales({}, { signal }) : null,
        mes: esAdmin
          ? obtenerVentasTotales({ desde: inicioMes, hasta: finMes }, { signal })
          : null,
        pedidos: obtenerPedidosRecientes({ signal }),
        masVendidos: obtenerMasVendidos({ signal }),
        bajoStock: obtenerProductosBajoStock({ signal }),
        estados: obtenerPedidosPorEstado({ signal }),
      };

      const claves = Object.keys(consultas);
      const respuestas = await Promise.allSettled(
        claves.map((clave) => consultas[clave] ?? Promise.resolve(null)),
      );

      if (signal?.aborted) return;

      const resultado = Object.fromEntries(
        claves.map((clave, indice) => [clave, respuestas[indice]]),
      );
      const rechazos = respuestas.filter((r) => r.status === "rejected");

      // Token vencido: se cierra sesión y se vuelve al login.
      if (rechazos.some((r) => r.reason?.estado === 401)) {
        cerrarSesion();
        navigate("/login", { replace: true });
        return;
      }

      if (rechazos.some((r) => r.reason?.estado === 403)) {
        setError("Tu usuario no tiene permisos para ver esta sección.");
        setCargando(false);
        return;
      }

      const valor = (clave) =>
        resultado[clave]?.status === "fulfilled"
          ? datosDe(resultado[clave].value, null)
          : null;

      setDatos({
        resumen: valor("resumen"),
        hoy: valor("hoy")?.totalIngresos ?? 0,
        semana: valor("semana")?.serie ?? [],
        totales: valor("totales")?.ingresosTotales ?? 0,
        mes: valor("mes")?.ingresosTotales ?? 0,
        pedidos: valor("pedidos") ?? [],
        masVendidos: valor("masVendidos") ?? [],
        bajoStock: valor("bajoStock") ?? [],
        estados: valor("estados") ?? [],
      });

      if (rechazos.length) {
        setError(
          "No se pudieron cargar todas las secciones. Revisa que el backend esté encendido.",
        );
      }

      setCargando(false);
    },
    [esAdmin, navigate],
  );

  useEffect(() => {
    const controlador = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar(controlador.signal);
    return () => controlador.abort();
  }, [cargar]);

  const resumen = datos?.resumen;
  const totalPedidos =
    Number(resumen?.totalPedidos) ||
    (datos?.estados ?? []).reduce(
      (suma, fila) => suma + (Number(fila.pedidos) || 0),
      0,
    );

  // El vendedor solo tiene la métrica de pedidos (nunca ingresos).
  const metricaActiva = esAdmin ? metrica : "pedidos";
  const opcionesMetrica = esAdmin
    ? [
        { clave: "ventas", texto: "Ventas" },
        { clave: "pedidos", texto: "Pedidos" },
      ]
    : [{ clave: "pedidos", texto: "Pedidos" }];

  const pedidosDe = useCallback(
    (estado) =>
      Number(
        (datos?.estados ?? []).find((fila) => fila.estado === estado)?.pedidos,
      ) || 0,
    [datos],
  );

  const tarjetas = [
    {
      etiqueta: "Ventas de hoy",
      valor: dinero(datos?.hoy ?? 0),
      icono: Layers,
      tono: "bg-dusty-rose text-white",
    },
    {
      etiqueta: "Este mes",
      valor: dineroCorto(datos?.mes ?? 0),
      icono: Clock,
      tono: "bg-[#e9a9a6] text-plum",
    },
    {
      etiqueta: "Ventas totales",
      valor: dineroCorto(datos?.totales ?? 0),
      icono: Calendar,
      tono: "bg-vino text-silk",
    },
  ];

  const indicadores = [
    {
      etiqueta: "Total pedidos",
      valor: totalPedidos,
      icono: ShoppingBag,
      tono: "bg-dusty-rose",
    },
    {
      etiqueta: "Pendientes",
      valor: pedidosDe("PENDIENTE"),
      icono: Clock,
      tono: "bg-champagne",
    },
    {
      etiqueta: "En camino",
      valor: pedidosDe("EN CAMINO"),
      icono: Truck,
      tono: "bg-mauve",
    },
    {
      etiqueta: "Entregados",
      valor: pedidosDe("ENTREGADO"),
      icono: Check,
      tono: "bg-vino",
    },
  ];

  // La gráfica muestra el día más reciente primero, como el diseño original.
  const ventasSemana = useMemo(
    () =>
      [...(datos?.semana ?? [])].reverse().map((dia) => ({
        dia: fechaDia(dia.fecha),
        ventas: Math.round((Number(dia.ingresos) || 0) / 1000),
        pedidos: Number(dia.pedidos) || 0,
      })),
    [datos],
  );

  const ticks = useMemo(() => {
    const maximo = Math.max(
      1,
      ...ventasSemana.map((dia) => Number(dia[metricaActiva]) || 0),
    );
    const paso = Math.max(1, Math.ceil(maximo / 4));

    return Array.from({ length: 5 }, (_, indice) => paso * indice);
  }, [ventasSemana, metricaActiva]);

  const masVendidos = useMemo(
    () =>
      (datos?.masVendidos ?? []).slice(0, 5).map((producto, indice) => ({
        nombre: producto.nombre,
        valor: Number(producto.unidadesVendidas) || 0,
        color: PALETA[indice % PALETA.length],
      })),
    [datos],
  );

  const ultimosPedidos = useMemo(
    () =>
      (datos?.pedidos ?? []).slice(0, 5).map((pedido) => ({
        id: pedido.id_pedido,
        cliente: pedido.cliente || "Invitada",
        fecha: fechaPedido(pedido.fecha),
        estado: String(pedido.estado || "").toLowerCase(),
        total: dinero(pedido.total),
      })),
    [datos],
  );

  const stockBajo = useMemo(
    () =>
      (datos?.bajoStock ?? []).slice(0, 6).map((variante) => ({
        id: variante.id_variante,
        producto: variante.nombre,
        variante: `${variante.talla} · ${variante.color}`,
        unidades: Number(variante.stock) || 0,
        agotado: Boolean(variante.agotado),
      })),
    [datos],
  );

  const pedidosPorEstado = useMemo(
    () =>
      ESTADOS.map(({ clave, etiqueta, color }) => {
        const fila = (datos?.estados ?? []).find(
          (registro) => registro.estado === clave,
        );
        const cantidad = Number(fila?.pedidos) || 0;

        return {
          estado: etiqueta,
          cantidad,
          porcentaje:
            totalPedidos > 0 ? Math.round((cantidad / totalPedidos) * 100) : 0,
          total: dinero(fila?.ingresos ?? 0),
          color,
        };
      }),
    [datos, totalPedidos],
  );

  const serie = SERIES[metricaActiva];

  if (cargando) {
    return (
      <section className="space-y-5">
        <div className="h-9 w-56 animate-pulse rounded-md bg-border" />
        <div className="grid gap-3.5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, indice) => (
            <div
              key={indice}
              className="h-[150px] animate-pulse rounded-lg bg-border"
            />
          ))}
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, indice) => (
            <div
              key={indice}
              className="h-[92px] animate-pulse rounded-lg bg-border"
            />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-[390px] animate-pulse rounded-lg bg-border" />
          <div className="h-[390px] animate-pulse rounded-lg bg-border" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <h1 className="font-display text-[28px] font-semibold text-ink">
        Resumen general
      </h1>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-dusty-rose/40 bg-card px-4 py-3 text-sm text-accent"
        >
          {error}
        </div>
      )}

      {esAdmin && (
        <div className="grid gap-3.5 md:grid-cols-3">
          {tarjetas.map((item) => (
            <Kpi key={item.etiqueta} {...item} />
          ))}
        </div>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {indicadores.map((item) => (
          <Indicador key={item.etiqueta} {...item} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          titulo={esAdmin ? "Ventas de la semana" : "Pedidos de la semana"}
        >
          {esAdmin && (
            <div className="mb-4 mt-4 flex gap-1.5 border-b border-border">
              {opcionesMetrica.map((opcion) => (
                <button
                  key={opcion.clave}
                  type="button"
                  onClick={() => setMetrica(opcion.clave)}
                  className={`-mb-px border-b-2 px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    metricaActiva === opcion.clave
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {opcion.texto}
                </button>
              ))}
            </div>
          )}

          <div className={esAdmin ? "h-[260px]" : "mt-4 h-[292px]"}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ventasSemana}
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
                  ticks={ticks}
                  domain={[0, ticks[ticks.length - 1]]}
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
                  dataKey={metricaActiva}
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
          {masVendidos.length === 0 ? (
            <p className="mt-5 text-sm text-muted">
              Aún no hay ventas registradas.
            </p>
          ) : (
            <>
              <ul className="mb-2.5 mt-5 flex flex-wrap justify-center gap-x-[18px] gap-y-1.5 text-xs text-muted">
                {masVendidos.map((fila) => (
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
                      data={masVendidos}
                      dataKey="valor"
                      nameKey="nombre"
                      outerRadius="95%"
                      stroke="var(--card)"
                      strokeWidth={2}
                    >
                      {masVendidos.map((fila) => (
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
            </>
          )}
        </Panel>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Panel titulo="Últimos pedidos">
            {ultimosPedidos.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Todavía no hay pedidos.</p>
            ) : (
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
                  {ultimosPedidos.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-[13px] pr-2 text-muted">
                        #{pedido.id}
                      </td>
                      <td className="py-[13px] pr-2 text-ink">
                        {pedido.cliente}
                        <small className="block text-xs text-muted">
                          {pedido.fecha}
                        </small>
                      </td>
                      <td className="py-[13px] pr-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-[9px] py-1 text-[10px] uppercase tracking-[0.12em] ${
                            BADGES[pedido.estado] ?? "bg-act text-ink"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 bg-current" />
                          {pedido.estado || "sin estado"}
                        </span>
                      </td>
                      <td className="py-[13px] text-right text-ink">
                        {pedido.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel titulo="Stock bajo">
            {stockBajo.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Todo el inventario está en orden.
              </p>
            ) : (
              <ul className="mt-2.5">
                {stockBajo.map((fila) => (
                  <li
                    key={fila.id}
                    className="flex items-center justify-between gap-2.5 border-b border-border py-3 last:border-0"
                  >
                    <span className="text-ink">
                      {fila.producto}
                      <small className="block text-[11px] uppercase tracking-[0.1em] text-muted">
                        {fila.variante}
                      </small>
                    </span>
                    <span className="bg-act px-[9px] py-[3px] text-xs text-ink">
                      {fila.agotado ? "Agotado" : `${fila.unidades} uds`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <Panel titulo="Pedidos por estado" detalle="Historial completo">
        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {pedidosPorEstado.map((fila) => (
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
              {esAdmin && (
                <p className="mt-1 text-[13px] text-muted">{fila.total}</p>
              )}
              <div className="mt-3 h-1 bg-card">
                <div
                  className="h-full"
                  style={{
                    width:
                      fila.porcentaje > 0
                        ? `${Math.max(fila.porcentaje, 4)}%`
                        : 0,
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

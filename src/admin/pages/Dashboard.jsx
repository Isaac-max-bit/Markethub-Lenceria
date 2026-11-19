import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, DollarSign, Package, RefreshCw, Users } from "lucide-react";
import {
  obtenerClientes,
  obtenerPerfilAdmin,
  obtenerProductosAdmin,
} from "../../api/admin";
import { aProducto, formatoPrecio } from "../../api/catalogo";
import { cerrarSesion } from "../../api/sesion";

const STOCK_BAJO = 5;

const lista = (datos, clave) =>
  Array.isArray(datos) ? datos : datos?.[clave] || [];

function Tarjeta({ titulo, valor, icono: Icono, aviso }) {
  return (
    <article className="flex items-center gap-4 border border-border bg-white p-6">
      <div
        className={`flex h-12 w-12 items-center justify-center ${
          aviso ? "bg-red-50 text-red-700" : "bg-silk text-wine"
        }`}
      >
        <Icono size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-mauve">{titulo}</p>
        <p className="truncate font-heading text-3xl text-plum">{valor}</p>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async (signal) => {
    setCargando(true);
    setError("");

    const [prod, cli, per] = await Promise.allSettled([
      obtenerProductosAdmin({ signal }),
      obtenerClientes({ signal }),
      obtenerPerfilAdmin({ signal }),
    ]);

    if (signal?.aborted) return;

    // Token vencido o sin permisos: se cierra sesión y se vuelve al login.
    const noAutorizado = [prod, cli, per].find(
      (r) => r.status === "rejected" && [401, 403].includes(r.reason?.estado),
    );
    if (noAutorizado) {
      cerrarSesion();
      navigate("/login", { replace: true });
      return;
    }

    if (prod.status === "fulfilled")
      setProductos(lista(prod.value, "productos").map(aProducto));
    if (cli.status === "fulfilled")
      setClientes(lista(cli.value, "usuarios"));
    if (per.status === "fulfilled") setPerfil(per.value);

    const fallidos = [
      prod.status === "rejected" && "productos",
      cli.status === "rejected" && "clientes",
      per.status === "rejected" && "perfil",
    ].filter(Boolean);

    if (fallidos.length) {
      setError(
        `No se pudieron cargar: ${fallidos.join(", ")}. Revisa que el backend esté encendido.`,
      );
    }
    setCargando(false);
  }, [navigate]);

  useEffect(() => {
    const controlador = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar(controlador.signal);
    return () => controlador.abort();
  }, [cargar]);

  const metricas = useMemo(() => {
    const valorInventario = productos.reduce((t, p) => t + p.precio * p.stock, 0);
    const bajoStock = productos
      .filter((p) => p.stock <= STOCK_BAJO)
      .sort((a, b) => a.stock - b.stock);

    const porCategoria = Object.values(
      productos.reduce((acc, p) => {
        acc[p.categoriaNombre] ??= { nombre: p.categoriaNombre, unidades: 0 };
        acc[p.categoriaNombre].unidades += p.stock;
        return acc;
      }, {}),
    ).sort((a, b) => b.unidades - a.unidades);

    return { valorInventario, bajoStock, porCategoria };
  }, [productos]);

  if (cargando) {
    return <p className="text-sm text-mauve">Cargando panel administrativo…</p>;
  }

  const nombre = perfil?.nombre?.split(" ")[0];

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl text-plum">Dashboard</h1>
          <p className="mt-1 text-sm text-mauve">
            Bienvenido{nombre ? `, ${nombre}` : ""}. Resumen de MarketHub.
          </p>
        </div>
        <button
          type="button"
          onClick={() => cargar()}
          className="flex items-center gap-2 border border-border bg-white px-4 py-2 text-sm text-wine transition hover:border-dusty-rose"
        >
          <RefreshCw size={15} /> Actualizar
        </button>
      </div>

      {error && (
        <div role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tarjeta titulo="Productos" valor={productos.length} icono={Package} />
        <Tarjeta titulo="Clientes" valor={clientes.length} icono={Users} />
        <Tarjeta
          titulo="Valor del inventario"
          valor={formatoPrecio.format(metricas.valorInventario)}
          icono={DollarSign}
        />
        <Tarjeta
          titulo="Stock bajo"
          valor={metricas.bajoStock.length}
          icono={AlertTriangle}
          aviso={metricas.bajoStock.length > 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <article className="border border-border bg-white p-6 lg:col-span-3">
          <h3 className="mb-4 font-heading text-xl text-plum">
            Unidades en stock por categoría
          </h3>
          {metricas.porCategoria.length === 0 ? (
            <p className="text-sm text-mauve">Aún no hay productos.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricas.porCategoria}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ebd3ce" vertical={false} />
                  <XAxis dataKey="nombre" tick={{ fill: "#8a5a6b", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#8a5a6b", fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "#f8d0cb55" }} />
                  <Bar dataKey="unidades" name="Unidades" fill="#a94f63" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="border border-border bg-white p-6 lg:col-span-2">
          <h3 className="mb-4 font-heading text-xl text-plum">
            Productos con stock bajo
          </h3>
          {metricas.bajoStock.length === 0 ? (
            <p className="text-sm text-mauve">Todo el inventario está en orden.</p>
          ) : (
            <ul className="divide-y divide-border">
              {metricas.bajoStock.slice(0, 7).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="truncate text-plum">{p.nombre}</span>
                  <span
                    className={`shrink-0 px-2 py-0.5 text-xs ${
                      p.stock === 0 ? "bg-red-100 text-red-800" : "bg-silk text-wine"
                    }`}
                  >
                    {p.stock === 0 ? "Agotado" : `${p.stock} uds`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
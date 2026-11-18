
import { useEffect, useState } from "react";
import {
  obtenerProductosAdmin,
  obtenerClientes,
  obtenerPerfilAdmin,
} from "./dashboardService";

export default function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError("");

        const resultados = await Promise.allSettled([
          obtenerProductosAdmin(),
          obtenerClientes(),
          obtenerPerfilAdmin(),
        ]);

        if (!activo) return;

        if (resultados[0].status === "fulfilled") {
          const datos = resultados[0].value;
          setProductos(Array.isArray(datos) ? datos : datos?.productos || []);
        }

        if (resultados[1].status === "fulfilled") {
          const datos = resultados[1].value;
          setClientes(Array.isArray(datos) ? datos : datos?.usuarios || []);
        }

        if (resultados[2].status === "fulfilled") {
          setPerfil(resultados[2].value);
        }

        const errores = resultados.filter(
          (resultado) => resultado.status === "rejected"
        );

        if (errores.length === 3) {
          setError("No se pudieron cargar los datos del panel administrativo.");
        }
      } catch (err) {
        if (activo) {
          setError(err.message || "Error al cargar el dashboard.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarDatos();

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return <div className="admin-dashboard">Cargando panel administrativo...</div>;
  }

  return (
    <section className="admin-dashboard">
      <h1>Dashboard</h1>
      <p>
        Bienvenido{perfil?.nombre ? `, ${perfil.nombre}` : ""} al panel
        administrativo de MarketHub.
      </p>

      {error && (
        <div role="alert" style={{ color: "red", marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div className="dashboard-stats">
        <article className="dashboard-card">
          <h3>Productos</h3>
          <strong>{productos.length}</strong>
        </article>

        <article className="dashboard-card">
          <h3>Clientes</h3>
          <strong>{clientes.length}</strong>
        </article>

        <article className="dashboard-card">
          <h3>Administrador</h3>
          <strong>{perfil?.nombre || perfil?.email || "Mi perfil"}</strong>
        </article>
      </div>
    </section>
  );
}

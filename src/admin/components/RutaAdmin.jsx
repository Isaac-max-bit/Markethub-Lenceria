import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSesion } from "../../hooks/useSesion";
import { obtenerToken } from "../../api/sesion";

// Protege /admin: exige sesión iniciada y rol "admin" o "vendedor".
// Es solo una barrera de UX; la seguridad real debe validarla el backend.
const RUTAS_VENDEDOR = ["/admin/productos", "/admin/pedidos"];

export default function RutaAdmin() {
  const usuario = useSesion();
  const ubicacion = useLocation();

  if (!usuario || !obtenerToken()) {
    return (
      <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
    );
  }

  // En la base de datos el rol se guarda como "ADMIN"; se compara sin
  // distinguir mayúsculas para que el panel funcione con ambos formatos.
  const rol = String(usuario.rol || "").toLowerCase();

  if (rol !== "admin" && rol !== "vendedor") {
    return <Navigate to="/home" replace />;
  }

  const ruta = ubicacion.pathname.replace(/\/+$/, "");
  const permitida =
    ruta === "/admin" ||
    RUTAS_VENDEDOR.some((base) => ruta === base || ruta.startsWith(`${base}/`));

  if (rol === "vendedor" && !permitida) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

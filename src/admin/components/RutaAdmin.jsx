import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSesion } from "../../hooks/useSesion";
import { obtenerToken } from "../../api/sesion";

// Protege /admin: exige sesión iniciada y rol "admin".
// Es solo una barrera de UX; la seguridad real debe validarla el backend.
export default function RutaAdmin() {
  const usuario = useSesion();
  const ubicacion = useLocation();

  if (!usuario || !obtenerToken()) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  // En la base de datos el rol se guarda como "ADMIN"; se compara sin
  // distinguir mayúsculas para que el panel funcione con ambos formatos.
  if (String(usuario.rol || "").toLowerCase() !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
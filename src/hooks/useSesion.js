import { useEffect, useState } from "react";
import { EVENTO_SESION, obtenerSesion } from "../api/sesion";

export function useSesion() {
  const [usuario, setUsuario] = useState(() => obtenerSesion());

  useEffect(() => {
    const actualizar = () => setUsuario(obtenerSesion());

    window.addEventListener(EVENTO_SESION, actualizar);
    window.addEventListener("storage", actualizar);

    return () => {
      window.removeEventListener(EVENTO_SESION, actualizar);
      window.removeEventListener("storage", actualizar);
    };
  }, []);

  return usuario;
}

import { useCallback, useEffect, useState } from "react";
import { listarProductos } from "../api/catalogo";

// Caché en memoria: si varias páginas piden el catálogo, se hace
// una sola petición al backend.
let cache = null;
let enVuelo = null;

export function useProductos() {
  const [productos, setProductos] = useState(() => cache ?? []);
  const [cargando, setCargando] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return;

    let vigente = true;
    const peticion = enVuelo ?? listarProductos();
    enVuelo = peticion;

    peticion
      .then((datos) => {
        cache = datos;
        if (vigente) setProductos(datos);
      })
      .catch((fallo) => {
        if (vigente) setError(fallo);
      })
      .finally(() => {
        enVuelo = null;
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  const recargar = useCallback(async () => {
    cache = null;
    setCargando(true);
    setError(null);

    try {
      const datos = await listarProductos();
      cache = datos;
      setProductos(datos);
    } catch (fallo) {
      setError(fallo);
    } finally {
      setCargando(false);
    }
  }, []);

  return { productos, cargando, error, recargar };
}

// Cliente HTTP centralizado para comunicarse con el backend Express.
// La URL se configura en el archivo .env del frontend:
// VITE_API_URL=http://localhost:3000

import { obtenerToken } from "../api/sesion";

//URL del backend
const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

// Clase para manejar errores HTTP 
export class APIError extends Error {
    constructor(mensaje, estado, datos) {
        super(mensaje);
        this.name = "APIError";
        this.estado = estado;
        this.datos = datos;
    }
}

// Convertir respuesta a JSON
const parsear = (texto) => {
  if (!texto) return null;

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
};

// Cliente HTTP principal
export async function api(
  ruta,
  {
    method = "GET",
    body,
    signal,
    headers = {},
    auth = true,
  } = {}
) {
  // Obtener JWT de la sesión actual
  const token = auth ? obtenerToken() : null;

  // Detectar FormData para evitar serializarlo como JSON
  const esFormData =
    typeof FormData !== "undefined" &&
    body instanceof FormData;

  // Preparar cabeceras
  const cabeceras = {
    ...headers,
  };

  // Agregar Content-Type únicamente cuando corresponde
  if (body !== undefined && !esFormData) {
    cabeceras["Content-Type"] = "application/json";
  }

  // Enviar JWT al backend
  if (token) {
    cabeceras.Authorization = `Bearer ${token}`;
  }

  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers: cabeceras,
      body:
        body === undefined
          ? undefined
          : esFormData
            ? body
            : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new APIError(
      "No se pudo conectar con el servidor. Verifica que el backend esté encendido.",
      0,
      null
    );
  }

  // Procesar respuesta
  const datos = parsear(await respuesta.text());

  // Detectar errores HTTP
  if (!respuesta.ok) {
    const mensaje =
      (datos &&
        typeof datos === "object" &&
        datos.error) ||
      `Error ${respuesta.status} al llamar a la API`;

    throw new APIError(
      mensaje,
      respuesta.status,
      datos
    );
  }

  return datos;
}
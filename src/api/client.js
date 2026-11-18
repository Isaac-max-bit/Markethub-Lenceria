// Cliente HTTP centralizado para hablar con el backend de Express.
// La URL se configura en el archivo .env del front:
//   VITE_API_URL=http://localhost:3000

import { obtenerToken } from "./sesion";

// URL del backend 
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, ""); // Elimina la barra final si existe

// Clase para manejar errores HTTP
export class APIError extends Error {
  constructor(mensaje, estado, datos) {
    super(mensaje);
    this.name = "APIError";
    this.estado = estado;
    this.datos = datos;
  }
}

//Convertir respuesta a JSON

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
  const token = auth ? obtenerToken() : null;

  const esFormData =
    typeof FormData !== "undefined" &&
    body instanceof FormData;

  const cabeceras = {
    ...headers,
  };

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

  const datos = parsear(await respuesta.text());

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
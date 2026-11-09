// Cliente HTTP centralizado para hablar con el backend de Express.
// La URL se configura en el archivo .env del front:
//   VITE_API_URL=http://localhost:3000
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(mensaje, estado, datos) {
    super(mensaje);
    this.name = "ApiError";
    this.estado = estado;
    this.datos = datos;
  }
}

const parsear = (texto) => {
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
};

/**
 * Hace una petición a la API y devuelve el JSON de la respuesta.
 * Lanza ApiError con el mensaje del servidor cuando la respuesta no es 2xx.
 */
export async function api(ruta, { method = "GET", body, signal } = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;

    throw new ApiError(
      "No se pudo conectar con el servidor. Verifica que el backend esté encendido.",
      0,
      null,
    );
  }

  const datos = parsear(await respuesta.text());

  if (!respuesta.ok) {
    const mensaje =
      (datos && typeof datos === "object" && datos.error) ||
      `Error ${respuesta.status} al llamar a la API`;

    throw new ApiError(mensaje, respuesta.status, datos);
  }

  return datos;
}

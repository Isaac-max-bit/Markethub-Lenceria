import { api } from "./client";

// ============ PRODUCTOS ============
export const obtenerProductosAdmin = (opciones) => api("/productos", opciones);

export const crearProducto = (datos) =>
  api("/productos", { method: "POST", body: datos });

export const actualizarProducto = (id, datos) =>
  api(`/productos/${encodeURIComponent(id)}`, { method: "PATCH", body: datos });

export const eliminarProducto = (id) =>
  api(`/productos/${encodeURIComponent(id)}`, { method: "DELETE" });

// ============ CLIENTES ============
export const obtenerClientes = (opciones) => api("/usuarios", opciones);

export const buscarClientes = (nombre = "") => {
  const termino = nombre.trim();
  return termino
    ? api(`/usuarios/buscar?nombre=${encodeURIComponent(termino)}`)
    : obtenerClientes();
};

// ============ PERFIL ============
export const obtenerPerfilAdmin = (opciones) => api("/usuarios/perfil", opciones);
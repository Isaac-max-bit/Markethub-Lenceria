
import { api } from "../client";

// ====================================
// PRODUCTOS
// ====================================

const json = (method, datos) => ({
  method,
  body: datos,
});

export const obtenerProductosAdmin = () =>
  api("/productos");

export const obtenerProducto = (id) =>
  api(`/productos/${encodeURIComponent(id)}`);

export const crearProducto = (datos) =>
  api("/productos", json("POST", datos));

export const actualizarProducto = (id, datos) =>
  api(`/productos/${encodeURIComponent(id)}`, json("PATCH", datos));

export const eliminarProducto = (id) =>
  api(`/productos/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

// ====================================
// CLIENTES
// ====================================

export const obtenerClientes = () =>
  api("/usuarios");

export const buscarClientes = (nombre = "") => {
  const termino = nombre.trim();

  return termino
    ? api(`/usuarios/buscar?nombre=${encodeURIComponent(termino)}`)
    : obtenerClientes();
};

// ====================================
// PERFIL ADMINISTRATIVO
// ====================================

export const obtenerPerfilAdmin = () =>
  api("/usuarios/perfil");

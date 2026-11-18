
import { api } from "./client";

// ====================================
// PRODUCTOS
// ====================================

// Obtener todos los productos
export const obtenerProductosAdmin = () =>
  api("/productos");

// Crear producto
export const crearProducto = (datos) =>
  api("/productos", {
    method: "POST",
    body: datos,
  });

// Actualizar producto
export const actualizarProducto = (id, datos) =>
  api(`/productos/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: datos,
  });

// Eliminar producto
export const eliminarProducto = (id) =>
  api(`/productos/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

// ====================================
// CLIENTES
// ====================================

// Obtener todos los usuarios
export const obtenerClientes = () =>
  api("/usuarios");

// Buscar usuarios
export const buscarClientes = (nombre) =>
  api(`/usuarios/buscar?nombre=${encodeURIComponent(nombre)}`);

// ====================================
// PERFIL
// ====================================

// Obtener perfil del administrador
export const obtenerPerfilAdmin = () =>
  api("/usuarios/perfil");

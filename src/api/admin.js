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

// ============ DASHBOARD ============
// Estas rutas responden { success, mensaje, data }.
const dashboard = (ruta, opciones) => api(`/api/dashboard/${ruta}`, opciones);

export const obtenerResumenDashboard = (opciones) => dashboard("resumen", opciones);

export const obtenerVentasPorMes = (opciones) =>
  dashboard("ventas-por-mes", opciones);

export const obtenerUsuariosPorRol = (opciones) =>
  dashboard("usuarios-por-rol", opciones);

export const obtenerPedidosPorEstado = (opciones) =>
  dashboard("pedidos-por-estado", opciones);

export const obtenerProductosBajoStock = (opciones) =>
  dashboard("productos-bajo-stock", opciones);

export const obtenerPedidosRecientes = (opciones) =>
  dashboard("pedidos-recientes", opciones);

export const obtenerMasVendidos = (opciones) =>
  dashboard("productos-mas-vendidos", opciones);
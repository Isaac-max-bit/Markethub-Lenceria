import { api } from "./client";

// ============ PRODUCTOS ============
export const obtenerProductosAdmin = (opciones) => api("/productos", opciones);

export const crearProducto = (datos) =>
  api("/productos", { method: "POST", body: datos });

export const actualizarProducto = (id, datos) =>
  api(`/productos/${encodeURIComponent(id)}`, { method: "PATCH", body: datos });

export const eliminarProducto = (id) =>
  api(`/productos/${encodeURIComponent(id)}`, { method: "DELETE" });

// Sube una o varias imágenes. El backend acepta los campos "imagen"
// e "imagenes"; el cliente envía FormData para no forzar JSON.
export const subirImagenesProducto = (id, archivos) => {
  const datos = new FormData();

  for (const archivo of archivos) {
    datos.append("imagenes", archivo);
  }

  return api(`/productos/${encodeURIComponent(id)}/imagenes`, {
    method: "POST",
    body: datos,
  });
};

// ============ CATEGORÍAS ============
export const obtenerCategorias = (opciones) => api("/categorias", opciones);

export const crearCategoria = (datos) =>
  api("/categorias", { method: "POST", body: datos });

export const actualizarCategoria = (id, datos) =>
  api(`/categorias/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: datos,
  });

export const eliminarCategoria = (id) =>
  api(`/categorias/${encodeURIComponent(id)}`, { method: "DELETE" });

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

// Serie diaria de los últimos N días (incluye hoy).
export const obtenerVentasPorDia = (dias = 30, opciones) =>
  dashboard(`ventas-por-dia?dias=${dias}`, opciones);

// Igual que ventas-por-dia pero sin ingresos (disponible para vendedores).
export const obtenerPedidosPorDia = (dias = 7, opciones) =>
  dashboard(`pedidos-por-dia?dias=${dias}`, opciones);

// Ventas de todo el historial o de un rango "YYYY-MM-DD".
export const obtenerVentasTotales = ({ desde, hasta } = {}, opciones) => {
  const consulta = new URLSearchParams();

  if (desde) consulta.set("desde", desde);
  if (hasta) consulta.set("hasta", hasta);

  const cadena = consulta.toString();
  return dashboard(`ventas-totales${cadena ? `?${cadena}` : ""}`, opciones);
};

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
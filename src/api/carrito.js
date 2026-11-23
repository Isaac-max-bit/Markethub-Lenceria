import { api } from "./client";

// ============================================================
// CARRITO Y PEDIDOS
// El backend guarda el carrito en Supabase (tabla Carrito) y
// exige el token JWT del usuario. El cliente HTTP ya lo envía
// en la cabecera Authorization.
// Todas las respuestas tienen la forma:
//   { items: [], total: 0, cantidad: 0 }
// ============================================================

/** GET /carrito — carrito del usuario autenticado. */
export const obtenerCarrito = ({ signal } = {}) =>
  api("/carrito", { signal });

/** POST /carrito — agrega una variante (talla/color). */
export const agregarAlCarrito = ({ variante_id, cantidad = 1 }) =>
  api("/carrito", {
    method: "POST",
    body: { variante_id, cantidad },
  });

/** PATCH /carrito/:id — cambia la cantidad (0 elimina el producto). */
export const actualizarCantidad = (id, cantidad) =>
  api(`/carrito/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { cantidad },
  });

/** DELETE /carrito/:id — quita un producto. */
export const eliminarDelCarrito = (id) =>
  api(`/carrito/${encodeURIComponent(id)}`, { method: "DELETE" });

/** DELETE /carrito — vacía el carrito. */
export const vaciarCarrito = () => api("/carrito", { method: "DELETE" });

/** POST /carrito/confirmar — convierte el carrito en pedido. */
export const confirmarPedido = () =>
  api("/carrito/confirmar", { method: "POST", body: {} });

/** GET /carrito/pedidos — historial de pedidos del usuario. */
export const obtenerPedidos = ({ signal } = {}) =>
  api("/carrito/pedidos", { signal });

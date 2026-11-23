import { api } from "./client";

// ============================================================
// PEDIDOS SIN CUENTA
// El backend valida precios y stock; el navegador solo envía los
// datos de contacto, envío y las variantes elegidas.
// ============================================================

/** POST /pedidos/invitado — registra la compra de un invitado. */
export const crearPedidoInvitado = (datos) =>
  api("/pedidos/invitado", { method: "POST", body: datos });

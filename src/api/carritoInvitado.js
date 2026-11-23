// ============================================================
// CARRITO DE INVITADO
// Se guarda en localStorage con la misma forma que devuelve el
// backend ({ items, total, cantidad }) para que los componentes
// no tengan que distinguir entre carrito local y carrito remoto.
// ============================================================

const CLAVE = "markethub.carrito.invitado";
const MAX_CANTIDAD = 99;

const CARRITO_VACIO = () => ({ items: [], total: 0, cantidad: 0 });

const numero = (valor) => {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
};

export const resumirInvitado = (items) => {
  const total = items.reduce((suma, item) => suma + item.subtotal, 0);
  const cantidad = items.reduce((suma, item) => suma + item.cantidad, 0);

  return { items, total, cantidad };
};

/** Convierte una variante del producto en una línea del carrito local. */
export const crearItemInvitado = (datos) => {
  const precio = numero(datos.precio);
  const stock = Math.max(0, numero(datos.stock));
  const cantidad = Math.min(
    MAX_CANTIDAD,
    Math.max(1, Math.round(numero(datos.cantidad) || 1)),
  );
  const varianteId = Number(datos.variante_id);

  return {
    id_carrito: `inv-${varianteId}`,
    variante_id: varianteId,
    cantidad,
    talla: datos.talla ?? null,
    color: datos.color ?? null,
    stock,
    producto_id: datos.producto_id ?? null,
    nombre: datos.nombre ?? "Producto",
    precio,
    precio_anterior: datos.precio_anterior ?? null,
    imagen: datos.imagen ?? null,
    subtotal: precio * cantidad,
  };
};

const normalizarItem = (item) => {
  const precio = numero(item?.precio);
  const cantidad = Math.min(
    MAX_CANTIDAD,
    Math.max(1, Math.round(numero(item?.cantidad) || 1)),
  );

  return {
    ...item,
    id_carrito: String(item?.id_carrito || `inv-${item?.variante_id}`),
    variante_id: Number(item?.variante_id),
    cantidad,
    stock: Math.max(0, numero(item?.stock)),
    producto_id: item?.producto_id ?? null,
    nombre: item?.nombre ?? "Producto",
    precio,
    subtotal: precio * cantidad,
  };
};

const esItemValido = (item) =>
  Number.isInteger(Number(item?.variante_id)) &&
  Number(item?.variante_id) > 0;

/** Lee el carrito guardado en el navegador. Nunca lanza errores. */
export function leerCarritoInvitado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) || "null");
    const items = Array.isArray(guardado?.items)
      ? guardado.items.filter(esItemValido).map(normalizarItem)
      : [];

    return resumirInvitado(items);
  } catch {
    return CARRITO_VACIO();
  }
}

/** Guarda las líneas y devuelve el resumen recalculado. */
export function guardarCarritoInvitado(items) {
  const carrito = resumirInvitado(items);

  try {
    if (carrito.items.length === 0) {
      localStorage.removeItem(CLAVE);
    } else {
      localStorage.setItem(CLAVE, JSON.stringify(carrito));
    }
  } catch {
    // Sin espacio o almacenamiento bloqueado: el carrito sigue en memoria.
  }

  return carrito;
}

export function limpiarCarritoInvitado() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // Nada que hacer.
  }
}

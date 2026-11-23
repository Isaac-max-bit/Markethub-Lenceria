import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  actualizarCantidad as apiActualizarCantidad,
  agregarAlCarrito as apiAgregar,
  confirmarPedido as apiConfirmar,
  eliminarDelCarrito as apiEliminar,
  obtenerCarrito,
  vaciarCarrito as apiVaciar,
} from "../api/carrito";
import {
  crearItemInvitado,
  guardarCarritoInvitado,
  leerCarritoInvitado,
  limpiarCarritoInvitado,
} from "../api/carritoInvitado";
import { crearPedidoInvitado } from "../api/pedido";
import { cerrarSesion } from "../api/sesion";
import { useSesion } from "../hooks/useSesion";
import { CarritoContext } from "./CarritoContext";

// ============================================================
// ESTADO GLOBAL DEL CARRITO
// - Con sesión: vive en el backend (tabla Carrito) y cada acción
//   devuelve el carrito actualizado por el servidor.
// - Sin sesión: vive en localStorage con la misma forma, así los
//   componentes no distinguen entre ambos modos.
// Al iniciar sesión, lo que había como invitado se pasa al carrito
// de la cuenta (si todavía hay stock).
// ============================================================

const CARRITO_VACIO = { items: [], total: 0, cantidad: 0 };

const normalizar = (datos) => ({
  items: Array.isArray(datos?.items) ? datos.items : [],
  total: Number(datos?.total) || 0,
  cantidad: Number(datos?.cantidad) || 0,
});

// Pasa las líneas del carrito invitado al carrito del servidor.
// Si una prenda ya no tiene stock se omite en lugar de romper el login.
const fusionarCarrito = async (invitado) => {
  let ultimo = null;

  for (const item of invitado.items) {
    try {
      ultimo = await apiAgregar({
        variante_id: item.variante_id,
        cantidad: item.cantidad,
      });
    } catch {
      // Producto agotado o eliminado: se descarta solo esa línea.
    }
  }

  return ultimo || obtenerCarrito();
};

// Una sola carga a la vez por usuario. React en modo estricto ejecuta
// los efectos dos veces: compartir la promesa evita fusionar el
// carrito invitado dos veces (y duplicar cantidades).
let cargaActual = null;

const cargarCarrito = (usuarioId) => {
  if (cargaActual?.usuarioId === usuarioId) return cargaActual.promesa;

  const promesa = (async () => {
    const invitado = leerCarritoInvitado();
    let datos = await obtenerCarrito();

    if (invitado.items.length > 0) {
      datos = await fusionarCarrito(invitado);
      limpiarCarritoInvitado();
    }

    return datos;
  })();

  cargaActual = { usuarioId, promesa };

  promesa
    .finally(() => {
      if (cargaActual?.promesa === promesa) cargaActual = null;
    })
    .catch(() => {
      // El error real lo recibe quien espera la promesa.
    });

  return promesa;
};

export function CarritoProvider({ children }) {
  const usuario = useSesion();
  const usuarioId = usuario?.id_usuario ?? null;

  const [carrito, setCarrito] = useState(() =>
    usuarioId ? CARRITO_VACIO : leerCarritoInvitado(),
  );
  const [cargando, setCargando] = useState(Boolean(usuarioId));
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState(null);
  const [sesionActual, setSesionActual] = useState(usuarioId);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const peticionRef = useRef(0);

  // Al iniciar o cerrar sesión se cambia de fuente de datos antes de
  // consultar. Ajustar el estado en el render evita un efecto extra.
  if (sesionActual !== usuarioId) {
    setSesionActual(usuarioId);
    setCarrito(usuarioId ? CARRITO_VACIO : leerCarritoInvitado());
    setError(null);
    setCargando(Boolean(usuarioId));
  }

  const aplicar = useCallback((datos) => {
    setCarrito(normalizar(datos));
  }, []);

  // Carga inicial, cambio de usuario y fusión del carrito invitado.
  useEffect(() => {
    if (!usuarioId) {
      // El carrito invitado ya se cargó al ajustar la sesión en el
      // render (y al cerrar sesión). Solo se invalida la petición
      // anterior para que no pise el estado.
      peticionRef.current += 1;
      return undefined;
    }

    let vigente = true;
    const peticion = ++peticionRef.current;

    cargarCarrito(usuarioId)
      .then((datos) => {
        if (!vigente || peticion !== peticionRef.current) return;

        aplicar(datos);
        setCargando(false);
      })
      .catch((fallo) => {
        if (!vigente || peticion !== peticionRef.current) return;

        setError(fallo);
        setCargando(false);
        if (fallo.estado === 401) cerrarSesion();
      });

    return () => {
      vigente = false;
    };
  }, [usuarioId, aplicar]);

  const recargar = useCallback(async () => {
    if (!usuarioId) {
      peticionRef.current += 1;
      setCarrito(leerCarritoInvitado());
      setError(null);
      setCargando(false);
      return;
    }

    const peticion = ++peticionRef.current;
    setCargando(true);
    setError(null);

    try {
      const datos = await cargarCarrito(usuarioId);
      if (peticion === peticionRef.current) aplicar(datos);
    } catch (fallo) {
      if (peticion !== peticionRef.current) return;

      setError(fallo);
      if (fallo.estado === 401) cerrarSesion();
    } finally {
      if (peticion === peticionRef.current) setCargando(false);
    }
  }, [usuarioId, aplicar]);

  const ejecutar = useCallback(
    async (accion) => {
      setProcesando(true);
      setError(null);

      try {
        const datos = await accion();
        aplicar(datos);
        return datos;
      } catch (fallo) {
        setError(fallo);
        if (fallo.estado === 401) cerrarSesion();
        throw fallo;
      } finally {
        setProcesando(false);
      }
    },
    [aplicar],
  );

  // ----------------------------------------------------------
  // ACCIONES
  // ----------------------------------------------------------
  const actualizarInvitado = useCallback((items) => {
    const datos = guardarCarritoInvitado(items);
    setCarrito(datos);
    return datos;
  }, []);

  const agregar = useCallback(
    async (datos) => {
      if (usuarioId) return ejecutar(() => apiAgregar(datos));

      setProcesando(true);
      setError(null);

      try {
        const actual = leerCarritoInvitado();
        const varianteId = Number(datos.variante_id);
        const cantidad = Math.max(1, Math.round(Number(datos.cantidad) || 1));
        const existente = actual.items.find(
          (item) => item.variante_id === varianteId,
        );
        const nueva = (existente?.cantidad || 0) + cantidad;
        const stock = Math.max(0, Number(datos.stock) || 0);

        if (nueva > 99) {
          throw new Error("Máximo 99 unidades por producto");
        }

        if (stock > 0 && nueva > stock) {
          throw new Error(
            `Solo hay ${stock} unidad(es) disponibles de esta talla`,
          );
        }

        const items = existente
          ? actual.items.map((item) =>
              item.variante_id === varianteId
                ? { ...item, cantidad: nueva, subtotal: item.precio * nueva }
                : item,
            )
          : [...actual.items, crearItemInvitado({ ...datos, cantidad })];

        return actualizarInvitado(items);
      } catch (fallo) {
        setError(fallo);
        throw fallo;
      } finally {
        setProcesando(false);
      }
    },
    [usuarioId, ejecutar, actualizarInvitado],
  );

  const actualizar = useCallback(
    async (id, cantidad) => {
      if (usuarioId) return ejecutar(() => apiActualizarCantidad(id, cantidad));

      const nueva = Math.min(
        99,
        Math.max(0, Math.round(Number(cantidad) || 0)),
      );
      const items = leerCarritoInvitado()
        .items.map((item) =>
          item.id_carrito === String(id)
            ? { ...item, cantidad: nueva, subtotal: item.precio * nueva }
            : item,
        )
        .filter((item) => item.cantidad > 0);

      return actualizarInvitado(items);
    },
    [usuarioId, ejecutar, actualizarInvitado],
  );

  const eliminar = useCallback(
    async (id) => {
      if (usuarioId) return ejecutar(() => apiEliminar(id));

      const items = leerCarritoInvitado().items.filter(
        (item) => item.id_carrito !== String(id),
      );

      return actualizarInvitado(items);
    },
    [usuarioId, ejecutar, actualizarInvitado],
  );

  const vaciar = useCallback(async () => {
    if (usuarioId) return ejecutar(() => apiVaciar());

    limpiarCarritoInvitado();
    setCarrito(CARRITO_VACIO);
    return CARRITO_VACIO;
  }, [usuarioId, ejecutar]);

  // Solo para usuarios con sesión: convierte el carrito del servidor.
  const confirmar = useCallback(async () => {
    setProcesando(true);
    setError(null);

    try {
      const datos = await apiConfirmar();
      setCarrito(CARRITO_VACIO);
      return datos;
    } catch (fallo) {
      setError(fallo);
      if (fallo.estado === 401) cerrarSesion();
      throw fallo;
    } finally {
      setProcesando(false);
    }
  }, []);

  // Compra sin cuenta: envía las líneas guardadas y los datos del
  // formulario. El backend responde con el pedido y el total real.
  const pagarComoInvitado = useCallback(async (datos) => {
    setProcesando(true);
    setError(null);

    try {
      const invitado = leerCarritoInvitado();

      if (invitado.items.length === 0) {
        throw new Error("Tu carrito está vacío");
      }

      const resultado = await crearPedidoInvitado({
        ...datos,
        items: invitado.items.map(({ variante_id, cantidad }) => ({
          variante_id,
          cantidad,
        })),
      });

      limpiarCarritoInvitado();
      setCarrito(CARRITO_VACIO);
      return resultado;
    } catch (fallo) {
      setError(fallo);
      throw fallo;
    } finally {
      setProcesando(false);
    }
  }, []);

  const limpiarError = useCallback(() => setError(null), []);

  const abrirCarrito = useCallback(() => setCarritoAbierto(true), []);
  const cerrarCarrito = useCallback(() => setCarritoAbierto(false), []);

  const valor = useMemo(
    () => ({
      ...carrito,
      esInvitado: !usuarioId,
      cargando,
      procesando,
      error,
      carritoAbierto,
      recargar,
      agregar,
      actualizar,
      eliminar,
      vaciar,
      confirmar,
      pagarComoInvitado,
      abrirCarrito,
      cerrarCarrito,
      limpiarError,
    }),
    [
      carrito,
      usuarioId,
      cargando,
      procesando,
      error,
      carritoAbierto,
      recargar,
      agregar,
      actualizar,
      eliminar,
      vaciar,
      confirmar,
      pagarComoInvitado,
      abrirCarrito,
      cerrarCarrito,
      limpiarError,
    ],
  );

  return (
    <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
  );
}

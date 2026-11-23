import { createContext, useContext } from "react";

// Contexto compartido por el proveedor y los componentes que leen el carrito.
export const CarritoContext = createContext(null);

export function useCarrito() {
  const contexto = useContext(CarritoContext);

  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }

  return contexto;
}

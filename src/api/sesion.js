// Sesión del lado del cliente:
//   - usuario: datos públicos devueltos por el backend
//   - token:   JWT que se envía en Authorization a las rutas privadas
// Se guardan juntos en localStorage (recordarme) o sessionStorage.
const CLAVE_USUARIO = "markethub.usuario";
const CLAVE_TOKEN = "markethub.token";
export const EVENTO_SESION = "markethub:sesion";

const emitirCambio = () => {
  window.dispatchEvent(new Event(EVENTO_SESION));
};

/** ¿Quiere que lo recuerde entre visitas? localStorage : sessionStorage. */
export function guardarSesion(usuario, token, recordar = true) {
  const destino = recordar ? localStorage : sessionStorage;

  for (const almacen of [localStorage, sessionStorage]) {
    almacen.removeItem(CLAVE_USUARIO);
    almacen.removeItem(CLAVE_TOKEN);
  }

  destino.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  if (token) destino.setItem(CLAVE_TOKEN, token);

  emitirCambio();
}

export function obtenerSesion() {
  for (const almacen of [localStorage, sessionStorage]) {
    try {
      const guardado = almacen.getItem(CLAVE_USUARIO);
      if (guardado) return JSON.parse(guardado);
    } catch {
      // JSON dañado: se ignora y se sigue con el otro almacén.
    }
  }

  return null;
}

export function obtenerToken() {
  for (const almacen of [localStorage, sessionStorage]) {
    const token = almacen.getItem(CLAVE_TOKEN);
    if (token) return token;
  }

  return null;
}

export function cerrarSesion() {
  for (const almacen of [localStorage, sessionStorage]) {
    almacen.removeItem(CLAVE_USUARIO);
    almacen.removeItem(CLAVE_TOKEN);
  }

  emitirCambio();
}

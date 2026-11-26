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
      if (!guardado) continue;

      const datos = JSON.parse(guardado);

      // Compatibilidad con sesiones antiguas que guardaban la respuesta
      // completa del login: { usuario, token }. Se migran al formato actual.
      if (datos && typeof datos === "object" && datos.usuario) {
        if (datos.token) almacen.setItem(CLAVE_TOKEN, datos.token);
        almacen.setItem(CLAVE_USUARIO, JSON.stringify(datos.usuario));
        return datos.usuario;
      }

      return datos;
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

/** Actualiza los datos del usuario guardado (p. ej. tras editar el perfil) sin tocar el token. */
export function actualizarUsuarioSesion(usuario) {
  for (const almacen of [localStorage, sessionStorage]) {
    if (almacen.getItem(CLAVE_USUARIO)) {
      almacen.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
      emitirCambio();
      return;
    }
  }
}

export function cerrarSesion() {
  for (const almacen of [localStorage, sessionStorage]) {
    almacen.removeItem(CLAVE_USUARIO);
    almacen.removeItem(CLAVE_TOKEN);
  }

  emitirCambio();
}

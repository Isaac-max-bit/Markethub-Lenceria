import { api } from "./client";

/** POST /usuarios — crea una cuenta de cliente. */
export const registrarUsuario = ({ nombre, email, password }) =>
  api("/usuarios", {
    method: "POST",
    body: { nombre, email, password },
  });

/** POST /usuarios/login — valida email y contraseña. */
export const iniciarSesion = ({ email, password }) =>
  api("/usuarios/login", {
    method: "POST",
    body: { email, password },
  });

/** GET /usuarios/:id — datos públicos de un usuario. */
export const obtenerUsuario = (id, { signal } = {}) =>
  api(`/usuarios/${encodeURIComponent(id)}`, { signal });

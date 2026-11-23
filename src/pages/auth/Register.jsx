
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registrarUsuario } from "../../api/usuarios";
import { guardarSesion } from "../../api/sesion";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.desde || "/home";
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const datos = new FormData(e.currentTarget);

    try {
      const resultado = await registrarUsuario({
        nombre: String(datos.get("nombre") || ""),
        email: String(datos.get("email") || ""),
        password: String(datos.get("password") || ""),
      });

      const usuario = resultado?.usuario;
      const token = resultado?.token;

      if (!usuario || !token) {
        throw new Error(
          "El registro fue recibido, pero el servidor no devolvió una sesión válida. Inicia sesión para continuar.",
        );
      }

      guardarSesion(usuario, token, true);
      navigate(destino, { replace: true });
    } catch (fallo) {
      setError(fallo.message || "No se pudo crear la cuenta.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="enter-right">
      <form className="card" onSubmit={handleSubmit}>
        <div className="card-header">
          <h2 className="card-title">Crear cuenta</h2>
          <p className="card-description">
            Crea tu cuenta y descubre nuestra colección.
          </p>
        </div>

        <div className="card-content">
          <div className="input-group">
            <label htmlFor="reg-nombre">Nombre completo</label>
            <div className="input-box">
              <i className="fa-regular fa-user"></i>
              <input
                id="reg-nombre"
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="reg-email">Correo electrónico</label>
            <div className="input-box">
              <i className="fa-regular fa-envelope"></i>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="reg-password">Crear contraseña</label>
            <div className="input-box">
              <i className="fa-solid fa-lock"></i>
              <input
                id="reg-password"
                type={verPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setVerPassword((valor) => !valor)}
                aria-label={
                  verPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                aria-pressed={verPassword}
              >
                {verPassword ? (
                  <EyeOff size={18} strokeWidth={1.6} aria-hidden="true" />
                ) : (
                  <Eye size={18} strokeWidth={1.6} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="form-message form-message-error" role="alert">
              {error}
            </p>
          )}

          <p className="form-hint">
            La contraseña debe tener al menos 8 caracteres.
          </p>
        </div>

        <div className="card-footer">
          <button type="submit" className="button" disabled={enviando}>
            {enviando ? "Creando cuenta…" : "Crear cuenta"}
          </button>
          <Link
            to="/login"
            state={location.state}
            className="button button-outline"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </form>
    </div>
  );
}

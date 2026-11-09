import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../../api/usuarios";
import { guardarSesion } from "../../api/sesion";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    const datos = new FormData(e.currentTarget);

    try {
      const usuario = await iniciarSesion({
        email: String(datos.get("email") || ""),
        password: String(datos.get("password") || ""),
      });

      guardarSesion(usuario, datos.get("recordar") === "on");
      navigate("/home");
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="enter-left">
      <form className="card" onSubmit={handleSubmit}>
        <div className="card-header">
          <h2 className="card-title">Iniciar sesión</h2>
          <p className="card-description">Accede a tu cuenta para continuar.</p>
        </div>

        <div className="card-content">
          <div className="input-group">
            <label htmlFor="login-email">Correo electrónico</label>
            <div className="input-box">
              <i className="fa-regular fa-envelope"></i>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="password-title">
              <label htmlFor="login-password">Contraseña</label>
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="input-box">
              <i className="fa-solid fa-lock"></i>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <label className="remember">
            <input type="checkbox" name="recordar" />
            <span>Recordarme</span>
          </label>

          {error && (
            <p className="form-message form-message-error" role="alert">
              {error}
            </p>
          )}

          <p className="form-hint">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="form-link">
              Regístrate aquí
            </Link>
            .
          </p>
        </div>

        <div className="card-footer">
          <button type="submit" className="button" disabled={enviando}>
            {enviando ? "Ingresando…" : "Iniciar sesión"}
          </button>
          <Link to="/registro" className="button button-outline">
            Crear cuenta nueva
          </Link>
        </div>
      </form>
    </div>
  );
}

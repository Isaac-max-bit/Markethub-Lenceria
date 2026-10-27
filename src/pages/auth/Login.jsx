import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
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
            <input type="checkbox" />
            <span>Recordarme</span>
          </label>
        </div>

        <div className="card-footer">
          <button type="submit" className="button">
            Iniciar sesión
          </button>
          <Link to="/registro" className="button button-outline">
            Crear cuenta nueva
          </Link>
        </div>
      </form>
    </div>
  );
}

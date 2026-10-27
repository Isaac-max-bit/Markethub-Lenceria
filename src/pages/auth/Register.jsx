import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
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
                type="password"
                name="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button type="submit" className="button">
            Crear cuenta
          </button>
          <Link to="/login" className="button button-outline">
            Ya tengo cuenta
          </Link>
        </div>
      </form>
    </div>
  );
}

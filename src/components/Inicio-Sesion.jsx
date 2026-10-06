import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar el hook de navegación
import './Inicio-Sesion.css';

export default function InicioSesion() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate(); // 2. Inicializar la función de navegación

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    navigate('/home'); // 3. Redirigir a la ruta principal
  };

  return (
    <main className="lenceria-container">
      <div className="login-card">
        
        {/* ===== PANEL IZQUIERDO ===== */}
        <section className="brand-panel">
          <div className="brand-top">
            <span>Luxury collection</span>
            <span>2026</span>
          </div>

          <div className="brand-content">
            <div className="title-wrap">
              <i className="fa-solid fa-asterisk star"></i>
              <h1>Lencería</h1>
              <svg className="orbit" viewBox="0 0 300 120" aria-hidden="true">
                <ellipse cx="150" cy="60" rx="145" ry="52" />
              </svg>
            </div>
            <p>Elegancia que comienza contigo.</p>
          </div>

          <div className="brand-bottom">
            <span>Comodidad</span>
            <span>Elegancia</span>
          </div>
        </section>

        {/* ===== PANEL DERECHO ===== */}
        <section className="form-panel">
          <div className="forms">
            
            {/* FORM LOGIN */}
            <div 
              className="form login-form" 
              style={{ 
                opacity: isRegister ? 0 : 1, 
                transform: isRegister ? 'translateX(-40px)' : 'translateX(0)', 
                pointerEvents: isRegister ? 'none' : 'auto', 
                position: isRegister ? 'absolute' : 'relative' 
              }}
            >
              {/* Se añade la función handleLoginSubmit en el onSubmit */}
              <form className="card" onSubmit={handleLoginSubmit} autoComplete="off">
                <div className="card-header">
                  <h2 className="card-title">Iniciar sesión</h2>
                  <p className="card-description">
                    Accede a tu cuenta para continuar.
                  </p>
                </div>

                <div className="card-content">
                  <div className="input-group">
                    <label htmlFor="login-email"> Correo electrónico </label>
                    <div className="input-box">
                      <i className="fa-regular fa-envelope"></i>
                      <input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="password-title">
                      <label htmlFor="login-password"> Contraseña </label>
                      <a href="#"> ¿Olvidaste tu contraseña? </a>
                    </div>
                    <div className="input-box">
                      <i className="fa-solid fa-lock"></i>
                      <input
                        id="login-password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>

                  <label className="remember">
                    <input type="checkbox" />
                    <span> Recordarme </span>
                  </label>
                </div>

                <div className="card-footer">
                  <button type="submit" className="button">Iniciar sesión</button>
                  <button type="button" onClick={() => setIsRegister(true)} className="button button-outline">
                    Crear cuenta nueva
                  </button>
                </div>
              </form>
            </div>

            {/* FORM REGISTRO */}
            <div 
              className="form register-form" 
              style={{ 
                opacity: isRegister ? 1 : 0, 
                transform: isRegister ? 'translateX(0)' : 'translateX(40px)', 
                pointerEvents: isRegister ? 'auto' : 'none', 
                position: isRegister ? 'relative' : 'absolute' 
              }}
            >
              <form className="card" onSubmit={(e) => { e.preventDefault(); navigate('/home'); }} autoComplete="off">
                <div className="card-header">
                  <h2 className="card-title">Crear cuenta</h2>
                  <p className="card-description">
                    Crea tu cuenta y descubre nuestra colección.
                  </p>
                </div>

                <div className="card-content">
                  <div className="input-group">
                    <label htmlFor="reg-nombre"> Nombre completo </label>
                    <div className="input-box">
                      <i className="fa-regular fa-user"></i>
                      <input
                        id="reg-nombre"
                        type="text"
                        name="nombre"
                        placeholder="Tu nombre"
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="reg-email"> Correo electrónico </label>
                    <div className="input-box">
                      <i className="fa-regular fa-envelope"></i>
                      <input
                        id="reg-email"
                        type="email"
                        name="email-registro"
                        placeholder="tu@email.com"
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="reg-password"> Crear contraseña </label>
                    <div className="input-box">
                      <i className="fa-solid fa-lock"></i>
                      <input
                        id="reg-password"
                        type="password"
                        name="password-registro"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button type="submit" className="button">Crear cuenta</button>
                  <button type="button" onClick={() => setIsRegister(false)} className="button button-outline">
                    Ya tengo cuenta
                  </button>
                </div>
              </form>
            </div>

          </div>

          <footer>© 2026 Lencería · Luxury Collection</footer>
        </section>

      </div>
    </main>
  );
}
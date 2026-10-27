import { Outlet } from "react-router-dom";
import "./AuthLayout.css";
import "./Auth.css";

export default function AuthLayout() {
  return (
    <main className="auth-container">
      <div className="login-card">
        <section className="brand-panel">
          <div className="brand-top">
            <span>Lencería Lujo Rosado</span>
            <span>{new Date().getFullYear()}</span>
          </div>

          <div className="brand-content">
            <div className="title-wrap">
              <i className="fa-solid fa-asterisk star"></i>
              <h1>Lencería Lujo Rosado</h1>
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

        <section className="form-panel">
          <div className="forms">
            <Outlet />
          </div>
          <footer>
            © {new Date().getFullYear()} Lencería · Luxury Collection
          </footer>
        </section>
      </div>
    </main>
  );
}

import { Outlet } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo";
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
              <BrandLogo
                tono="dark"
                className="h-10 opacity-80 sm:h-12"
              />
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

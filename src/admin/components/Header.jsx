import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import { useSesion } from "../../hooks/useSesion";
import { cerrarSesion } from "../../api/sesion";

export default function Header() {
  const usuario = useSesion();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-white px-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-mauve">
          MarketHub / Administración
        </p>
        <h2 className="font-heading text-xl text-plum">Panel de control</h2>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <UserCircle size={30} className="text-dusty-rose" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-plum">
              {usuario?.nombre || "Administrador"}
            </p>
            <p className="text-xs text-mauve">{usuario?.email || "MarketHub"}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={salir}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="border-l border-border pl-5 text-wine transition hover:text-dusty-rose"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
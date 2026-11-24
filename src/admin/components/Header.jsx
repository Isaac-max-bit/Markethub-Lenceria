import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useSesion } from "../../hooks/useSesion";
import { cerrarSesion } from "../../api/sesion";

const ROLES = {
  admin: "Administrador",
  vendedor: "Vendedor",
};

const iconButton =
  "flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-dusty-rose";

export default function Header({ onMenu, oscuro, onTema }) {
  const usuario = useSesion();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);

  const nombre = usuario?.nombre || "Usuario";
  const rol = ROLES[String(usuario?.rol || "").toLowerCase()] || "Usuario";

  useEffect(() => {
    if (!abierto) return undefined;

    const cerrarFuera = (evento) => {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false);
    };
    const cerrarEscape = (evento) => {
      if (evento.key === "Escape") setAbierto(false);
    };

    document.addEventListener("mousedown", cerrarFuera);
    document.addEventListener("keydown", cerrarEscape);
    return () => {
      document.removeEventListener("mousedown", cerrarFuera);
      document.removeEventListener("keydown", cerrarEscape);
    };
  }, [abierto]);

  const salir = () => {
    cerrarSesion();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-6 border-b border-border bg-card px-6 md:px-7">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Mostrar u ocultar el menú"
        className={iconButton}
      >
        <Menu size={22} strokeWidth={1.6} />
      </button>

      <div className="flex shrink-0 items-center gap-5">
        <button
          type="button"
          onClick={onTema}
          aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          title={oscuro ? "Modo claro" : "Modo oscuro"}
          className={iconButton}
        >
          {oscuro ? (
            <Sun size={22} strokeWidth={1.6} />
          ) : (
            <Moon size={22} strokeWidth={1.6} />
          )}
        </button>

        <span className={`${iconButton} relative`} aria-hidden="true">
          <Bell size={22} strokeWidth={1.6} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 bg-dusty-rose" />
        </span>

        <div ref={contenedor} className="relative">
          <button
            type="button"
            onClick={() => setAbierto((valor) => !valor)}
            aria-haspopup="menu"
            aria-expanded={abierto}
            className="flex items-center gap-3"
          >
            <span className="hidden text-right sm:block">
              <span className="block max-w-[180px] truncate text-sm font-medium text-ink">
                {nombre}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-muted">
                {rol}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-dusty-rose text-white"
            >
              <User size={22} strokeWidth={1.6} />
            </span>
          </button>

          {abierto && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-3 w-52 rounded-lg border border-border bg-card py-1.5 shadow-lg shadow-plum/10"
            >
              <div className="border-b border-border px-4 py-3 sm:hidden">
                <p className="truncate text-sm font-medium text-ink">
                  {nombre}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
                  {rol}
                </p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={salir}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink transition-colors hover:bg-page"
              >
                <LogOut size={18} strokeWidth={1.6} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

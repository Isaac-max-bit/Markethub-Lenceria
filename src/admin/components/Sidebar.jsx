import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  ShoppingBag,
  TicketPercent,
  Settings,
} from "lucide-react";
import BrandLogo from "../../components/BrandLogo";
import { useSesion } from "../../hooks/useSesion";

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "Productos",
    path: "/admin/productos",
    icon: Package,
  },
  {
    title: "Categorías",
    path: "/admin/categorias",
    icon: Tags,
    soloAdmin: true,
  },
  {
    title: "Clientes",
    path: "/admin/clientes",
    icon: Users,
    soloAdmin: true,
  },
  {
    title: "Pedidos",
    path: "/admin/pedidos",
    icon: ShoppingBag,
  },
  {
    title: "Descuentos",
    path: "/admin/descuentos",
    icon: TicketPercent,
    soloAdmin: true,
  },
  {
    title: "Configuración",
    path: "/admin/configuracion",
    icon: Settings,
    soloAdmin: true,
  },
];

const navBase =
  "flex h-[62px] items-center gap-4 rounded-md border-l-4 px-5 text-[15px] font-medium transition-colors duration-200";

const activo = "border-accent bg-act text-ink";
const inactivo = "border-transparent text-ink hover:bg-page";

export default function Sidebar({ abierto }) {
  const usuario = useSesion();
  const esAdmin = String(usuario?.rol || "").toLowerCase() === "admin";
  const items = menuItems.filter((item) => esAdmin || !item.soloAdmin);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-border bg-card px-2.5 transition-[margin] duration-300 md:sticky md:top-0 ${
        abierto ? "ml-0" : "-ml-72"
      }`}
    >
      <div className="flex h-20 shrink-0 items-center px-3.5">
        <Link
          to="/home"
          aria-label="Lujo Rosado, ir a la tienda"
          className="inline-flex w-fit items-center transition-opacity hover:opacity-80"
        >
          <BrandLogo tono="brand" className="h-7" />
        </Link>
      </div>

      <nav className="mt-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `${navBase} ${isActive ? activo : inactivo}`
                  }
                >
                  <Icon size={22} strokeWidth={1.6} />
                  <span>{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

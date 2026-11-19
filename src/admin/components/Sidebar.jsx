import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  ShoppingBag,
  TicketPercent,
  Settings,
  ArrowLeft,
  Store,
} from "lucide-react";

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
  },
  {
    title: "Clientes",
    path: "/admin/clientes",
    icon: Users,
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
  },
];

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-[#3e1a26] text-white">

      {/* LOGO */}
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <Store size={27} className="text-[#f3c4c0]" />

        <div>
          <h1 className="font-heading text-2xl font-semibold">
            MarketHub
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#f3c4c0]">
            Administration
          </p>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 space-y-2 px-4 py-8">

        <p className="mb-5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Menú principal
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 border-l-[3px] px-4 py-3 text-sm transition-all duration-200 ${
                  isActive
                    ? "border-[#f3c4c0] bg-white/10 text-[#f8d0cb]"
                    : "border-transparent text-white/65 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* CONFIGURACIÓN */}
      <div className="border-t border-white/10 p-4">

        <NavLink
          to="/admin/configuracion"
          className="flex items-center gap-3 px-4 py-3 text-sm text-white/65 transition hover:text-white"
        >
          <Settings size={19} />
          Configuración
        </NavLink>

        <NavLink
          to="/home"
          className="flex items-center gap-3 px-4 py-3 text-sm text-white/65 transition hover:text-white"
        >
          <ArrowLeft size={19} />
          Volver a la tienda
        </NavLink>

      </div>
    </aside>
  );
}
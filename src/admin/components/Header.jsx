
import { Bell, Sun, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-[#ebd3ce] bg-white px-8">

      <div>
        <p className="text-xs uppercase tracking-widest text-[#8a5a6b]">
          MarketHub / Administración
        </p>
        <h2 className="font-heading text-xl text-[#3e1a26]">
          Panel de control
        </h2>
      </div>

      <div className="flex items-center gap-6">

        <button
          type="button"
          aria-label="Cambiar tema"
          className="text-[#5b2333] transition hover:text-[#a94f63]"
        >
          <Sun size={21} />
        </button>

        <button
          type="button"
          aria-label="Notificaciones"
          className="text-[#5b2333] transition hover:text-[#a94f63]"
        >
          <Bell size={21} />
        </button>

        <div className="flex items-center gap-2 border-l border-[#ebd3ce] pl-5">
          <UserCircle size={30} className="text-[#a94f63]" />

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#3e1a26]">
              Administrador
            </p>
            <p className="text-xs text-[#8a5a6b]">
              MarketHub
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

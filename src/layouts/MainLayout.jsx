import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const ANNOUNCEMENT = "20% de descuento en todos los productos";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white font-body text-plum">
      <div className="flex h-10 items-center justify-center bg-dusty-rose px-4 text-center text-[11px] uppercase tracking-widest text-white md:text-xs">
        {ANNOUNCEMENT}
      </div>

      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

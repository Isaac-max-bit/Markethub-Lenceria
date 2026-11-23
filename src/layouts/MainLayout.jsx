import { Outlet } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ANNOUNCEMENT = "20% de descuento en todos los productos";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white font-body text-plum">
      <div className="flex h-8 items-center justify-center bg-petal px-4">
        <p className="font-body text-center text-[9px] font-semibold uppercase leading-none tracking-[0.22em] text-wine md:text-[10px] md:tracking-[0.3em]">
          {ANNOUNCEMENT}
        </p>
      </div>

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

      <CartDrawer />
    </div>
  );
}

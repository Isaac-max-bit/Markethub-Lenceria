import { Routes, Route, Navigate } from "react-router-dom";

// Componentes generales
import ScrollToTop from "../components/ScrollToTop";

// Autenticación
import AuthLayout from "../pages/auth/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Layout de la tienda
import MainLayout from "../layouts/MainLayout";

// Páginas de la tienda
import Home from "../pages/home";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Payment from "../pages/Payment";
import Search from "../pages/Search";
import SizeGuide from "../pages/SizeGuide";
import Shipping from "../pages/Shipping";
import Returns from "../pages/Returns";
import Faq from "../pages/Faq";

// Administración
import RutaAdmin from "../admin/components/RutaAdmin";
import AdminLayout from "../admin/layouts/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import Productos from "../admin/pages/Productos";
import Categorias from "../admin/pages/Categorias";
import Proximamente from "../admin/pages/Proximamente";

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* REDIRECCIÓN PRINCIPAL */}
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />

        {/* AUTENTICACIÓN */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Route>

        {/* TIENDA PÚBLICA */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/pago" element={<Payment />} />
          <Route path="/ofertas" element={<Products />} />
          <Route path="/buscar" element={<Search />} />
          <Route path="/guia-de-tallas" element={<SizeGuide />} />
          <Route path="/envios" element={<Shipping />} />
          <Route path="/devoluciones" element={<Returns />} />
          <Route path="/preguntas-frecuentes" element={<Faq />} />
        </Route>

        {/* PANEL ADMINISTRATIVO (solo rol admin) */}
        <Route element={<RutaAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="*" element={<Proximamente />} />
          </Route>
        </Route>

      </Routes>
    </>
  );
}
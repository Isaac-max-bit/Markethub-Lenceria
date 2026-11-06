import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import AuthLayout from "../pages/auth/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import SizeGuide from "../pages/SizeGuide";
import Shipping from "../pages/Shipping";
import Returns from "../pages/Returns";
import Faq from "../pages/Faq";

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/ofertas" element={<Products />} />
          <Route path="/guia-de-tallas" element={<SizeGuide />} />
          <Route path="/envios" element={<Shipping />} />
          <Route path="/devoluciones" element={<Returns />} />
          <Route path="/preguntas-frecuentes" element={<Faq />} />
        </Route>
      </Routes>
    </>
  );
}

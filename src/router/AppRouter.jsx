import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../pages/auth/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
}

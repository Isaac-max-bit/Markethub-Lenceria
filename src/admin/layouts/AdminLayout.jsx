import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const CLAVE_TEMA = "tema-admin";

const temaInicial = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado) return guardado === "oscuro";
  } catch {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function AdminLayout() {
  const [abierto, setAbierto] = useState(() => window.innerWidth >= 768);
  const [oscuro, setOscuro] = useState(temaInicial);

  const cambiarTema = () => {
    const siguiente = !oscuro;
    setOscuro(siguiente);
    try {
      localStorage.setItem(CLAVE_TEMA, siguiente ? "oscuro" : "claro");
    } catch {
      return;
    }
  };

  return (
    <div
      className={`flex min-h-screen bg-page text-ink ${oscuro ? "tema-oscuro" : ""}`}
    >
      <Sidebar abierto={abierto} />

      {abierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setAbierto(false)}
          className="fixed inset-0 z-30 bg-plum/30 md:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenu={() => setAbierto((valor) => !valor)}
          oscuro={oscuro}
          onTema={cambiarTema}
        />

        <main className="flex-1 px-6 py-7 md:px-[30px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { mainLinks, moreLinks } from "../data/navData";
import { cerrarSesion } from "../api/sesion";
import { useCarrito } from "../context/CarritoContext";
import { useSesion } from "../hooks/useSesion";
import BrandLogo from "./BrandLogo";

const ICON_STROKE = 1.1;

const iconButton =
  "relative flex h-10 w-10 items-center justify-center text-plum/85 transition-colors hover:text-wine";

const desktopLinkClass = (isActive, highlight) =>
  [
    "relative text-[11px] uppercase leading-none tracking-[0.16em] transition-colors after:absolute after:inset-x-0 after:-bottom-2 after:h-px after:origin-center after:bg-champagne after:transition-transform after:duration-300 hover:after:scale-x-100",
    highlight ? "text-dusty-rose" : "text-plum/85 hover:text-wine",
    isActive ? "after:scale-x-100" : "after:scale-x-0",
  ].join(" ");

const mobileLinkClass = (isActive, highlight) =>
  [
    "flex items-center border-b border-border/60 py-4 text-[11px] uppercase tracking-[0.18em] transition-colors",
    highlight ? "text-dusty-rose" : "text-plum/85",
    isActive ? "text-wine" : "",
  ].join(" ");

const isLinkActive = (to, pathname, search) => {
  const [path, query = ""] = to.split("?");
  if (pathname !== path) return false;

  return (
    new URLSearchParams(search).get("categoria") ===
    new URLSearchParams(query).get("categoria")
  );
};

const mobileLinks = [...mainLinks, ...moreLinks];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchInputRef = useRef(null);
  const moreRef = useRef(null);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const usuario = useSesion();
  const { cantidad: cartCount, abrirCarrito } = useCarrito();

  const salir = () => {
    cerrarSesion();
    navigate("/home");
  };

  const moreActive = moreLinks.some((link) =>
    isLinkActive(link.to, pathname, search),
  );

  // Al cambiar de ruta se cierran los menús y el buscador.
  const [rutaActual, setRutaActual] = useState(`${pathname}${search}`);
  const ruta = `${pathname}${search}`;

  if (rutaActual !== ruta) {
    setRutaActual(ruta);
    setMenuOpen(false);
    setSearchOpen(false);
    setMoreOpen(false);
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setMoreOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;

    const onPointerDown = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [moreOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (event) => {
    event.preventDefault();

    const term = query.trim();
    if (!term) return;

    navigate(`/buscar?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setQuery("");
  };

  // El logo siempre lleva al inicio de la página, aunque ya estemos en /home.
  const irAlInicio = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-[#FDF3F1]/90 backdrop-blur-md">
        <div className="mx-auto grid h-14 max-w-[1536px] grid-cols-[1fr_auto_1fr] items-center gap-x-8 px-4 xl:h-16 xl:px-8">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`${iconButton} xl:hidden`}
            >
              <Menu size={20} strokeWidth={ICON_STROKE} />
            </button>

            <nav aria-label="Principal" className="hidden xl:block">
              <ul className="flex h-full items-center gap-7">
                {mainLinks.map((link) => {
                  const active = isLinkActive(link.to, pathname, search);

                  return (
                    <li key={link.id} className="flex h-full items-center">
                      <Link
                        to={link.to}
                        aria-current={active ? "page" : undefined}
                        className={desktopLinkClass(active, link.highlight)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}

                <li ref={moreRef} className="relative flex h-full items-center">
                  <button
                    type="button"
                    onClick={() => setMoreOpen((open) => !open)}
                    aria-expanded={moreOpen}
                    aria-haspopup="true"
                    className={`${desktopLinkClass(moreActive, false)} flex items-center gap-1`}
                  >
                    Más
                    <ChevronDown
                      size={14}
                      strokeWidth={ICON_STROKE}
                      aria-hidden="true"
                      className={`transition-transform duration-200 ${
                        moreOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {moreOpen && (
                    <ul className="absolute left-0 top-full min-w-44 border border-border/70 bg-white py-2 shadow-[0_24px_48px_-28px_rgba(62,26,38,0.45)]">
                      {moreLinks.map((link) => {
                        const active = isLinkActive(link.to, pathname, search);

                        return (
                          <li key={link.id}>
                            <Link
                              to={link.to}
                              aria-current={active ? "page" : undefined}
                              className={`block px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-plum/85 transition-colors hover:bg-silk/30 hover:text-wine ${
                                active ? "text-wine" : ""
                              }`}
                            >
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              </ul>
            </nav>
          </div>

          <Link
            to="/home"
            onClick={irAlInicio}
            aria-label="Lujo Rosado, ir al inicio"
            className="inline-flex items-center transition-opacity hover:opacity-80"
          >
            <BrandLogo className="h-7 xl:h-8" />
          </Link>

          <div className="flex items-center justify-self-end">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Buscar"
              aria-expanded={searchOpen}
              className={iconButton}
            >
              <Search size={18} strokeWidth={ICON_STROKE} />
            </button>

            {usuario ? (
              <button
                type="button"
                onClick={salir}
                aria-label={`Cerrar sesión de ${usuario.nombre}`}
                title={`Hola, ${usuario.nombre}. Cerrar sesión`}
                className={`${iconButton} hidden xl:flex`}
              >
                <LogOut size={18} strokeWidth={ICON_STROKE} />
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Mi cuenta"
                className={`${iconButton} hidden xl:flex`}
              >
                <User size={18} strokeWidth={ICON_STROKE} />
              </Link>
            )}

            <button
              type="button"
              onClick={abrirCarrito}
              aria-label={`Abrir carrito de compras${
                cartCount > 0 ? ` (${cartCount})` : ""
              }`}
              className={iconButton}
            >
              <ShoppingBag size={18} strokeWidth={ICON_STROKE} />

              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[9px] font-medium leading-none text-white ring-2 ring-[#FDF3F1]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="absolute inset-x-0 top-full border-b border-border/70 bg-[#FDF3F1]/97 px-4 py-5 shadow-[0_24px_48px_-30px_rgba(62,26,38,0.4)] backdrop-blur-md xl:px-8">
            <form
              role="search"
              onSubmit={handleSearch}
              className="mx-auto flex max-w-2xl items-center gap-3 border-b border-plum/25 pb-2.5"
            >
              <Search
                size={18}
                strokeWidth={ICON_STROKE}
                className="text-mauve"
                aria-hidden="true"
              />

              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar productos"
                aria-label="Buscar productos"
                className="w-full bg-transparent text-[13px] tracking-wide text-plum outline-none placeholder:text-mauve/70"
              />

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Cerrar búsqueda"
                className="text-mauve transition-colors hover:text-plum"
              >
                <X size={20} strokeWidth={ICON_STROKE} />
              </button>
            </form>
          </div>
        )}
      </header>

      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-plum/30 transition-opacity duration-300 xl:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="mobile-menu"
        aria-label="Menú"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/70 bg-[#FDF3F1] shadow-[24px_0_48px_-32px_rgba(62,26,38,0.5)] transition-[transform,visibility] duration-300 xl:hidden ${
          menuOpen ? "translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border/70 px-5">
          <Link
            to="/home"
            onClick={irAlInicio}
            aria-label="Lujo Rosado, ir al inicio"
            className="inline-flex items-center transition-opacity hover:opacity-80"
          >
            <BrandLogo className="h-6" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="flex h-9 w-9 items-center justify-center text-plum transition-colors hover:text-dusty-rose"
          >
            <X size={20} strokeWidth={ICON_STROKE} />
          </button>
        </div>

        <nav aria-label="Menú móvil" className="flex-1 overflow-y-auto px-5">
          <ul>
            {mobileLinks.map((link) => {
              const active = isLinkActive(link.to, pathname, search);

              return (
                <li key={link.id}>
                  <Link
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={mobileLinkClass(active, link.highlight)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            <li>
              {usuario ? (
                <div className="flex items-center justify-between gap-4 border-b border-border py-3">
                  <span className="truncate text-sm tracking-wide text-plum">
                    Hola, {usuario.nombre}
                  </span>
                  <button
                    type="button"
                    onClick={salir}
                    className="shrink-0 text-xs uppercase tracking-wide text-dusty-rose hover:text-wine"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center border-b border-border/60 py-4 text-[11px] uppercase tracking-[0.18em] text-plum/85"
                >
                  Mi cuenta
                </Link>
              )}
            </li>
          </ul>
        </nav>

        <div className="border-t border-border/60 px-5 py-5">
          <p className="font-heading text-[15px] italic leading-snug text-mauve">
            Porque la lencería también es amor propio.
          </p>
        </div>
      </aside>
    </>
  );
}

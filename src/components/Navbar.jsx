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
import { useSesion } from "../hooks/useSesion";

const ICON_STROKE = 1.25;

const iconButton =
  "relative flex h-9 w-9 items-center justify-center text-plum transition-colors hover:text-dusty-rose";

const desktopLinkClass = (isActive, highlight) =>
  [
    "relative text-[13px] leading-none tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-champagne after:transition-transform hover:after:scale-x-100",
    highlight ? "text-dusty-rose" : "text-plum hover:text-wine",
    isActive ? "after:scale-x-100" : "after:scale-x-0",
  ].join(" ");

const mobileLinkClass = (isActive, highlight) =>
  [
    "block border-b border-border py-3 text-sm tracking-wide transition-colors",
    highlight ? "text-dusty-rose" : "text-plum",
    isActive ? "font-medium" : "",
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

function Wordmark() {
  return (
    <span
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      className="block whitespace-nowrap pl-[0.3em] text-[22px] font-medium leading-none tracking-[0.3em] text-wine xl:text-[24px]"
    >
      LENCERÍA LR
    </span>
  );
}

export default function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchInputRef = useRef(null);
  const moreRef = useRef(null);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const usuario = useSesion();

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

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-[#FDF3F1]">
        <div className="mx-auto grid h-12 max-w-[1536px] grid-cols-[1fr_auto_1fr] items-center gap-x-8 px-4 xl:px-6">
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
              <ul className="flex h-12 items-center gap-6">
                {mainLinks.map((link) => {
                  const active = isLinkActive(link.to, pathname, search);

                  return (
                    <li key={link.id} className="flex h-12 items-center">
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

                <li ref={moreRef} className="relative flex h-12 items-center">
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
                    <ul className="absolute left-0 top-full min-w-40 border border-border bg-[#FDF3F1] py-2">
                      {moreLinks.map((link) => {
                        const active = isLinkActive(link.to, pathname, search);

                        return (
                          <li key={link.id}>
                            <Link
                              to={link.to}
                              aria-current={active ? "page" : undefined}
                              className={`block px-5 py-2 text-[13px] tracking-wide text-plum transition-colors hover:bg-silk/40 hover:text-wine ${
                                active ? "font-medium" : ""
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

          <Link to="/home" aria-label="Lencería LR, ir al inicio">
            <Wordmark />
          </Link>

          <div className="flex items-center justify-self-end">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Buscar"
              aria-expanded={searchOpen}
              className={iconButton}
            >
              <Search size={20} strokeWidth={ICON_STROKE} />
            </button>

            {usuario ? (
              <button
                type="button"
                onClick={salir}
                aria-label={`Cerrar sesión de ${usuario.nombre}`}
                title={`Hola, ${usuario.nombre}. Cerrar sesión`}
                className={`${iconButton} hidden xl:flex`}
              >
                <LogOut size={20} strokeWidth={ICON_STROKE} />
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Mi cuenta"
                className={`${iconButton} hidden xl:flex`}
              >
                <User size={20} strokeWidth={ICON_STROKE} />
              </Link>
            )}

            <Link
              to="/carrito"
              aria-label="Carrito de compras"
              className={iconButton}
            >
              <ShoppingBag size={20} strokeWidth={ICON_STROKE} />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-dusty-rose px-1 text-[10px] font-medium text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="absolute inset-x-0 top-full border-b border-border bg-[#FDF3F1] px-4 py-4 xl:px-6">
            <form
              role="search"
              onSubmit={handleSearch}
              className="mx-auto flex max-w-2xl items-center gap-3 border-b border-plum/40 pb-2"
            >
              <Search
                size={20}
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
                className="w-full bg-transparent text-sm text-plum outline-none placeholder:text-mauve/70"
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#FDF3F1] transition-[transform,visibility] duration-300 xl:hidden ${
          menuOpen ? "translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex h-12 items-center justify-between border-b border-border px-5">
          <Wordmark />

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
                  className="block py-3 text-sm tracking-wide text-plum"
                >
                  Mi cuenta
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

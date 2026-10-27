import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { mainLinks } from "../data/navData";

const ICON_STROKE = 1.25;

const iconButton =
  "relative flex h-9 w-9 items-center justify-center text-plum transition-colors hover:text-dusty-rose";

const desktopLinkClass = (isActive, highlight) =>
  [
    "relative text-[13px] tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-champagne after:transition-transform hover:after:scale-x-100",
    highlight ? "text-dusty-rose" : "text-plum hover:text-wine",
    isActive ? "after:scale-x-100" : "after:scale-x-0",
  ].join(" ");

const mobileLinkClass = (isActive, highlight) =>
  [
    "block border-b border-border py-3 text-sm tracking-wide transition-colors",
    highlight ? "text-dusty-rose" : "text-plum",
    isActive ? "font-medium" : "",
  ].join(" ");

function Wordmark() {
  return (
    <span className="flex flex-col items-center whitespace-nowrap leading-none">
      <span
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        className="pl-[0.3em] text-[22px] font-medium tracking-[0.3em] text-wine xl:text-[24px]"
      >
        LENCERÍA LR
      </span>
      <span aria-hidden="true" className="mt-1.5 h-px w-10 bg-champagne" />
    </span>
  );
}

export default function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchInputRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
                {mainLinks.map((link) => (
                  <li key={link.id}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        desktopLinkClass(isActive, link.highlight)
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
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

            <Link
              to="/login"
              aria-label="Mi cuenta"
              className={`${iconButton} hidden xl:flex`}
            >
              <User size={20} strokeWidth={ICON_STROKE} />
            </Link>

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
            {mainLinks.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    mobileLinkClass(isActive, link.highlight)
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            <li>
              <Link
                to="/login"
                className="block py-3 text-sm tracking-wide text-plum"
              >
                Mi cuenta
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

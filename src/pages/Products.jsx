import { useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { categorias, aTarjeta, formatoPrecio, COLOR_HEX } from "../api/catalogo";
import { useProductos } from "../hooks/useProductos";
import ProductCard from "../components/ProductCard";
import EstadoCatalogo from "../components/EstadoCatalogo";

const ICON_STROKE = 1.4;
const ORDEN_TALLAS = ["XS", "S", "M", "L", "XL", "XXL", "Única"];

// Rangos de precio pensados para el catálogo actual (COP).
const RANGOS_PRECIO = [
  { id: "bajo", etiqueta: `Menos de ${formatoPrecio.format(30000)}`, min: 0, max: 29999 },
  {
    id: "medio",
    etiqueta: `${formatoPrecio.format(30000)} – ${formatoPrecio.format(59999)}`,
    min: 30000,
    max: 59999,
  },
  { id: "alto", etiqueta: `${formatoPrecio.format(60000)} o más`, min: 60000, max: Infinity },
];

const ordenarTallas = (tallas) =>
  [...tallas].sort((a, b) => {
    const ia = ORDEN_TALLAS.indexOf(a);
    const ib = ORDEN_TALLAS.indexOf(b);
    if (ia === -1 && ib === -1) return String(a).localeCompare(String(b));
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

// Solo cuentan las variantes con stock: si una talla o color está
// agotado, el producto no debe aparecer al filtrar por él.
const variantesDisponibles = (producto) =>
  (producto.variantes ?? []).filter(
    (variante) => (Number(variante.stock) || 0) > 0,
  );

const tallasDe = (producto) => {
  const todas = producto.variantes ?? [];
  if (todas.length === 0) return producto.tallas ?? [];

  return [
    ...new Set(
      variantesDisponibles(producto)
        .map((variante) => variante.talla)
        .filter(Boolean),
    ),
  ];
};

const coloresDe = (producto) => {
  const todas = producto.variantes ?? [];
  if (todas.length === 0) return producto.colores ?? [];

  return [
    ...new Set(
      variantesDisponibles(producto)
        .map((variante) => variante.color)
        .filter(Boolean),
    ),
  ];
};

function Grupo({ titulo, children, abiertoInicial = false }) {
  const [abierto, setAbierto] = useState(abiertoInicial);

  return (
    <div className="border-b border-border/70">
      <button
        type="button"
        onClick={() => setAbierto((valor) => !valor)}
        aria-expanded={abierto}
        className="flex w-full items-center justify-between py-4 text-[11px] uppercase tracking-[0.18em] text-plum transition-colors hover:text-wine"
      >
        {titulo}
        <span aria-hidden="true" className="text-base leading-none text-plum/60">
          {abierto ? "−" : "+"}
        </span>
      </button>

      {abierto && <div className="pb-5">{children}</div>}
    </div>
  );
}

function Casilla({ activo, children, onClick }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={activo}
      onClick={onClick}
      className="flex w-full items-center gap-3 py-1.5 text-left text-[13px] text-plum transition-colors hover:text-wine"
    >
      <span
        aria-hidden="true"
        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
          activo ? "border-wine bg-wine text-white" : "border-plum/35 bg-white"
        }`}
      >
        {activo && <Check size={11} strokeWidth={2.5} />}
      </span>
      {children}
    </button>
  );
}

function FilaColor({ color, activo, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`flex w-full items-center gap-3 py-1.5 text-left text-[13px] transition-colors ${
        activo ? "text-wine" : "text-plum hover:text-wine"
      }`}
    >
      <span
        aria-hidden="true"
        style={{ backgroundColor: COLOR_HEX[color] ?? "#d8c3a5" }}
        className={`h-4 w-4 shrink-0 rounded-full border ${
          activo ? "border-wine ring-1 ring-wine ring-offset-2" : "border-plum/20"
        }`}
      />
      {color}
    </button>
  );
}

export default function Products() {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { productos, cargando, error, recargar } = useProductos();

  const [panelAbierto, setPanelAbierto] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia("(min-width: 1024px)").matches,
  );

  const enOfertas = pathname === "/ofertas";

  const categoriaParam = searchParams.get("categoria");
  const categoriaActiva = categorias.some((c) => c.id === categoriaParam)
    ? categoriaParam
    : "todos";

  const tallas = searchParams.getAll("talla");
  const colores = searchParams.getAll("color");
  const precio = searchParams.get("precio");
  const soloDisponibles = searchParams.get("disponible") === "1";
  const orden = searchParams.get("orden") ?? "destacados";

  const filtrosActivos =
    tallas.length +
    colores.length +
    (precio ? 1 : 0) +
    (soloDisponibles ? 1 : 0);

  // ----------------------------------------------------------
  // URL
  // ----------------------------------------------------------
  const actualizarParametros = (cambios) => {
    const siguientes = new URLSearchParams(searchParams);

    for (const [clave, valor] of Object.entries(cambios)) {
      siguientes.delete(clave);

      if (Array.isArray(valor)) {
        valor.forEach((item) => siguientes.append(clave, item));
      } else if (valor) {
        siguientes.set(clave, valor);
      }
    }

    setSearchParams(siguientes, { replace: true });
  };

  const seleccionarCategoria = (id) => {
    const siguientes = new URLSearchParams(searchParams);

    if (id === "todos") {
      siguientes.delete("categoria");
    } else {
      siguientes.set("categoria", id);
    }

    // Al cambiar de categoría se descartan los filtros que ya no
    // existen en ella (evita resultados vacíos por tallas/colores
    // de otra categoría).
    const enCategoria =
      id === "todos"
        ? productos
        : productos.filter((producto) => producto.categoriaId === id);

    const tallasValidas = new Set(enCategoria.flatMap(tallasDe));
    const coloresValidos = new Set(enCategoria.flatMap(coloresDe));

    const tallasActuales = siguientes
      .getAll("talla")
      .filter((talla) => tallasValidas.has(talla));
    const coloresActuales = siguientes
      .getAll("color")
      .filter((color) => coloresValidos.has(color));

    siguientes.delete("talla");
    siguientes.delete("color");
    tallasActuales.forEach((talla) => siguientes.append("talla", talla));
    coloresActuales.forEach((color) => siguientes.append("color", color));

    setSearchParams(siguientes, { replace: true });
  };

  const alternarFiltro = (clave, valor) => {
    const actuales = searchParams.getAll(clave);
    const siguientes = actuales.includes(valor)
      ? actuales.filter((item) => item !== valor)
      : [...actuales, valor];

    actualizarParametros({ [clave]: siguientes });
  };

  const limpiarFiltros = () => {
    const siguientes = new URLSearchParams(searchParams);
    ["talla", "color", "precio", "disponible", "orden"].forEach((clave) =>
      siguientes.delete(clave),
    );
    setSearchParams(siguientes, { replace: true });
  };

  // ----------------------------------------------------------
  // DATOS
  // ----------------------------------------------------------
  const base = useMemo(() => {
    if (enOfertas) {
      return productos.filter((producto) => producto.precioAnterior);
    }

    if (categoriaActiva !== "todos") {
      return productos.filter(
        (producto) => producto.categoriaId === categoriaActiva,
      );
    }

    return productos;
  }, [productos, enOfertas, categoriaActiva]);

  const tallasDisponibles = useMemo(
    () => ordenarTallas([...new Set(base.flatMap(tallasDe))]),
    [base],
  );

  const coloresDisponibles = useMemo(
    () =>
      [...new Set(base.flatMap(coloresDe))].sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [base],
  );

  const productosVisibles = useMemo(() => {
    let lista = base;

    if (tallas.length > 0 || colores.length > 0) {
      lista = lista.filter((producto) => {
        const variantes = variantesDisponibles(producto);

        // Se exige una misma variante que cumpla talla y color.
        if (variantes.length > 0) {
          return variantes.some(
            (variante) =>
              (tallas.length === 0 || tallas.includes(variante.talla)) &&
              (colores.length === 0 || colores.includes(variante.color)),
          );
        }

        // Productos sin variantes: se usan sus listas planas.
        const tallaOk =
          tallas.length === 0 ||
          tallasDe(producto).some((talla) => tallas.includes(talla));
        const colorOk =
          colores.length === 0 ||
          coloresDe(producto).some((color) => colores.includes(color));

        return tallaOk && colorOk;
      });
    }

    if (precio) {
      const rango = RANGOS_PRECIO.find((item) => item.id === precio);

      if (rango) {
        lista = lista.filter(
          (producto) =>
            producto.precio >= rango.min && producto.precio <= rango.max,
        );
      }
    }

    if (soloDisponibles) {
      lista = lista.filter((producto) => (producto.stock ?? 0) > 0);
    }

    if (orden === "precio-asc") {
      lista = [...lista].sort((a, b) => a.precio - b.precio);
    } else if (orden === "precio-desc") {
      lista = [...lista].sort((a, b) => b.precio - a.precio);
    }

    return lista;
  }, [base, tallas, colores, precio, soloDisponibles, orden]);

  let titulo = "Nuestra colección";
  let subtitulo = "Encuentra tu estilo, celebra tu esencia.";

  if (enOfertas) {
    titulo = "Ofertas";
    subtitulo =
      "Tus prendas favoritas con precios especiales, por tiempo limitado.";
  } else if (categoriaActiva !== "todos") {
    titulo = categorias.find((c) => c.id === categoriaActiva).nombre;
  }

  const opciones = [{ id: "todos", nombre: "Todos" }, ...categorias];

  const mensajeVacio =
    filtrosActivos > 0
      ? "No hay productos con los filtros seleccionados."
      : enOfertas
        ? "Todavía no hay productos en oferta."
        : "No hay productos en esta categoría.";

  return (
    <main className="min-h-screen bg-white font-body text-plum">
      <section className="border-b border-border/50 bg-[#FDF3F1]/45">
        <div className="mx-auto max-w-[1440px] px-4 py-12 text-center md:px-8 md:py-14">
          <h1 className="font-heading text-4xl leading-tight text-wine md:text-5xl">
            {titulo}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-mauve">
            {subtitulo}
          </p>

          {!enOfertas && (
            <div
              role="group"
              aria-label="Filtrar por categoría"
              className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
            >
              {opciones.map((opcion) => {
                const activa = categoriaActiva === opcion.id;
                return (
                  <button
                    key={opcion.id}
                    type="button"
                    aria-pressed={activa}
                    onClick={() => seleccionarCategoria(opcion.id)}
                    className={`text-[10px] uppercase tracking-[0.18em] transition-colors ${
                      activa
                        ? "text-wine underline decoration-champagne decoration-1 underline-offset-[10px]"
                        : "text-mauve hover:text-wine"
                    }`}
                  >
                    {opcion.nombre}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-20 md:px-8">
        {/* Barra de orden y filtros */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-plum">
            Ordenar por
            <select
              value={orden}
              onChange={(event) =>
                actualizarParametros({
                  orden:
                    event.target.value === "destacados"
                      ? null
                      : event.target.value,
                })
              }
              aria-label="Ordenar productos"
              className="cursor-pointer border-0 bg-transparent py-1 pr-1 text-[10px] uppercase tracking-[0.16em] text-plum outline-none"
            >
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => setPanelAbierto((abierto) => !abierto)}
            aria-expanded={panelAbierto}
            aria-controls="panel-filtros"
            className="bg-plum px-8 py-3 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-wine md:px-10"
          >
            Filtros{filtrosActivos > 0 ? ` (${filtrosActivos})` : ""}
          </button>
        </div>

        <div
          className={`mt-6 lg:grid lg:gap-x-12 ${
            panelAbierto ? "lg:grid-cols-[minmax(0,1fr)_240px]" : ""
          }`}
        >
          {panelAbierto && (
            <aside
              id="panel-filtros"
              aria-label="Filtros"
              className="mb-8 lg:order-2 lg:mb-0"
            >
              <div className="lg:sticky lg:top-28">
                {tallasDisponibles.length > 0 && (
                  <Grupo titulo="Talla" abiertoInicial>
                    <div className="grid grid-cols-2 gap-x-4">
                      {tallasDisponibles.map((talla) => (
                        <Casilla
                          key={talla}
                          activo={tallas.includes(talla)}
                          onClick={() => alternarFiltro("talla", talla)}
                        >
                          {talla}
                        </Casilla>
                      ))}
                    </div>
                  </Grupo>
                )}

                {coloresDisponibles.length > 0 && (
                  <Grupo titulo="Color" abiertoInicial>
                    <div className="grid grid-cols-2 gap-x-4">
                      {coloresDisponibles.map((color) => (
                        <FilaColor
                          key={color}
                          color={color}
                          activo={colores.includes(color)}
                          onClick={() => alternarFiltro("color", color)}
                        />
                      ))}
                    </div>
                  </Grupo>
                )}

                <Grupo titulo="Precio">
                  {RANGOS_PRECIO.map((rango) => (
                    <Casilla
                      key={rango.id}
                      activo={precio === rango.id}
                      onClick={() =>
                        actualizarParametros({
                          precio: precio === rango.id ? null : rango.id,
                        })
                      }
                    >
                      {rango.etiqueta}
                    </Casilla>
                  ))}
                </Grupo>

                <Grupo titulo="Disponibilidad">
                  <Casilla
                    activo={soloDisponibles}
                    onClick={() =>
                      actualizarParametros({
                        disponible: soloDisponibles ? null : "1",
                      })
                    }
                  >
                    Solo disponibles
                  </Casilla>
                </Grupo>

                {filtrosActivos > 0 && (
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="mt-5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-dusty-rose transition-colors hover:text-wine"
                  >
                    <X size={12} strokeWidth={ICON_STROKE} />
                    Limpiar filtros
                  </button>
                )}
              </div>
            </aside>
          )}

          <div className="lg:order-1">
            {!cargando && !error && (
              <p className="mb-4 text-[10px] uppercase tracking-[0.16em] text-mauve">
                {productosVisibles.length}{" "}
                {productosVisibles.length === 1 ? "producto" : "productos"}
              </p>
            )}

            <EstadoCatalogo
              cargando={cargando}
              error={error}
              vacio={productosVisibles.length === 0}
              mensajeVacio={mensajeVacio}
              onReintentar={recargar}
            >
              <ul className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
                {productosVisibles.map((producto) => (
                  <ProductCard key={producto.id} product={aTarjeta(producto)} />
                ))}
              </ul>
            </EstadoCatalogo>
          </div>
        </div>
      </section>
    </main>
  );
}

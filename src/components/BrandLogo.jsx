import logo from "../assets/logo.svg";

// Tonos del logo. El SVG original es rosa; para fondos oscuros o claros
// se recolorea con filtros para no perder el contraste.
const TONOS = {
  brand: "",
  light: "brightness-0 invert",
  dark: "brightness-0",
};

/**
 * Logo oficial de Lujo Rosado.
 * El tamaño se controla con clases de altura, por ejemplo `h-8`.
 */
export default function BrandLogo({
  tono = "brand",
  className = "h-8",
  alt = "Lujo Rosado",
}) {
  return (
    <img
      src={logo}
      alt={alt}
      draggable="false"
      className={`w-auto select-none ${TONOS[tono] ?? TONOS.brand} ${className}`}
    />
  );
}

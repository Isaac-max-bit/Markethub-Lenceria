import { useLocation } from "react-router-dom";

export default function Proximamente() {
  const { pathname } = useLocation();
  const seccion = pathname.split("/").filter(Boolean).pop() ?? "";

  return (
    <div className="mx-auto mt-20 max-w-md border border-border bg-white p-10 text-center">
      <h2 className="font-heading text-3xl capitalize text-plum">{seccion}</h2>
      <p className="mt-3 text-sm text-mauve">
        Esta sección todavía está en construcción.
      </p>
    </div>
  );
}
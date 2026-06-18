import { ChevronDown } from "lucide-react"

// Selector de color para el carrito (no modifica la imagen del producto)
export default function ColorSelector({
  colores = [],
  colorSeleccionado,
  onSeleccionar,
  deshabilitado = false,
  label = "Color:",
  id = "color-producto",
}) {
  if (colores.length === 0) {
    return <p className="text-sm text-gray-500">Sin colores disponibles</p>
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative max-w-xs">
        <select
          id={id}
          value={colorSeleccionado ?? colores[0] ?? ""}
          onChange={(e) => onSeleccionar(e.target.value)}
          disabled={deshabilitado}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 shadow-sm transition focus:border-[#F97316] focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {colores.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          aria-hidden
        />
      </div>
    </div>
  )
}

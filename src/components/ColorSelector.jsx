import {
  esColorCombinado,
  esColorSolido,
  colorAHex,
  hexFallbackCombinado,
} from "../utils/colorHelpers"

// Selector de color: miniaturas para combinaciones, círculos para colores sólidos
export default function ColorSelector({
  colores = [],
  imagenesPorColor = {},
  colorSeleccionado,
  onSeleccionar,
  deshabilitado = false,
}) {
  if (colores.length === 0) {
    return <p className="text-sm text-gray-500">Sin colores disponibles</p>
  }

  return (
    <div className="flex flex-wrap gap-4">
      {colores.map((nombre) => {
        const seleccionado = colorSeleccionado === nombre
        const combinado = esColorCombinado(nombre)
        const solido = esColorSolido(nombre)
        const imagen = imagenesPorColor[nombre]
        const mostrarMiniatura = combinado && imagen

        if (mostrarMiniatura) {
          return (
            <button
              key={nombre}
              type="button"
              onClick={() => onSeleccionar(nombre)}
              disabled={deshabilitado}
              className="flex flex-col items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Color ${nombre}`}
              aria-pressed={seleccionado}
            >
              <span
                className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                  seleccionado
                    ? "border-[#F97316] ring-2 ring-orange-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={imagen}
                  alt={nombre}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </span>
              <span
                className={`max-w-[4.5rem] text-center text-xs leading-tight ${
                  seleccionado ? "font-semibold text-[#F97316]" : "text-gray-600"
                }`}
              >
                {nombre}
              </span>
            </button>
          )
        }

        const hex =
          (solido ? colorAHex(nombre) : null) || hexFallbackCombinado(nombre)

        if (hex) {
          return (
            <button
              key={nombre}
              type="button"
              onClick={() => onSeleccionar(nombre)}
              disabled={deshabilitado}
              className="flex flex-col items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Color ${nombre}`}
              aria-pressed={seleccionado}
            >
              <span
                className={`h-10 w-10 rounded-full border-2 transition ${
                  seleccionado
                    ? "border-[#F97316] ring-2 ring-orange-200"
                    : "border-gray-200 hover:scale-105"
                }`}
                style={{ backgroundColor: hex }}
              />
              <span
                className={`max-w-[4.5rem] text-center text-xs leading-tight ${
                  seleccionado ? "font-semibold text-[#F97316]" : "text-gray-600"
                }`}
              >
                {nombre}
              </span>
            </button>
          )
        }

        return (
          <button
            key={nombre}
            type="button"
            onClick={() => onSeleccionar(nombre)}
            disabled={deshabilitado}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
              seleccionado
                ? "border-[#F97316] bg-orange-50 text-[#F97316]"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {nombre}
          </button>
        )
      })}
    </div>
  )
}

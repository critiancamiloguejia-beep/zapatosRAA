import { COLORES } from "./constants"

// Convierte el nombre del color de la BD a un hex para el swatch (si se reconoce)
export function colorAHex(nombre) {
  if (!nombre) return null

  const normalizado = nombre.toLowerCase().trim()
  const exacto = COLORES.find((c) => c.nombre.toLowerCase() === normalizado)
  if (exacto) return exacto.hex

  if (normalizado.includes("negro")) return "#000000"
  if (normalizado.includes("blanco")) return "#FFFFFF"
  if (normalizado.includes("rojo")) return "#FF0000"
  if (normalizado.includes("azul marino")) return "#1e3a5f"
  if (normalizado.includes("azul")) return "#0000FF"
  if (normalizado.includes("beige") || normalizado.includes("crema")) return "#F5F5DC"
  if (
    normalizado.includes("café") ||
    normalizado.includes("cafe") ||
    normalizado.includes("marrón") ||
    normalizado.includes("marron")
  )
    return "#8B4513"
  if (normalizado.includes("gris")) return "#808080"
  if (normalizado.includes("naranja")) return "#F97316"
  if (normalizado.includes("verde")) return "#228B22"
  if (normalizado.includes("rosa")) return "#FFC0CB"

  return null
}

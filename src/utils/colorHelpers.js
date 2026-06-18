import { COLORES } from "./constants"
import { construirGaleria } from "../services/productMapper"

// Colores con dos o más palabras: "Negro Blanco", "Crema Naranja", etc.
export function esColorCombinado(nombre) {
  if (!nombre) return false
  return nombre.trim().split(/\s+/).length > 1
}

// Un solo color reconocible: "Negro", "Rojo", "Gris", etc.
export function esColorSolido(nombre) {
  if (!nombre) return false
  return !esColorCombinado(nombre)
}

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

// Hex de respaldo para combinaciones sin imagen (usa la primera palabra del nombre)
export function hexFallbackCombinado(nombre) {
  const primeraPalabra = nombre.trim().split(/\s+/)[0]
  return colorAHex(primeraPalabra) || colorAHex(nombre)
}

// Asocia cada color con una imagen por índice: principal + array imagenes
export function mapearImagenesPorColor(producto) {
  if (!producto?.colores?.length) return {}

  const galeria = construirGaleria(producto)
  const imagenPrincipal = producto.imagen || galeria[0] || null
  const mapa = {}

  producto.colores.forEach((color, indice) => {
    const imagenAsociada = galeria[indice] || imagenPrincipal
    if (imagenAsociada) mapa[color] = imagenAsociada
  })

  return mapa
}

export function imagenParaColor(producto, nombreColor) {
  const mapa = mapearImagenesPorColor(producto)
  return mapa[nombreColor] ?? producto?.imagen ?? null
}

export const MENSAJE_IMAGEN_REFERENCIA =
  "Imagen de referencia. El producto se enviará en el color seleccionado."

import { getImagenUrl, esUrlImagenValida } from "../utils/storageHelpers"
import { MAX_IMAGENES_PRODUCTO } from "../utils/constants"

// Solo URLs no vacías (null, undefined, "", espacios)
export { esUrlImagenValida }

function normalizarUrls(urls) {
  const vistas = new Set()
  return urls
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter((url) => {
      if (!esUrlImagenValida(url) || vistas.has(url)) return false
      vistas.add(url)
      return true
    })
}

function imagenPrincipalDesdeFila(fila) {
  const url = getImagenUrl(fila.imagen)
  return url && esUrlImagenValida(url) ? url : null
}

function imagenesDesdeDb(fila) {
  if (!Array.isArray(fila.imagenes)) return []

  return normalizarUrls(
    fila.imagenes.map((url) => getImagenUrl(String(url).trim()))
  )
}

function normalizarTallas(tallas) {
  if (!Array.isArray(tallas)) return []
  return tallas
    .map((t) => Number(t))
    .filter((t) => !Number.isNaN(t) && t > 0)
}

function normalizarColores(colores) {
  if (!Array.isArray(colores)) return []
  return colores.map((c) => String(c).trim()).filter(Boolean)
}

// Galería completa: imagen principal + array imagenes (máx. 8)
export function construirGaleria(producto) {
  const lista = []
  if (producto?.imagen) lista.push(producto.imagen)

  for (const url of producto?.imagenes || []) {
    if (url && !lista.includes(url)) lista.push(url)
  }

  return lista.slice(0, MAX_IMAGENES_PRODUCTO)
}

// Mapea una fila de Supabase al modelo del frontend (camelCase)
export function mapearProducto(fila) {
  const imagen = imagenPrincipalDesdeFila(fila)
  const imagenes = imagenesDesdeDb(fila)

  return {
    id: fila.id,
    nombre: fila.nombre,
    categoria: fila.categoria || "",
    precio: fila.precio,
    precioAnterior: fila.precio_anterior || null,
    descripcion: fila.descripcion || "",
    emoji: fila.emoji || "👟",
    imagen,
    imagenes,
    destacado: fila.destacado ?? true,
    badge: fila.badge || null,
    calificacion: fila.calificacion || 0,
    reseñas: fila.resenas || 0,
    stock: fila.stock ?? 0,
    tallas: normalizarTallas(fila.tallas),
    colores: normalizarColores(fila.colores),
    marca: fila.marca || null,
    genero: fila.genero || null,
  }
}

// Productos locales sin Supabase
export function mapearProductoLocal(producto) {
  const imagen =
    producto.imagen && esUrlImagenValida(producto.imagen)
      ? producto.imagen.trim()
      : null

  const imagenes = Array.isArray(producto.imagenes)
    ? producto.imagenes
        .map((url) => (typeof url === "string" ? url.trim() : ""))
        .filter((url) => esUrlImagenValida(url))
        .slice(0, MAX_IMAGENES_PRODUCTO)
    : []

  return {
    ...producto,
    imagen,
    imagenes,
    tallas: normalizarTallas(producto.tallas),
    colores: normalizarColores(producto.colores),
  }
}

import { getImagenUrl, esUrlImagenValida } from "../utils/storageHelpers"

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

function resolverImagenes(fila) {
  const filas = (fila.producto_imagenes || []).filter(
    (img) => img?.url && esUrlImagenValida(String(img.url))
  )
  const ordenadas = [...filas].sort((a, b) => a.orden - b.orden)
  const urls = normalizarUrls(
    ordenadas.map((img) => getImagenUrl(String(img.url).trim()))
  )

  if (urls.length > 0) return urls

  const legacy = getImagenUrl(fila.imagen)
  return legacy && esUrlImagenValida(legacy) ? [legacy] : []
}

// Mapea una fila de Supabase (snake_case) al modelo del frontend (camelCase)
export function mapearProducto(fila) {
  const imagenes = resolverImagenes(fila)

  return {
    id: fila.id,
    nombre: fila.nombre,
    categoria: fila.categorias?.nombre || fila.categoria || "",
    precio: fila.precio,
    precioAnterior: fila.precio_anterior || null,
    descripcion: fila.descripcion || "",
    emoji: fila.emoji || "📦",
    imagenes,
    imagen: imagenes[0] || null,
    destacado: fila.destacado,
    badge: fila.badge || null,
    calificacion: fila.calificacion || 0,
    reseñas: fila.resenas || 0,
    stock: fila.stock || 0,
  }
}

// Productos locales sin Supabase: sin galería, solo emoji
export function mapearProductoLocal(producto) {
  const imagen =
    producto.imagen && esUrlImagenValida(producto.imagen)
      ? producto.imagen.trim()
      : null

  return {
    ...producto,
    imagenes: imagen ? [imagen] : [],
    imagen,
  }
}

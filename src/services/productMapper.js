import { getImagenUrl } from "../utils/storageHelpers"

function resolverImagenes(fila) {
  const filas = fila.producto_imagenes || []
  const ordenadas = [...filas].sort((a, b) => a.orden - b.orden)
  const urls = ordenadas
    .map((img) => getImagenUrl(img.url))
    .filter(Boolean)

  if (urls.length > 0) return urls

  const legacy = getImagenUrl(fila.imagen)
  return legacy ? [legacy] : []
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
  return {
    ...producto,
    imagenes: [],
    imagen: producto.imagen ?? null,
  }
}

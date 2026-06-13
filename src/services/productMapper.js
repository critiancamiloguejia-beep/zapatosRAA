import { getImagenUrl } from "../utils/storageHelpers"

// Mapea una fila de Supabase (snake_case) al modelo del frontend (camelCase)
export function mapearProducto(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    categoria: fila.categorias?.nombre || fila.categoria || "",
    precio: fila.precio,
    precioAnterior: fila.precio_anterior || null,
    descripcion: fila.descripcion || "",
    emoji: fila.emoji || "📦",
    imagen: getImagenUrl(fila.imagen),
    destacado: fila.destacado,
    badge: fila.badge || null,
    calificacion: fila.calificacion || 0,
    reseñas: fila.resenas || 0,
    stock: fila.stock || 0,
  }
}

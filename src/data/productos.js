// Catálogo de productos de ejemplo para la tienda
export const productos = [
  {
    id: 1,
    nombre: "Camiseta básica",
    categoria: "Ropa",
    precio: 35000,
    precioAnterior: 45000,
    descripcion: "Camiseta de algodón 100%, disponible en varios colores.",
    emoji: "👕",
    destacado: true,
    badge: "Más vendido",
    calificacion: 4.8,
    reseñas: 234,
  },
  {
    id: 2,
    nombre: "Jeans clásicos",
    categoria: "Ropa",
    precio: 89000,
    precioAnterior: 110000,
    descripcion: "Pantalón jeans de corte recto, tela resistente y cómoda.",
    emoji: "👖",
    destacado: true,
    badge: "Más vendido",
    calificacion: 4.7,
    reseñas: 189,
  },
  {
    id: 3,
    nombre: "Zapatillas urbanas",
    categoria: "Calzado",
    precio: 120000,
    precioAnterior: 150000,
    descripcion: "Zapatillas ligeras ideales para el día a día.",
    emoji: "👟",
    destacado: true,
    badge: "Más vendido",
    calificacion: 4.9,
    reseñas: 312,
  },
  {
    id: 4,
    nombre: "Mochila deportiva",
    categoria: "Accesorios",
    precio: 65000,
    precioAnterior: 82000,
    descripcion: "Mochila con compartimento para laptop y bolsillos laterales.",
    emoji: "🎒",
    destacado: true,
    badge: "15% OFF",
    calificacion: 4.6,
    reseñas: 156,
  },
  {
    id: 5,
    nombre: "Reloj digital",
    categoria: "Accesorios",
    precio: 45000,
    precioAnterior: 58000,
    descripcion: "Reloj resistente al agua con cronómetro y alarma.",
    emoji: "⌚",
    destacado: true,
    badge: "Más vendido",
    calificacion: 4.5,
    reseñas: 98,
  },
  {
    id: 6,
    nombre: "Gorra ajustable",
    categoria: "Accesorios",
    precio: 28000,
    precioAnterior: 35000,
    descripcion: "Gorra de algodón con visera curva y cierre ajustable.",
    emoji: "🧢",
    destacado: true,
    badge: "Nuevo",
    calificacion: 4.4,
    reseñas: 67,
  },
  {
    id: 7,
    nombre: "Chaqueta impermeable",
    categoria: "Ropa",
    precio: 145000,
    precioAnterior: 180000,
    descripcion: "Chaqueta ligera con capucha, ideal para días lluviosos.",
    emoji: "🧥",
    destacado: false,
    badge: "20% OFF",
    calificacion: 4.7,
    reseñas: 143,
  },
  {
    id: 8,
    nombre: "Sandalias de playa",
    categoria: "Calzado",
    precio: 32000,
    precioAnterior: 40000,
    descripcion: "Sandalias cómodas con suela antideslizante.",
    emoji: "🩴",
    destacado: false,
    badge: "Nuevo",
    calificacion: 4.3,
    reseñas: 54,
  },
  {
    id: 9,
    nombre: "Bufanda de lana",
    categoria: "Accesorios",
    precio: 38000,
    precioAnterior: 48000,
    descripcion: "Bufanda suave y abrigadora, disponible en varios tonos.",
    emoji: "🧣",
    destacado: false,
    badge: "10% OFF",
    calificacion: 4.6,
    reseñas: 89,
  },
  {
    id: 10,
    nombre: "Vestido casual",
    categoria: "Ropa",
    precio: 78000,
    precioAnterior: 95000,
    descripcion: "Vestido de corte holgado, perfecto para ocasiones informales.",
    emoji: "👗",
    destacado: false,
    badge: "Nuevo",
    calificacion: 4.8,
    reseñas: 201,
  },
  {
    id: 11,
    nombre: "Botas de cuero",
    categoria: "Calzado",
    precio: 185000,
    precioAnterior: 220000,
    descripcion: "Botas de cuero genuino con suela de goma antideslizante.",
    emoji: "🥾",
    destacado: false,
    badge: "Más vendido",
    calificacion: 4.9,
    reseñas: 278,
  },
  {
    id: 12,
    nombre: "Cinturón de cuero",
    categoria: "Accesorios",
    precio: 42000,
    precioAnterior: 52000,
    descripcion: "Cinturón clásico de cuero con hebilla metálica.",
    emoji: "👔",
    destacado: false,
    badge: "15% OFF",
    calificacion: 4.5,
    reseñas: 112,
  },
]

// Obtener categorías únicas del catálogo
export const categorias = [...new Set(productos.map((p) => p.categoria))]

// Formatear precio en pesos colombianos: $35.000
export function formatearPrecio(precio) {
  return `$${precio.toLocaleString("es-CO")}`
}

// Obtener productos relacionados por categoría (excluye el actual)
export function obtenerProductosRelacionados(productoId, limite = 4) {
  const producto = productos.find((p) => p.id === productoId)
  if (!producto) return []

  const mismaCategoria = productos.filter(
    (p) => p.categoria === producto.categoria && p.id !== productoId
  )
  const otros = productos.filter(
    (p) => p.categoria !== producto.categoria && p.id !== productoId
  )

  return [...mismaCategoria, ...otros].slice(0, limite)
}

// Obtener sugerencias aleatorias para el carrito (excluye productos ya agregados)
export function obtenerProductosSugeridos(idsEnCarrito, limite = 3) {
  const ids = new Set(idsEnCarrito)
  const disponibles = productos.filter((p) => !ids.has(p.id))
  const semilla = idsEnCarrito.reduce((acc, id) => acc + id, 0) || 1

  return [...disponibles]
    .sort((a, b) => ((a.id * semilla) % 7) - ((b.id * semilla) % 7))
    .slice(0, limite)
}

// Stock ficticio estable según el ID del producto (entre 2 y 8)
export function obtenerStock(productoId) {
  return ((productoId * 7 + 3) % 7) + 2
}

// Emojis representativos por categoría
export const emojiCategoria = {
  Ropa: "👕",
  Calzado: "👟",
  Accesorios: "🎒",
}

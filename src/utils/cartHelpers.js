export function claveItemCarrito(item) {
  return `${item.id}-${item.talla ?? ""}-${item.color ?? ""}`
}

export function textoTalla(item) {
  return item.talla != null ? `Talla ${item.talla}` : null
}

export function textoColor(item) {
  return item.color ? `Color ${item.color}` : null
}

export function lineaProductoPedido(item, formatearPrecio) {
  const talla = item.talla != null ? item.talla : "N/A"
  const color = item.color || "N/A"
  const subtotal = formatearPrecio(item.precio * item.cantidad)
  return `${item.nombre} - Talla ${talla} - Color ${color} - ${item.cantidad} unidades - ${subtotal}`
}

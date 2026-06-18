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
  const talla = textoTalla(item) ?? "Talla N/A"
  const color = textoColor(item) ?? "Color N/A"
  const subtotal = formatearPrecio(item.precio * item.cantidad)
  return `${item.nombre} - ${talla} - ${color} - ${item.cantidad} unidades - ${subtotal}`
}

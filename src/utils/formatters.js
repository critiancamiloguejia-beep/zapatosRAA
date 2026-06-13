// Formatea precio en pesos colombianos: 35000 → "$35.000"
export function formatearPrecio(precio) {
  return "$" + precio.toLocaleString("es-CO")
}

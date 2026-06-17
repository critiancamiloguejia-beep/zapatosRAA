export const WHATSAPP_NUMBER = "573197897130"

export function urlWhatsApp(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}

export function mensajePedidoProducto(nombre, { talla, color } = {}) {
  let texto = `Hola, quiero pedir el producto ${nombre}`
  if (talla != null) texto += ` en talla ${talla}`
  if (color) texto += `, color ${color}`
  return texto
}

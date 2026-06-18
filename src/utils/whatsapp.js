import { formatearPrecio } from "./formatters"
import { lineaProductoPedido } from "./cartHelpers"

export const WHATSAPP_NUMBER = "573197897130"

export function urlWhatsApp(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}

export function abrirWhatsApp(mensaje) {
  window.open(urlWhatsApp(mensaje), "_blank", "noopener,noreferrer")
}

export function mensajePedidoProducto(nombre, { talla, color } = {}) {
  let texto = `Hola, quiero pedir el producto ${nombre}`
  if (talla != null) texto += ` en talla ${talla}`
  if (color) texto += `, color ${color}`
  return texto
}

export function mensajeConfirmacionPedido({ formulario, items, total }) {
  const productos = items
    .map((item) => lineaProductoPedido(item, formatearPrecio))
    .join("\n\n")

  return `¡Hola! Quiero hacer un pedido desde Zapatos RAA 🛍️

📍 Datos de envío:
Nombre: ${formulario.nombreCompleto}
Teléfono: ${formulario.telefono}
Dirección: ${formulario.direccion}
Ciudad: ${formulario.ciudad}

📦 Productos:

${productos}

💰 Total: ${formatearPrecio(total)}

¡Gracias! 🙌`
}

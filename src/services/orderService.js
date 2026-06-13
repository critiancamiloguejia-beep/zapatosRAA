import { supabase } from "../lib/supabaseClient"

// Crea un pedido en Supabase con sus items.
// Devuelve el pedido creado o lanza un error.
export async function crearPedido({ formulario, items, totales }) {
  // UUID generado en cliente: evita SELECT tras INSERT (RLS solo permite INSERT en pedidos)
  const pedidoId = crypto.randomUUID()

  const { error: errorPedido } = await supabase.from("pedidos").insert({
    id: pedidoId,
    nombre_completo: formulario.nombreCompleto,
    email: formulario.email,
    telefono: formulario.telefono,
    direccion: formulario.direccion,
    ciudad: formulario.ciudad,
    subtotal: totales.subtotal,
    costo_envio: totales.costoEnvio,
    total: totales.total,
    estado: "pendiente",
  })

  if (errorPedido)
    throw new Error("Error al crear el pedido: " + errorPedido.message)

  const itemsParaInsertar = items.map((item) => ({
    pedido_id: pedidoId,
    producto_id: item.id,
    nombre: item.nombre,
    precio: item.precio,
    cantidad: item.cantidad,
    emoji: item.emoji || "📦",
  }))

  const { error: errorItems } = await supabase
    .from("pedido_items")
    .insert(itemsParaInsertar)

  if (errorItems)
    throw new Error("Error al guardar los items: " + errorItems.message)

  return { id: pedidoId, total: totales.total }
}

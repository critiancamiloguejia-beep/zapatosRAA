import { supabase } from "../lib/supabaseClient"

// Mapea items del carrito al JSONB de la tabla pedidos
function itemsParaJson(items) {
  return items.map((item) => ({
    producto_id: item.id,
    nombre: item.nombre,
    precio: item.precio,
    cantidad: item.cantidad,
    talla: item.talla ?? null,
    color: item.color ?? null,
    emoji: item.emoji ?? null,
  }))
}

// Crea un pedido en Supabase (tabla plana: pedidos con items JSONB)
export async function crearPedido({ formulario, items, totales }) {
  const payload = {
    nombre: formulario.nombreCompleto.trim(),
    telefono: formulario.telefono.trim(),
    direccion: formulario.direccion.trim(),
    ciudad: formulario.ciudad.trim(),
    items: itemsParaJson(items),
    total: Math.round(totales.total),
    estado: "pendiente",
  }

  const { error } = await supabase.from("pedidos").insert(payload)

  if (error) {
    throw new Error(`Error al crear el pedido: ${error.message}`)
  }

  return { id: null, total: payload.total }
}

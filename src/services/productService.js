import { supabase } from "../lib/supabaseClient"
import { mapearProducto, mapearProductoLocal } from "./productMapper"
import { productos as productosLocal, categorias as categoriasLocal } from "../data/productos"

const USAR_SUPABASE = import.meta.env.VITE_USAR_SUPABASE === "true"

// Solo columnas de la tabla productos en Supabase (esquema Zapatos RAA)
const SELECT_PRODUCTO =
  "id, nombre, descripcion, precio, categoria, imagen, imagenes, stock, tallas, colores, marca, genero, proveedor"

function asegurarCliente() {
  if (!supabase) {
    throw new Error(
      "Supabase no configurado. Revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env"
    )
  }
}

async function consultarProductos(opciones = {}) {
  asegurarCliente()
  const { limite, categoria, q, orden, excluirId, ids } = opciones

  let query = supabase.from("productos").select(SELECT_PRODUCTO)

  if (excluirId) query = query.neq("id", excluirId)
  if (ids?.length) query = query.in("id", ids)
  if (categoria) query = query.eq("categoria", categoria)
  if (q) query = query.ilike("nombre", `%${q}%`)

  if (orden === "precio_asc" || orden === "menor")
    query = query.order("precio", { ascending: true })
  else if (orden === "precio_desc" || orden === "mayor")
    query = query.order("precio", { ascending: false })
  else query = query.order("id")

  if (limite) query = query.limit(limite)

  const { data, error } = await query
  if (error) throw new Error("Error al obtener productos: " + error.message)
  return (data || []).map(mapearProducto)
}

// --- FUNCIONES PÚBLICAS ---

export async function obtenerTodosLosProductos() {
  if (!USAR_SUPABASE) return productosLocal.map(mapearProductoLocal)
  return consultarProductos()
}

export async function obtenerProductoPorId(id) {
  if (!USAR_SUPABASE) {
    const p = productosLocal.find((prod) => prod.id === Number(id))
    return p ? mapearProductoLocal(p) : null
  }

  const productos = await consultarProductos({ ids: [Number(id)] })
  return productos[0] || null
}

export async function obtenerProductosPorIds(ids) {
  if (!USAR_SUPABASE) {
    return ids
      .map((id) => productosLocal.find((p) => p.id === Number(id)))
      .filter(Boolean)
      .map(mapearProductoLocal)
  }

  const productos = await consultarProductos({ ids: ids.map(Number) })
  return ids
    .map((id) => productos.find((p) => p.id === Number(id)))
    .filter(Boolean)
}

export async function obtenerProductosDestacados(limite = 8) {
  if (!USAR_SUPABASE) {
    return productosLocal
      .filter((p) => p.destacado)
      .slice(0, limite)
      .map(mapearProductoLocal)
  }

  return consultarProductos({ limite })
}

export async function obtenerCategorias() {
  if (!USAR_SUPABASE) {
    return categoriasLocal.map((nombre) => ({ nombre }))
  }

  asegurarCliente()

  const { data, error } = await supabase.from("productos").select("categoria")

  if (error) throw new Error("Error al obtener categorías: " + error.message)

  const unicas = [...new Set((data || []).map((p) => p.categoria).filter(Boolean))]
  return unicas.sort().map((nombre) => ({ nombre }))
}

export async function obtenerProductosFiltrados({ categoria, q, orden } = {}) {
  if (!USAR_SUPABASE) {
    let resultado = [...productosLocal]
    if (categoria)
      resultado = resultado.filter((p) => p.categoria === categoria)
    if (q)
      resultado = resultado.filter((p) =>
        p.nombre.toLowerCase().includes(q.toLowerCase())
      )
    if (orden === "precio_asc" || orden === "menor")
      resultado.sort((a, b) => a.precio - b.precio)
    if (orden === "precio_desc" || orden === "mayor")
      resultado.sort((a, b) => b.precio - a.precio)
    return resultado.map(mapearProductoLocal)
  }

  return consultarProductos({ categoria, q, orden })
}

export async function obtenerProductosRelacionados(id, limite = 4) {
  const producto = await obtenerProductoPorId(id)
  if (!producto) return []

  if (!USAR_SUPABASE) {
    return productosLocal
      .filter(
        (p) => p.categoria === producto.categoria && p.id !== Number(id)
      )
      .slice(0, limite)
      .map(mapearProductoLocal)
  }

  return consultarProductos({
    categoria: producto.categoria,
    excluirId: id,
    limite,
  })
}

export async function obtenerProductosSugeridos(idsExcluir = [], limite = 3) {
  if (!USAR_SUPABASE) {
    const semilla = idsExcluir.reduce((acc, id) => acc + id, 0) || 1
    return productosLocal
      .filter((p) => !idsExcluir.includes(p.id))
      .sort((a, b) => ((a.id * semilla) % 7) - ((b.id * semilla) % 7))
      .slice(0, limite)
      .map(mapearProductoLocal)
  }

  const todos = await consultarProductos()
  return todos.filter((p) => !idsExcluir.includes(p.id)).slice(0, limite)
}

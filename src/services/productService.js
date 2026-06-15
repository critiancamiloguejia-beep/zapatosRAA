import { supabase } from "../lib/supabaseClient"
import { mapearProducto, mapearProductoLocal } from "./productMapper"
import { productos as productosLocal } from "../data/productos"

const USAR_SUPABASE = import.meta.env.VITE_USAR_SUPABASE === "true"

const SELECT_PRODUCTO =
  "*, categorias(nombre), producto_imagenes(url, orden)"

// --- FUNCIONES PÚBLICAS ---

export async function obtenerTodosLosProductos() {
  if (!USAR_SUPABASE) return productosLocal.map(mapearProductoLocal)

  const { data, error } = await supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("activo", true)
    .order("id")

  if (error) throw new Error("Error al obtener productos: " + error.message)
  return data.map(mapearProducto)
}

export async function obtenerProductoPorId(id) {
  if (!USAR_SUPABASE) {
    const p = productosLocal.find((prod) => prod.id === Number(id))
    return p ? mapearProductoLocal(p) : null
  }

  const { data, error } = await supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("id", id)
    .eq("activo", true)
    .single()

  if (error) return null
  return mapearProducto(data)
}

export async function obtenerProductosPorIds(ids) {
  if (!USAR_SUPABASE) {
    return ids
      .map((id) => productosLocal.find((p) => p.id === Number(id)))
      .filter(Boolean)
      .map(mapearProductoLocal)
  }

  const { data, error } = await supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .in("id", ids)
    .eq("activo", true)

  if (error)
    throw new Error("Error al obtener productos por ids: " + error.message)

  const productosMapeados = data.map(mapearProducto)
  return ids
    .map((id) => productosMapeados.find((p) => p.id === Number(id)))
    .filter(Boolean)
}

export async function obtenerProductosDestacados(limite = 6) {
  if (!USAR_SUPABASE)
    return productosLocal
      .filter((p) => p.destacado)
      .slice(0, limite)
      .map(mapearProductoLocal)

  const { data, error } = await supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("activo", true)
    .eq("destacado", true)
    .limit(limite)

  if (error) throw new Error("Error al obtener destacados: " + error.message)
  return data.map(mapearProducto)
}

export async function obtenerCategorias() {
  if (!USAR_SUPABASE) {
    const unicas = [...new Set(productosLocal.map((p) => p.categoria))]
    return unicas.map((nombre) => ({ nombre }))
  }

  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, emoji")
    .eq("activa", true)
    .order("nombre")

  if (error) throw new Error("Error al obtener categorías: " + error.message)
  return data
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

  let query = supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("activo", true)

  if (categoria) {
    const { data: cat } = await supabase
      .from("categorias")
      .select("id")
      .eq("nombre", categoria)
      .single()
    if (cat) query = query.eq("categoria_id", cat.id)
  }

  if (q) query = query.ilike("nombre", `%${q}%`)

  if (orden === "precio_asc" || orden === "menor")
    query = query.order("precio", { ascending: true })
  else if (orden === "precio_desc" || orden === "mayor")
    query = query.order("precio", { ascending: false })
  else query = query.order("id")

  const { data, error } = await query
  if (error) throw new Error("Error al filtrar productos: " + error.message)
  return data.map(mapearProducto)
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

  const { data: cat } = await supabase
    .from("categorias")
    .select("id")
    .eq("nombre", producto.categoria)
    .single()

  if (!cat) return []

  const { data, error } = await supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("activo", true)
    .eq("categoria_id", cat.id)
    .neq("id", id)
    .limit(limite)

  if (error) return []
  return data.map(mapearProducto)
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

  let query = supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("activo", true)

  if (idsExcluir.length > 0) {
    query = query.not("id", "in", `(${idsExcluir.join(",")})`)
  }

  const { data, error } = await query.limit(limite)

  if (error) return []
  return data.map(mapearProducto)
}

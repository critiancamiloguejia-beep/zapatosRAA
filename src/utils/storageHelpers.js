import { supabase } from "../lib/supabaseClient"

// Solo URLs no vacías (null, undefined, "", espacios)
export function esUrlImagenValida(url) {
  return typeof url === "string" && url.trim().length > 0
}

// Obtiene la URL pública de una imagen en Supabase Storage.
// Uso: getImagenUrl('camiseta-basica.jpg')
// → https://xxx.supabase.co/storage/v1/object/public/productos/camiseta-basica.jpg
export function getImagenUrl(nombreArchivo) {
  if (!nombreArchivo) return null

  if (nombreArchivo.startsWith("http")) return nombreArchivo

  const { data } = supabase.storage
    .from("productos")
    .getPublicUrl(nombreArchivo)

  return data?.publicUrl || null
}

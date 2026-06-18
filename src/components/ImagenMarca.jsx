import { useState } from "react"

// Imagen de marca con fallback local si falla la URL de Supabase Storage
export default function ImagenMarca({
  src,
  fallback,
  alt,
  className = "",
  loading = "lazy",
}) {
  const [url, setUrl] = useState(src)

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => {
        if (fallback && url !== fallback) setUrl(fallback)
      }}
    />
  )
}

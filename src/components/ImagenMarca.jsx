import { useState, useEffect } from "react"

// Imagen de marca con fallback si falla la URL de Supabase Storage
export default function ImagenMarca({
  src,
  fallback,
  alt,
  className = "",
  loading = "lazy",
}) {
  const [url, setUrl] = useState(src)

  useEffect(() => {
    setUrl(src)
  }, [src, fallback])

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

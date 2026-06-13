import { useState } from "react"

// Muestra la foto real del producto o el emoji como fallback
export default function ProductImage({
  imagen,
  emoji,
  nombre,
  className = "",
}) {
  const [imgError, setImgError] = useState(false)

  if (imagen && !imgError) {
    return (
      <img
        src={imagen}
        alt={nombre}
        className={`h-full w-full object-cover ${className}`}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    )
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center text-6xl ${className}`}
    >
      {emoji}
    </div>
  )
}

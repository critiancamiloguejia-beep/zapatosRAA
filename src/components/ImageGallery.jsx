import { useState, useEffect } from "react"

// Galería de imágenes con miniaturas; fallback a emoji si no hay fotos
export default function ImageGallery({
  imagenes = [],
  emoji,
  nombre,
  className = "",
}) {
  const lista = imagenes.filter(Boolean)
  const [indice, setIndice] = useState(0)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setIndice(0)
    setImgError(false)
  }, [imagenes])

  const mostrarEmoji = lista.length === 0 || imgError
  const unaSola = lista.length === 1

  if (mostrarEmoji) {
    return (
      <div className="aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <div
          className={`flex h-full w-full items-center justify-center text-6xl ${className}`}
        >
          {emoji}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <img
          src={lista[indice]}
          alt={`${nombre} — imagen ${indice + 1}`}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
          loading={indice === 0 ? "eager" : "lazy"}
        />
      </div>

      {!unaSola && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {lista.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => {
                setIndice(i)
                setImgError(false)
              }}
              aria-label={`Ver imagen ${i + 1} de ${nombre}`}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                indice === i
                  ? "border-[#F97316] ring-2 ring-orange-200"
                  : "border-gray-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

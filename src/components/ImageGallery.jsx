import { useState, useEffect, useMemo } from "react"
import { esUrlImagenValida } from "../utils/storageHelpers"

function normalizarLista(imagenes) {
  const vistas = new Set()
  return (imagenes || [])
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter((url) => {
      if (!esUrlImagenValida(url) || vistas.has(url)) return false
      vistas.add(url)
      return true
    })
}

// Galería de imágenes con miniaturas; fallback a emoji si no hay fotos
export default function ImageGallery({
  imagenes = [],
  emoji,
  nombre,
  className = "",
}) {
  const lista = useMemo(() => normalizarLista(imagenes), [imagenes])
  const [indice, setIndice] = useState(0)
  const [fallidas, setFallidas] = useState(() => new Set())

  useEffect(() => {
    setIndice(0)
    setFallidas(new Set())
  }, [lista])

  const visibles = useMemo(
    () => lista.filter((url) => !fallidas.has(url)),
    [lista, fallidas]
  )

  const indiceSeguro = Math.min(indice, Math.max(0, visibles.length - 1))
  const urlActual = visibles[indiceSeguro]

  const marcarFallida = (url) => {
    setFallidas((prev) => new Set(prev).add(url))
    setIndice(0)
  }

  if (visibles.length === 0 || !urlActual) {
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

  const unaSola = visibles.length === 1

  return (
    <div className="w-full">
      <div className="aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <img
          key={urlActual}
          src={urlActual}
          alt={`${nombre} — imagen ${indiceSeguro + 1}`}
          className="h-full w-full object-cover"
          onError={() => marcarFallida(urlActual)}
          loading={indiceSeguro === 0 ? "eager" : "lazy"}
        />
      </div>

      {!unaSola && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {visibles.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Ver imagen ${i + 1} de ${nombre}`}
              aria-current={indiceSeguro === i ? "true" : undefined}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                indiceSeguro === i
                  ? "border-[#F97316] ring-2 ring-orange-200"
                  : "border-gray-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                onError={() => marcarFallida(url)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

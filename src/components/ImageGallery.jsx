import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { esUrlImagenValida } from "../utils/storageHelpers"
import { MAX_IMAGENES_PRODUCTO } from "../utils/constants"

function normalizarLista(imagenes) {
  const vistas = new Set()
  return (imagenes || [])
    .map((url) => (typeof url === "string" ? url.trim() : ""))
    .filter((url) => {
      if (!esUrlImagenValida(url) || vistas.has(url)) return false
      vistas.add(url)
      return true
    })
    .slice(0, MAX_IMAGENES_PRODUCTO)
}

// Galería con imagen principal, miniaturas y flechas anterior/siguiente
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
  const unaSola = visibles.length <= 1

  const marcarFallida = (url) => {
    setFallidas((prev) => new Set(prev).add(url))
    setIndice(0)
  }

  const irAnterior = () => {
    setIndice((i) => (i - 1 + visibles.length) % visibles.length)
  }

  const irSiguiente = () => {
    setIndice((i) => (i + 1) % visibles.length)
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

  return (
    <div className="w-full">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <img
          key={urlActual}
          src={urlActual}
          alt={`${nombre} — imagen ${indiceSeguro + 1}`}
          className="h-full w-full object-cover"
          onError={() => marcarFallida(urlActual)}
          loading={indiceSeguro === 0 ? "eager" : "lazy"}
        />

        {!unaSola && (
          <>
            <button
              type="button"
              onClick={irAnterior}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={irSiguiente}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
              {indiceSeguro + 1} / {visibles.length}
            </span>
          </>
        )}
      </div>

      {!unaSola && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {visibles.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Ver imagen ${i + 1} de ${nombre}`}
              aria-current={indiceSeguro === i ? "true" : undefined}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
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

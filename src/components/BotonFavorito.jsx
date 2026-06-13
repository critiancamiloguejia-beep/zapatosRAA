import { useFavoritos } from "../context/FavoritesContext"

// Botón de corazón reutilizable para marcar/desmarcar favoritos
export default function BotonFavorito({ productoId, className = "" }) {
  const { esFavorito, alternarFavorito } = useFavoritos()
  const activo = esFavorito(productoId)

  const manejarClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    alternarFavorito(productoId)
  }

  return (
    <button
      type="button"
      onClick={manejarClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-white ${className}`}
      aria-label={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <svg
        className={`h-4 w-4 transition-colors duration-200 ${
          activo ? "fill-[#F97316] text-[#F97316]" : "fill-none text-gray-600"
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}

import { Link } from "react-router-dom"
import { useFavoritos } from "../context/FavoritesContext"

// Ícono de favoritos con contador en el header
export default function FavoritesIcon() {
  const { totalFavoritos } = useFavoritos()

  return (
    <Link
      to="/favoritos"
      className="relative flex items-center justify-center rounded-full p-2 text-gray-800 transition-all duration-200 hover:bg-gray-100"
      aria-label={`Favoritos con ${totalFavoritos} productos`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
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

      {totalFavoritos > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F97316] text-[10px] font-bold text-white">
          {totalFavoritos > 99 ? "99+" : totalFavoritos}
        </span>
      )}
    </Link>
  )
}

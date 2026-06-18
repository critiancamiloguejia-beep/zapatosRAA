import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import CartIcon from "./CartIcon"
import FavoritesIcon from "./FavoritesIcon"
import BrandLogo from "./BrandLogo"
import { MARCA } from "../utils/brand"

export { NOMBRE_TIENDA } from "../utils/brand"
export const ALTURA_HEADER = "5rem"

// Buscador del header: redirige a /productos con query param q
function BuscadorHeader() {
  const [termino, setTermino] = useState("")
  const navigate = useNavigate()

  const manejarSubmit = (e) => {
    e.preventDefault()
    const q = termino.trim()
    if (q) {
      navigate(`/productos?q=${encodeURIComponent(q)}`)
    } else {
      navigate("/productos")
    }
  }

  return (
    <form onSubmit={manejarSubmit} className="flex items-center">
      <input
        type="search"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        placeholder="Buscar..."
        aria-label="Buscar productos"
        className="w-16 rounded-full border border-gray-200 px-2 py-1 text-xs transition-all duration-200 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-orange-200 sm:w-28 sm:px-3 sm:py-1.5 sm:text-sm"
      />
      <button
        type="submit"
        className="flex items-center justify-center rounded-full p-2 text-gray-800 transition-all duration-200 hover:bg-gray-100"
        aria-label="Buscar productos"
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  )
}

export default function Header({ sentinelRef }) {
  const [conSombra, setConSombra] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef?.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setConSombra(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sentinelRef])

  return (
    <div className="fixed top-0 z-50 w-full">
      <header
        className={`border-b border-gray-100 bg-white/95 backdrop-blur-sm transition-all duration-200 ${
          conSombra ? "shadow-md" : "shadow-none"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between pr-4 sm:pr-6 lg:pr-8">
          <Link
            to="/"
            className="flex shrink-0 items-center transition-opacity hover:opacity-80"
            aria-label={`${MARCA.nombre} — ${MARCA.eslogan}`}
          >
            <BrandLogo
              variant="horizontal"
              eager
              className="!h-12 !w-auto max-w-[11rem] object-contain sm:!h-14 sm:max-w-[13rem]"
            />
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 sm:block"
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 sm:block"
            >
              Productos
            </Link>
            <BuscadorHeader />
            <FavoritesIcon />
            <CartIcon />
          </nav>
        </div>
      </header>
    </div>
  )
}

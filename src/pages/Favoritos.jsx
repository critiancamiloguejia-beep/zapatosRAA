import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useFavoritos } from "../context/FavoritesContext"
import { obtenerProductosPorIds } from "../services/productService"
import ProductCard from "../components/ProductCard"

// Página de productos favoritos del usuario
export default function Favoritos() {
  const { ids } = useFavoritos()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [reintentar, setReintentar] = useState(0)

  // Resolver IDs de favoritos a productos reales vía productService
  useEffect(() => {
    if (!ids || ids.length === 0) {
      setProductos([])
      setCargando(false)
      setError(null)
      return
    }

    setCargando(true)
    setError(null)

    obtenerProductosPorIds(ids)
      .then((data) => {
        setProductos(data.filter(Boolean))
        setCargando(false)
      })
      .catch(() => {
        setError("No se pudieron cargar tus favoritos")
        setCargando(false)
      })
  }, [ids, reintentar])

  // Estado vacío (sin IDs guardados)
  if (!ids.length && !cargando) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <span className="mb-4 block text-6xl">❤️</span>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            No tienes favoritos aún
          </h1>
          <p className="mb-8 text-gray-500">
            Guarda los productos que te gusten tocando el corazón en cualquier
            tarjeta.
          </p>
          <Link
            to="/productos"
            className="inline-block rounded-xl bg-[#F97316] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="mb-6 text-lg text-red-600">{error}</p>
        <button
          onClick={() => setReintentar((n) => n + 1)}
          className="rounded-xl bg-[#F97316] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (cargando) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-gray-500">
          Cargando favoritos...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Mis favoritos
        </h1>
        <span className="text-sm text-gray-500">
          {productos.length} producto
          {productos.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  )
}

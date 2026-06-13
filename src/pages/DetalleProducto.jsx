import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  obtenerProductoPorId,
  obtenerProductosRelacionados,
} from "../services/productService"
import { formatearPrecio } from "../utils/formatters"
import { useCarrito } from "../context/CartContext"
import ProductCard from "../components/ProductCard"
import ProductImage from "../components/ProductImage"
import StarRating from "../components/StarRating"
import BotonFavorito from "../components/BotonFavorito"

// Página de detalle de un producto individual
export default function DetalleProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregarAlCarrito } = useCarrito()
  const [cantidad, setCantidad] = useState(1)
  const [producto, setProducto] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [reintentar, setReintentar] = useState(0)

  const stock = producto?.stock ?? 0
  const agotado = stock === 0

  // Cargar producto y relacionados cuando cambia el id de la URL
  useEffect(() => {
    setCargando(true)
    setError(null)
    setCantidad(1)

    obtenerProductoPorId(id)
      .then((data) => {
        if (!data) {
          navigate("/404")
          return null
        }
        setProducto(data)
        return obtenerProductosRelacionados(id, 4)
      })
      .then((rel) => {
        if (rel) setRelacionados(rel)
        setCargando(false)
      })
      .catch(() => {
        setError("No se pudo cargar el producto")
        setCargando(false)
      })
  }, [id, navigate, reintentar])

  const manejarAgregar = () => {
    if (!producto || agotado) return
    agregarAlCarrito(producto, cantidad)
    navigate("/carrito")
  }

  const manejarComprarAhora = () => {
    if (!producto || agotado) return
    agregarAlCarrito(producto, cantidad)
    navigate("/checkout")
  }

  if (cargando) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-gray-500">
          Cargando producto...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="mb-6 text-lg text-red-600">{error}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => setReintentar((n) => n + 1)}
            className="rounded-xl bg-[#F97316] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
          >
            Reintentar
          </button>
          <Link
            to="/productos"
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  if (!producto) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          <ProductImage
            imagen={producto.imagen}
            emoji={producto.emoji}
            nombre={producto.nombre}
            className="text-9xl"
          />
          {agotado ? (
            <span className="absolute left-4 top-4 rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
              Agotado
            </span>
          ) : (
            producto.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-[#F97316] px-3 py-1 text-xs font-semibold text-white">
                {producto.badge}
              </span>
            )
          )}
          <div className="absolute right-4 top-4">
            <BotonFavorito productoId={producto.id} className="h-10 w-10" />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            {producto.categoria}
          </span>
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            {producto.nombre}
          </h1>

          {producto.calificacion > 0 && (
            <div className="mb-4">
              <StarRating
                calificacion={producto.calificacion}
                reseñas={producto.reseñas}
                tamano="lg"
              />
            </div>
          )}

          <p className="mb-6 leading-relaxed text-gray-600">
            {producto.descripcion}
          </p>

          <div className="mb-4 flex items-baseline gap-3">
            {producto.precioAnterior && (
              <span className="text-lg text-gray-400 line-through">
                {formatearPrecio(producto.precioAnterior)}
              </span>
            )}
            <span className="text-3xl font-semibold text-[#F97316]">
              {formatearPrecio(producto.precio)}
            </span>
          </div>

          {!agotado && (
            <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
              <p className="text-sm font-semibold text-orange-800">
                ⚡ Solo quedan{" "}
                <span className="text-base font-bold">{stock}</span> en stock
              </p>
            </div>
          )}

          <p className="mb-6 text-sm text-gray-600">
            🔄 Devolución gratis en 30 días
          </p>

          <div className="mb-6">
            <label
              htmlFor="cantidad"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Cantidad
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                disabled={agotado}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-lg font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <input
                id="cantidad"
                type="number"
                min="1"
                max={stock || 1}
                value={cantidad}
                disabled={agotado}
                onChange={(e) =>
                  setCantidad(
                    Math.max(1, Math.min(stock || 1, Number(e.target.value)))
                  )
                }
                className="w-16 rounded-xl border border-gray-200 px-3 py-2 text-center text-sm focus:border-[#F97316] focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-40"
              />
              <button
                onClick={() => setCantidad((c) => Math.min(stock, c + 1))}
                disabled={agotado}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-lg font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={manejarAgregar}
              disabled={agotado}
              className="flex-1 rounded-xl bg-[#F97316] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {agotado ? "Producto agotado" : "Agregar al carrito"}
            </button>
            <button
              onClick={manejarComprarAhora}
              disabled={agotado}
              className="flex-1 rounded-xl border-2 border-[#F97316] px-6 py-3 text-sm font-semibold text-[#F97316] transition-all duration-200 hover:bg-[#F97316] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Comprar ahora
            </button>
          </div>
          <Link
            to="/productos"
            className="mt-3 block rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="mb-8 text-xl font-bold text-gray-900 sm:text-2xl">
            Clientes que vieron esto también vieron
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {relacionados.map((relacionado) => (
              <ProductCard key={relacionado.id} producto={relacionado} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

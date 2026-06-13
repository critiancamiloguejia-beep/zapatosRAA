import { Link, useNavigate } from "react-router-dom"
import { formatearPrecio } from "../utils/formatters"
import { useCarrito } from "../context/CartContext"
import StarRating from "./StarRating"
import BotonFavorito from "./BotonFavorito"
import ProductImage from "./ProductImage"

// Determinar estilo del badge según su tipo
function estiloBadge(badge) {
  if (badge === "Más vendido") {
    return "bg-gray-900 text-white"
  }
  if (badge === "Nuevo") {
    return "bg-emerald-500 text-white"
  }
  return "bg-[#F97316] text-white"
}

// Tarjeta de producto mejorada con badge, estrellas y precio tachado
export default function ProductCard({ producto }) {
  const navigate = useNavigate()
  const { agregarAlCarrito } = useCarrito()
  const agotado = producto.stock === 0

  const manejarAgregar = (e) => {
    e.preventDefault()
    agregarAlCarrito(producto)
  }

  const manejarComprarAhora = (e) => {
    e.preventDefault()
    e.stopPropagation()
    agregarAlCarrito(producto)
    navigate("/checkout")
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* Imagen del producto con badge */}
      <Link to={`/productos/${producto.id}`} className="relative block">
        <div className="aspect-square overflow-hidden bg-gray-50 transition-all duration-200 group-hover:bg-gray-100">
          <ProductImage
            imagen={producto.imagen}
            emoji={producto.emoji}
            nombre={producto.nombre}
          />
        </div>
        {producto.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${estiloBadge(producto.badge)}`}
          >
            {producto.badge}
          </span>
        )}
        <div className="absolute right-3 top-3">
          <BotonFavorito productoId={producto.id} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
          {producto.categoria}
        </span>

        <Link to={`/productos/${producto.id}`}>
          <h3 className="mb-1.5 line-clamp-2 text-sm font-bold text-gray-900 transition-all duration-200 hover:text-[#F97316] sm:text-base">
            {producto.nombre}
          </h3>
        </Link>

        {/* Estrellas y reseñas */}
        {producto.calificacion && (
          <div className="mb-2">
            <StarRating
              calificacion={producto.calificacion}
              reseñas={producto.reseñas}
            />
          </div>
        )}

        {/* Precio anterior tachado + precio actual */}
        <div className="mb-3 flex items-baseline gap-2">
          {producto.precioAnterior && (
            <span className="text-sm text-gray-400 line-through">
              {formatearPrecio(producto.precioAnterior)}
            </span>
          )}
          <span className="text-lg font-semibold text-[#F97316]">
            {formatearPrecio(producto.precio)}
          </span>
        </div>

        <button
          onClick={manejarAgregar}
          disabled={agotado}
          className="mt-auto w-full rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {agotado ? "Agotado" : "Agregar al carrito"}
        </button>
        <button
          onClick={manejarComprarAhora}
          disabled={agotado}
          className="mt-2 w-full rounded-lg border-2 border-[#F97316] px-4 py-2 text-sm font-semibold text-[#F97316] transition-all duration-200 hover:bg-[#F97316] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  )
}

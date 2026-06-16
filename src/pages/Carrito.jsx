import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useCarrito } from "../context/CartContext"
import { formatearPrecio } from "../utils/formatters"
import { obtenerProductosSugeridos } from "../services/productService"
import { ENVIO_GRATIS_MINIMO } from "../utils/constants"
import { calcularTotales } from "../utils/calcularTotales"
import ProductCard from "../components/ProductCard"
import ProductImage from "../components/ProductImage"
import { getImagenUrl } from "../utils/storageHelpers"

// Barra de progreso hacia envío gratis
function BarraEnvioGratis({ subtotal }) {
  const progreso = Math.min((subtotal / ENVIO_GRATIS_MINIMO) * 100, 100)
  const faltante = Math.max(ENVIO_GRATIS_MINIMO - subtotal, 0)
  const envioGratis = subtotal >= ENVIO_GRATIS_MINIMO

  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {envioGratis ? (
        <p className="text-sm font-semibold text-emerald-600">
          🎉 ¡Felicitaciones! Tienes envío gratis
        </p>
      ) : (
        <p className="mb-2 text-sm text-gray-700">
          Te faltan{" "}
          <span className="font-semibold text-[#F97316]">
            {formatearPrecio(faltante)}
          </span>{" "}
          para envío gratis
        </p>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#F97316] transition-all duration-500"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  )
}

// Página del carrito de compras
export default function Carrito() {
  const {
    items,
    agregarAlCarrito,
    quitarDelCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    totalPrecio,
  } = useCarrito()

  const [sugeridos, setSugeridos] = useState([])
  const [cargandoSugeridos, setCargandoSugeridos] = useState(false)

  const totales = calcularTotales(totalPrecio)

  // Cargar sugerencias de productos de forma async
  useEffect(() => {
    const idsEnCarrito = items.map((i) => i.id)
    if (idsEnCarrito.length === 0) return

    setCargandoSugeridos(true)
    obtenerProductosSugeridos(idsEnCarrito, 3)
      .then((data) => {
        setSugeridos(data)
        setCargandoSugeridos(false)
      })
      .catch(() => setCargandoSugeridos(false))
  }, [items])

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <span className="mb-4 block text-6xl">🛒</span>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Tu carrito está vacío
          </h1>
          <p className="mb-8 text-gray-500">
            Agrega productos desde el catálogo para comenzar tu compra.
          </p>
          <Link
            to="/productos"
            className="inline-block rounded-xl bg-[#F97316] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
          >
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Carrito de compras
        </h1>
        <button
          onClick={vaciarCarrito}
          className="text-sm font-medium text-red-600 transition-all duration-200 hover:text-red-700"
        >
          Vaciar carrito
        </button>
      </div>

      <BarraEnvioGratis subtotal={totales.subtotal} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white shadow-sm">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  <ProductImage
                    imagen={getImagenUrl(item.imagen) || item.imagen}
                    emoji={item.emoji}
                    nombre={item.nombre}
                    className="text-3xl"
                  />
                </div>

                <div className="flex-1">
                  <Link
                    to={`/productos/${item.id}`}
                    className="font-semibold text-gray-900 transition-all duration-200 hover:text-[#F97316]"
                  >
                    {item.nombre}
                  </Link>
                  <p className="text-sm text-gray-500">{item.categoria}</p>
                  <p className="mt-1 font-semibold text-[#F97316]">
                    {formatearPrecio(item.precio)} c/u
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => quitarDelCarrito(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm transition-all duration-200 hover:bg-gray-50"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => agregarAlCarrito(item, 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm transition-all duration-200 hover:bg-gray-50"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold text-gray-900">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </p>
                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="text-xs font-medium text-red-500 transition-all duration-200 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-fit rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Resumen</h2>
          <div className="mb-4 flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold">
              {formatearPrecio(totales.subtotal)}
            </span>
          </div>
          <div className="mb-4 flex justify-between text-sm text-gray-600">
            <span>Envío</span>
            <span className="font-semibold">
              {totales.envioGratis
                ? "Gratis"
                : formatearPrecio(totales.costoEnvio)}
            </span>
          </div>
          <div className="mb-6 flex justify-between border-t border-gray-100 pt-4 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatearPrecio(totales.total)}</span>
          </div>

          <div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            Compra segura 🔒
          </div>

          <Link
            to="/checkout"
            className="block w-full rounded-xl bg-[#F97316] px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
          >
            Proceder al pago
          </Link>
        </div>
      </div>

      {(cargandoSugeridos || sugeridos.length > 0) && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            También te puede interesar
          </h2>
          {cargandoSugeridos ? (
            <p className="text-sm text-gray-500">Cargando sugerencias...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {sugeridos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

import { useState, useEffect } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { obtenerProductoPorId } from "../services/productService"
import { construirGaleria } from "../services/productMapper"
import { formatearPrecio } from "../utils/formatters"
import { colorAHex } from "../utils/colorHelpers"
import { urlWhatsApp, mensajePedidoProducto } from "../utils/whatsapp"
import BrandLogo from "../components/BrandLogo"
import ImageGallery from "../components/ImageGallery"
import { MARCA } from "../utils/brand"

// Landing page independiente para un producto (campañas / ofertas)
export default function LandingProducto() {
  const { id: idRuta } = useParams()
  const [searchParams] = useSearchParams()
  const idProducto = idRuta || searchParams.get("producto")

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [talla, setTalla] = useState(null)
  const [color, setColor] = useState(null)

  useEffect(() => {
    if (!idProducto) {
      setError("No se especificó un producto. Usa /ofertas/1 o /ofertas?producto=1")
      setCargando(false)
      return
    }

    setCargando(true)
    setError(null)

    obtenerProductoPorId(idProducto)
      .then((data) => {
        if (!data) {
          setError("Producto no encontrado")
          setProducto(null)
        } else {
          setProducto(data)
          setTalla(data.tallas?.[0] ?? null)
          setColor(data.colores?.[0] ?? null)
        }
        setCargando(false)
      })
      .catch(() => {
        setError("No se pudo cargar el producto")
        setCargando(false)
      })
  }, [idProducto])

  const urlPedido = producto
    ? urlWhatsApp(
        mensajePedidoProducto(producto.nombre, { talla, color })
      )
    : "#"

  const tallasDisponibles = producto?.tallas ?? []
  const coloresDisponibles = producto?.colores ?? []
  const subtitulo = producto
    ? [producto.marca, producto.categoria, producto.genero]
        .filter(Boolean)
        .join(" · ")
    : ""

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
      {/* Header independiente — logo lleva al Home */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="transition-opacity hover:opacity-80"
            aria-label={`${MARCA.nombre} — Ir al inicio`}
          >
            <BrandLogo variant="horizontal" className="!h-10 !w-auto" />
          </Link>
          <Link
            to="/productos"
            className="text-sm font-medium text-gray-600 transition hover:text-[#F97316]"
          >
            Ver catálogo
          </Link>
        </div>
      </header>

      {cargando && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm font-medium text-gray-500">Cargando oferta...</p>
        </div>
      )}

      {!cargando && error && (
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <p className="mb-6 text-lg text-red-600">{error}</p>
          <Link
            to="/"
            className="inline-block rounded-xl bg-[#F97316] px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Volver al inicio
          </Link>
        </div>
      )}

      {!cargando && producto && (
        <>
          {/* Banner — solo imagen, sin texto encima */}
          <section className="bg-gray-50">
            <div className="mx-auto max-w-6xl">
              {producto.imagen ? (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="mx-auto h-[280px] w-full object-contain object-center sm:h-[360px] md:h-[420px]"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-gray-100 text-8xl">
                  {producto.emoji}
                </div>
              )}
            </div>
          </section>

          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            {/* Recuadro blanco unificado */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-lg sm:p-8">
              <h1 className="text-2xl font-extrabold text-black sm:text-3xl md:text-4xl">
                {producto.nombre}
              </h1>
              {subtitulo && (
                <p className="mt-2 text-sm font-medium text-gray-600">
                  {subtitulo}
                </p>
              )}
              <p className="mt-3 text-3xl font-bold text-black">
                {formatearPrecio(producto.precio)}
              </p>

              {/* Tallas */}
              <div className="mt-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Tallas
                </h2>
                {tallasDisponibles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tallasDisponibles.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTalla(t)}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
                          talla === t
                            ? "border-black bg-black text-white"
                            : "border-gray-300 text-black hover:border-gray-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin tallas disponibles</p>
                )}
              </div>

              {/* Colores */}
              <div className="mt-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Colores
                </h2>
                {coloresDisponibles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {coloresDisponibles.map((nombreColor) => {
                      const hex = colorAHex(nombreColor)
                      const seleccionado = color === nombreColor

                      if (hex) {
                        return (
                          <button
                            key={nombreColor}
                            type="button"
                            onClick={() => setColor(nombreColor)}
                            title={nombreColor}
                            aria-label={`Color ${nombreColor}`}
                            className={`h-9 w-9 rounded-full border-2 transition ${
                              seleccionado
                                ? "border-black ring-2 ring-gray-300"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: hex }}
                          />
                        )
                      }

                      return (
                        <button
                          key={nombreColor}
                          type="button"
                          onClick={() => setColor(nombreColor)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                            seleccionado
                              ? "border-black bg-black text-white"
                              : "border-gray-300 text-black hover:border-gray-400"
                          }`}
                        >
                          {nombreColor}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin colores disponibles</p>
                )}
              </div>

              {/* Galería */}
              {construirGaleria(producto).length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Galería
                  </h2>
                  <ImageGallery
                    imagenes={construirGaleria(producto)}
                    emoji={producto.emoji}
                    nombre={producto.nombre}
                  />
                </div>
              )}

              {/* Botones */}
              <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-8 sm:flex-row">
                <a
                  href={urlPedido}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-[#20bd5a]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Hacer pedido
                </a>
                <Link
                  to={`/productos/${producto.id}`}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-black px-6 py-3.5 text-base font-semibold text-black transition hover:bg-gray-50"
                >
                  Ver en la tienda
                </Link>
              </div>
            </div>

            {/* Descripción debajo del recuadro */}
            {producto.descripcion && (
              <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-3 text-lg font-bold text-black">Descripción</h2>
                <p className="text-base leading-relaxed text-gray-700">
                  {producto.descripcion}
                </p>
              </section>
            )}
          </div>

          <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-500">
            <Link to="/" className="font-medium text-black hover:underline">
              {MARCA.nombre}
            </Link>
            <span className="mx-2">·</span>
            <span>{MARCA.eslogan}</span>
          </footer>
        </>
      )}
    </div>
  )
}

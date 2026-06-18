import { useState, useEffect } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { obtenerProductoPorId } from "../services/productService"
import { construirGaleria } from "../services/productMapper"
import { formatearPrecio } from "../utils/formatters"
import { mensajePedidoProducto } from "../utils/whatsapp"
import { MARCA, IMAGENES_LANDING } from "../utils/brand"
import ImagenMarca from "../components/ImagenMarca"
import ImageGallery from "../components/ImageGallery"
import ColorSelector from "../components/ColorSelector"
import BotonWhatsAppFlotante from "../components/BotonWhatsAppFlotante"
import ModalPedidoLanding from "../components/ModalPedidoLanding"

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
  const [cantidad, setCantidad] = useState(1)
  const [modalPedidoAbierto, setModalPedidoAbierto] = useState(false)

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
          setCantidad(1)
        }
        setCargando(false)
      })
      .catch(() => {
        setError("No se pudo cargar el producto")
        setCargando(false)
      })
  }, [idProducto])

  const mensajeWhatsApp = producto
    ? mensajePedidoProducto(producto.nombre, { talla, color })
    : ""

  const tallasDisponibles = producto?.tallas ?? []
  const coloresDisponibles = producto?.colores ?? []
  const subtitulo = producto
    ? [producto.marca, producto.categoria, producto.genero]
        .filter(Boolean)
        .join(" · ")
    : ""

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
      {/* Logo de marca — ancho completo, altura compacta, sin deformar */}
      <header className="relative border-b border-gray-900/10 bg-gray-950">
        <Link
          to="/"
          className="block w-full"
          aria-label={`${MARCA.nombre} — Ir al inicio`}
        >
          <ImagenMarca
            src={IMAGENES_LANDING.logo}
            fallback={IMAGENES_LANDING.logoFallback}
            alt={MARCA.nombre}
            className="h-14 w-full object-cover object-center sm:h-16"
            loading="eager"
          />
        </Link>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-4">
          <Link
            to="/productos"
            className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/80 sm:text-sm"
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
          {/* Banner de marca — fallback: imagen principal del producto */}
          <section className="w-full bg-gray-950">
            <ImagenMarca
              src="https://eogphstlsslxbpkxrjhk.supabase.co/storage/v1/object/public/productos/logo-marca.jpg"
              fallback={
                producto.imagen ||
                construirGaleria(producto)[0] ||
                IMAGENES_LANDING.logoFallback
              }
              alt={`${MARCA.nombre} — banner`}
              className="h-28 w-full object-cover object-center sm:h-32 md:h-36"
            />
          </section>

          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
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

              <div className="mt-6">
                <ColorSelector
                  colores={coloresDisponibles}
                  colorSeleccionado={color}
                  onSeleccionar={setColor}
                  label="Color:"
                  id="color-landing"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="cantidad-landing"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Cantidad
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-lg font-medium hover:bg-gray-50"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span
                    id="cantidad-landing"
                    className="min-w-[2rem] text-center text-lg font-semibold"
                  >
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => c + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-lg font-medium hover:bg-gray-50"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

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

              <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-8 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalPedidoAbierto(true)}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#F97316] px-6 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-orange-600"
                >
                  Realizar pedido
                </button>
                <Link
                  to={`/productos/${producto.id}`}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-black px-6 py-3.5 text-base font-semibold text-black transition hover:bg-gray-50"
                >
                  Ver en la tienda
                </Link>
              </div>
            </div>

            {producto.descripcion && (
              <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-3 text-lg font-bold text-black">Descripción</h2>
                <p className="text-base leading-relaxed text-gray-700">
                  {producto.descripcion}
                </p>
              </section>
            )}
          </div>

          <footer className="border-t border-gray-100 py-6 pb-24 text-center text-sm text-gray-500">
            <Link to="/" className="font-medium text-black hover:underline">
              {MARCA.nombre}
            </Link>
            <span className="mx-2">·</span>
            <span>{MARCA.eslogan}</span>
          </footer>

          <BotonWhatsAppFlotante mensaje={mensajeWhatsApp} />

          <ModalPedidoLanding
            abierto={modalPedidoAbierto}
            onCerrar={() => setModalPedidoAbierto(false)}
            producto={producto}
            talla={talla}
            color={color}
            cantidad={cantidad}
          />
        </>
      )}
    </div>
  )
}

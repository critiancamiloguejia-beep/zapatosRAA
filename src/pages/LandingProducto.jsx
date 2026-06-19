import { useState, useEffect } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { obtenerProductoPorId } from "../services/productService"
import { construirGaleria } from "../services/productMapper"
import { formatearPrecio } from "../utils/formatters"
import { abrirWhatsApp, mensajePedidoProducto } from "../utils/whatsapp"
import { MARCA, IMAGENES_LANDING } from "../utils/brand"
import ImagenMarca from "../components/ImagenMarca"
import ImageGallery from "../components/ImageGallery"
import ColorSelector from "../components/ColorSelector"
import BotonWhatsAppFlotante from "../components/BotonWhatsAppFlotante"
import ModalPedidoLanding from "../components/ModalPedidoLanding"
import {
  LandingBadgesConfianza,
  LandingGarantias,
  LandingFAQ,
  LandingFooter,
  IconoWhatsApp,
} from "../components/landing/LandingSecciones"

// Landing de conversión para tráfico de Facebook / Instagram
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
  const galeria = producto ? construirGaleria(producto) : []
  const imagenPrincipal = galeria[0] || producto?.imagen

  const subtitulo = producto
    ? [producto.marca, producto.categoria, producto.genero]
        .filter(Boolean)
        .join(" · ")
    : ""

  const pedirWhatsApp = () => {
    if (mensajeWhatsApp) abrirWhatsApp(mensajeWhatsApp)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 antialiased">
      {/* Encabezado compacto */}
      <header className="relative h-11 overflow-hidden bg-neutral-950 sm:h-12">
        <Link
          to="/"
          className="block h-full w-full"
          aria-label={`${MARCA.nombre} — Ir al inicio`}
        >
          <ImagenMarca
            src="https://eogphstlsslxbpkxrjhk.supabase.co/storage/v1/object/public/productos/banner-nuevo.jpg"
            fallback={IMAGENES_LANDING.logoFallback}
            alt={MARCA.nombre}
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
        </Link>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Link
            to="/productos"
            className="rounded-md bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:text-xs"
          >
            Catálogo
          </Link>
        </div>
      </header>

      {cargando && (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm font-medium text-gray-500">Cargando oferta...</p>
        </div>
      )}

      {!cargando && error && (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="mb-4 text-base text-red-600">{error}</p>
          <Link
            to="/"
            className="inline-block rounded-xl bg-[#F97316] px-6 py-3 text-sm font-semibold text-white"
          >
            Volver al inicio
          </Link>
        </div>
      )}

      {!cargando && producto && (
        <>
          <main className="mx-auto max-w-lg px-4 pb-4 pt-3">
            {/* Hero: foto visible sin scroll excesivo */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {imagenPrincipal ? (
                <div className="flex min-h-[400px] items-center justify-center bg-gray-50 px-4 py-4 sm:min-h-[500px]">
                  <img
                    src={imagenPrincipal}
                    alt={producto.nombre}
                    className="h-[400px] w-[70%] max-w-full object-contain sm:h-[500px]"
                    loading="eager"
                  />
                </div>
              ) : (
                <div className="flex h-[400px] items-center justify-center bg-gray-50 text-6xl sm:h-[500px]">
                  {producto.emoji}
                </div>
              )}

              <div className="border-t border-gray-100 p-4">
                <h1 className="text-xl font-extrabold leading-tight text-gray-900 sm:text-2xl">
                  {producto.nombre}
                </h1>
                {subtitulo && (
                  <p className="mt-1 text-xs font-medium text-gray-500">
                    {subtitulo}
                  </p>
                )}

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatearPrecio(producto.precio)}
                </p>

                <LandingBadgesConfianza />

                {/* Selectores compactos */}
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Talla
                    </p>
                    {tallasDisponibles.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {tallasDisponibles.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTalla(t)}
                            className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-sm font-medium transition ${
                              talla === t
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Sin tallas</p>
                    )}
                  </div>

                  <ColorSelector
                    colores={coloresDisponibles}
                    colorSeleccionado={color}
                    onSeleccionar={setColor}
                    label="Color:"
                    id="color-landing"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Cantidad
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-base font-medium"
                        aria-label="Disminuir"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center font-semibold">
                        {cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCantidad((c) => c + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-base font-medium"
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* CTAs — WhatsApp protagonista */}
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={pedirWhatsApp}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-green-200/60 transition hover:bg-[#20bd5a] active:scale-[0.99]"
                  >
                    <IconoWhatsApp className="h-6 w-6" />
                    Pedir por WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalPedidoAbierto(true)}
                    className="w-full rounded-xl border-2 border-gray-900 bg-white px-4 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-50"
                  >
                    Realizar pedido
                  </button>
                </div>
              </div>
            </div>

            <LandingGarantias />

            {/* Galería adicional */}
            {galeria.length > 0 && (
              <section className="mt-6">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                  Fotos del producto
                </h2>
                <ImageGallery
                  imagenes={galeria}
                  emoji={producto.emoji}
                  nombre={producto.nombre}
                />
              </section>
            )}

            {producto.descripcion && (
              <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-2 text-sm font-bold text-gray-900">
                  Descripción
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  {producto.descripcion}
                </p>
              </section>
            )}

            <LandingFAQ />

            <p className="mt-6 text-center">
              <Link
                to={`/productos/${producto.id}`}
                className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline"
              >
                Ver ficha completa en la tienda
              </Link>
            </p>
          </main>

          <LandingFooter />

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

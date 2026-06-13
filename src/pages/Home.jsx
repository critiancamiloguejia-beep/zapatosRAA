import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  obtenerProductosDestacados,
  obtenerCategorias,
} from "../services/productService"
import ProductCard from "../components/ProductCard"
import CountdownTimer from "../components/CountdownTimer"
import { NOMBRE_TIENDA } from "../components/Header"

const BARRA_CONFIANZA = [
  { icono: "🚚", titulo: "Envío rápido", desc: "2-5 días hábiles" },
  { icono: "🔒", titulo: "Pago seguro", desc: "Transacciones protegidas" },
  { icono: "🔄", titulo: "Devolución fácil", desc: "30 días sin complicaciones" },
  { icono: "💬", titulo: "Soporte 24/7", desc: "Siempre disponibles" },
]

const POR_QUE_COMPRAR = [
  {
    icono: "✨",
    titulo: "Calidad garantizada",
    descripcion:
      "Seleccionamos cada producto con los más altos estándares de calidad para ti.",
  },
  {
    icono: "💰",
    titulo: "Mejores precios",
    descripcion:
      "Ofertas exclusivas y precios competitivos que no encontrarás en otro lugar.",
  },
  {
    icono: "🎯",
    titulo: "Envío a todo Colombia",
    descripcion:
      "Llevamos tus pedidos a cualquier ciudad del país de forma rápida y segura.",
  },
]

const RESEÑAS = [
  {
    nombre: "María González",
    ciudad: "Bogotá",
    estrellas: 5,
    comentario:
      "Excelente calidad en los productos. El envío llegó antes de lo esperado. ¡Totalmente recomendado!",
  },
  {
    nombre: "Carlos Ruiz",
    ciudad: "Medellín",
    estrellas: 5,
    comentario:
      "La mejor tienda online que he usado. Precios justos y atención al cliente de primera.",
  },
  {
    nombre: "Laura Martínez",
    ciudad: "Cali",
    estrellas: 4,
    comentario:
      "Muy buena experiencia de compra. Los productos coinciden con las fotos y descripciones.",
  },
]

// Placeholders de carga para mantener el layout
function SkeletonTarjeta() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-4">
      <div className="mb-4 h-44 rounded-lg bg-gray-100 sm:h-48" />
      <div className="mb-2 h-3 w-16 rounded bg-gray-100" />
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
      <div className="h-5 w-20 rounded bg-gray-100" />
    </div>
  )
}

function SkeletonCategoria() {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <div className="h-20 w-20 animate-pulse rounded-full bg-gray-100 sm:h-24 sm:w-24" />
      <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
    </div>
  )
}

// Página principal con datos cargados desde productService
export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([obtenerProductosDestacados(6), obtenerCategorias()])
      .then(([prods, cats]) => {
        setDestacados(prods)
        setCategorias(cats)
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  return (
    <div>
      <section className="relative flex min-h-[520px] items-center overflow-hidden sm:min-h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(249,115,22,0.15),transparent_50%)]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-6 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              ⭐ +500 clientes satisfechos
            </span>

            <h1 className="mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Estilo que define tu día a día
            </h1>
            <p className="mb-8 text-lg text-gray-200 sm:text-xl">
              Descubre la colección más vendida de {NOMBRE_TIENDA}. Moda,
              calzado y accesorios con envío a todo Colombia.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/productos"
                className="rounded-xl bg-[#F97316] px-8 py-3.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600 sm:text-base"
              >
                Ver ofertas
              </Link>
              <Link
                to="/productos"
                className="rounded-xl border-2 border-white px-8 py-3.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 sm:text-base"
              >
                Explorar catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-6 sm:px-6 lg:px-8">
          {BARRA_CONFIANZA.map((item) => (
            <div
              key={item.titulo}
              className="flex flex-col items-center text-center sm:flex-row sm:gap-3 sm:text-left"
            >
              <span className="mb-1 text-2xl sm:mb-0 sm:text-3xl">{item.icono}</span>
              <div>
                <p className="text-xs font-bold text-gray-900 sm:text-sm">
                  {item.titulo}
                </p>
                <p className="hidden text-xs text-gray-500 sm:block">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
          Explora por categoría
        </h2>
        <div className="scrollbar-hide flex gap-5 overflow-x-auto pb-2 sm:justify-center sm:gap-8">
          {cargando
            ? Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCategoria key={i} />
              ))
            : categorias.map((cat) => (
                <Link
                  key={cat.nombre}
                  to={`/productos?categoria=${encodeURIComponent(cat.nombre)}`}
                  className="flex shrink-0 flex-col items-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl transition-all duration-200 hover:bg-orange-50 sm:h-24 sm:w-24 sm:text-4xl">
                    {cat.emoji || "🛍️"}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {cat.nombre}
                  </span>
                </Link>
              ))}
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              🔥 Los más vendidos
            </h2>
            <Link
              to="/productos"
              className="text-sm font-semibold text-[#F97316] transition-all duration-200 hover:text-orange-600"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {cargando
              ? Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonTarjeta key={i} />
                ))
              : destacados.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
          </div>
        </div>
      </section>

      <section className="mx-4 my-12 overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 via-[#F97316] to-red-500 sm:mx-6 lg:mx-auto lg:max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row sm:px-10 lg:px-14">
          <div className="text-center sm:text-left">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-orange-100">
              Oferta limitada
            </p>
            <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
              ¡Hasta 30% de descuento!
            </h2>
            <p className="text-sm text-orange-100 sm:text-base">
              Aprovecha precios especiales antes de que termine el tiempo
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-orange-100">
              Termina en
            </p>
            <CountdownTimer />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-xl font-bold text-gray-900 sm:text-2xl">
          ¿Por qué comprarnos?
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {POR_QUE_COMPRAR.map((bloque) => (
            <div
              key={bloque.titulo}
              className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <span className="mb-4 block text-4xl">{bloque.icono}</span>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                {bloque.titulo}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {bloque.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {RESEÑAS.map((reseña) => (
              <div
                key={reseña.nombre}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < reseña.estrellas ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  "{reseña.comentario}"
                </p>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {reseña.nombre}
                  </p>
                  <p className="text-xs text-gray-500">{reseña.ciudad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

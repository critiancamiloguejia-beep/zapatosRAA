import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Star,
  Truck,
  Wallet,
  RefreshCw,
  ShieldCheck,
  Headphones,
  ChevronRight,
} from "lucide-react"
import {
  obtenerProductosDestacados,
  obtenerCategorias,
} from "../services/productService"
import ProductCard from "../components/ProductCard"
import BrandLogo from "../components/BrandLogo"
import { CLASES_HOME_PRINCIPAL } from "../utils/brand"

const HERO_IMAGENES = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1400&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=80",
]

const IMAGENES_CATEGORIA = {
  Accesorios:
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  Calzado:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  Deportes:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  Electrónica:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
  Hogar:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  Ropa: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
}

function imagenCategoria(nombre) {
  return (
    IMAGENES_CATEGORIA[nombre] ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80"
  )
}

const TRUST = [
  { icon: Truck, titulo: "Envío rápido", desc: "3-5 días hábiles" },
  { icon: Wallet, titulo: "Paga al recibir", desc: "Sin tarjeta necesaria" },
  { icon: RefreshCw, titulo: "Devolución fácil", desc: "30 días sin preguntas" },
  { icon: Headphones, titulo: "Soporte 24/7", desc: "Siempre disponibles" },
]

const RAZONES = [
  {
    icon: Wallet,
    titulo: "Paga al recibir",
    desc: "Compra sin tarjeta y paga en efectivo cuando recibas tu pedido.",
  },
  {
    icon: Truck,
    titulo: "Envío a todo el país",
    desc: "Entregas rápidas de 2 a 5 días hábiles, sin importar dónde estés.",
  },
  {
    icon: ShieldCheck,
    titulo: "Compra protegida",
    desc: "Devoluciones fáciles dentro de 30 días, sin preguntas complicadas.",
  },
]

const PASOS_COMPRA = [
  {
    numero: 1,
    emoji: "🛍️",
    titulo: "Elige tu producto",
    desc: "Explora nuestro catálogo y encuentra lo que necesitas",
  },
  {
    numero: 2,
    emoji: "📋",
    titulo: "Haz tu pedido",
    desc: "Llena tus datos de envío, es rápido y sencillo",
  },
  {
    numero: 3,
    emoji: "📦",
    titulo: "Recibe y paga",
    desc: "Tu pedido llega a tu puerta y pagas en efectivo al recibirlo",
  },
]

const RESENAS = [
  {
    nombre: "María González",
    texto:
      "Pedí unos audífonos y llegaron en 3 días. La calidad es increíble y pagué al recibir. ¡Súper recomendado!",
    rating: 5,
    inicial: "M",
  },
  {
    nombre: "Carlos Ramírez",
    texto:
      "Excelente servicio. Tuve una duda y el soporte me respondió enseguida. La cafetera funciona perfecto.",
    rating: 5,
    inicial: "C",
  },
  {
    nombre: "Laura Martínez",
    texto:
      "Me encantó poder pagar contraentrega. El reloj inteligente superó mis expectativas por el precio.",
    rating: 4,
    inicial: "L",
  },
]

function SkeletonCategoria() {
  return (
    <div className="aspect-[4/5] animate-pulse overflow-hidden rounded-2xl bg-gray-200" />
  )
}

function SkeletonProducto() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="aspect-square bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 rounded bg-gray-100" />
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-5 w-24 rounded bg-gray-100" />
        <div className="h-10 rounded-full bg-gray-100" />
      </div>
    </div>
  )
}

function HeroCarrusel() {
  const [actual, setActual] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActual((i) => (i + 1) % HERO_IMAGENES.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-[480px] overflow-hidden md:min-h-[560px]">
      {HERO_IMAGENES.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === actual ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== actual}
        >
          <img
            src={url}
            alt=""
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      <div className="relative mx-auto flex min-h-[480px] max-w-7xl flex-col items-start justify-center px-4 py-16 md:min-h-[560px] md:py-24">
        <span className="rounded-full bg-orange-500/20 px-4 py-1 text-sm font-semibold text-orange-300">
          Temporada de ofertas
        </span>
        <h1 className="mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Todo lo que buscas, al mejor precio
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-lg text-gray-300">
          Miles de productos con envío rápido a todo el país. Compra hoy y{" "}
          <span className="font-semibold text-white">paga cuando recibas</span>.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/productos"
            className="rounded-full bg-orange-500 px-7 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
          >
            Ver ofertas
          </Link>
          <a
            href="#categorias"
            className="rounded-full border border-white/30 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Explorar categorías
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {HERO_IMAGENES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActual(i)}
            aria-label={`Ir a imagen ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === actual ? "bg-white" : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

// Página principal con datos cargados desde productService
export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState("Todos")

  useEffect(() => {
    Promise.all([obtenerProductosDestacados(6), obtenerCategorias()])
      .then(([prods, cats]) => {
        setDestacados(prods)
        setCategorias(cats)
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  const tabs = ["Todos", ...categorias.map((c) => c.nombre)]

  const productosFiltrados =
    filtro === "Todos"
      ? destacados
      : destacados.filter((p) => p.categoria === filtro)

  return (
    <div className="bg-white font-sans text-gray-900 antialiased">
      <HeroCarrusel />

      {/* Marca principal */}
      <section className="border-b border-gray-100 bg-white py-10 md:py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4">
          <BrandLogo variant="principal" className={CLASES_HOME_PRINCIPAL} />
        </div>
      </section>

      {/* Barra de confianza */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-8 md:grid-cols-4 md:divide-x md:divide-gray-200">
          {TRUST.map(({ icon: Icon, titulo, desc }) => (
            <div
              key={titulo}
              className="flex flex-col items-center gap-2 px-4 text-center md:flex-row md:gap-3 md:text-left"
            >
              <Icon className="h-7 w-7 shrink-0 text-orange-500" />
              <div>
                <p className="text-sm font-bold">{titulo}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner paga al recibir */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-orange-200 bg-[#FFF7ED] p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          <div className="hidden shrink-0 lg:block">
            <BrandLogo variant="horizontal" className="!h-12 !w-auto" />
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-100 lg:hidden">
            <Wallet className="h-9 w-9 text-orange-500" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              ¿Sin tarjeta? No hay problema
            </h2>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Compra hoy y paga en efectivo cuando tu pedido llegue a tu puerta.
              Así de fácil.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
            ✓ 100% seguro
          </span>
        </div>
      </section>

      {/* Categorías */}
      <section id="categorias" className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Explora por categoría
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {cargando
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCategoria key={i} />
              ))
            : categorias.map((cat) => (
                <Link
                  key={cat.nombre}
                  to={`/productos?categoria=${encodeURIComponent(cat.nombre)}`}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl transition hover:scale-105"
                >
                  <img
                    src={imagenCategoria(cat.nombre)}
                    alt={cat.nombre}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="absolute bottom-0 left-0 right-0 p-4 text-center text-sm font-bold text-white">
                    {cat.nombre}
                  </span>
                </Link>
              ))}
        </div>
      </section>

      {/* ¿Cómo funciona? */}
      <section className="bg-[#F9FAFB]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            ¿Cómo comprar en RAA?
          </h2>
          <div className="mt-10 flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-6">
            {PASOS_COMPRA.map((paso, i) => (
              <div key={paso.numero} className="flex items-center gap-6">
                <div className="flex w-64 flex-col items-center text-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                    {paso.numero}
                  </span>
                  <span className="mt-4 text-4xl">{paso.emoji}</span>
                  <h3 className="mt-3 text-base font-bold text-gray-900">
                    {paso.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{paso.desc}</p>
                </div>
                {i < PASOS_COMPRA.length - 1 && (
                  <span
                    className="hidden shrink-0 text-2xl text-orange-400 md:inline"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Más vendidos */}
      <section id="productos" className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="flex flex-col items-center">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              Los más vendidos
            </h2>
            <p className="mt-2 text-center text-gray-500">
              Productos favoritos de nuestros clientes
            </p>

            {!cargando && tabs.length > 1 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFiltro(t)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      filtro === t
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cargando
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonProducto key={i} />
                ))
              : productosFiltrados.length > 0
                ? productosFiltrados.map((producto) => (
                    <ProductCard key={producto.id} producto={producto} />
                  ))
                : (
                    <p className="col-span-full py-8 text-center text-gray-500">
                      No hay productos en esta categoría.
                    </p>
                  )}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/productos"
              className="inline-flex items-center gap-1 rounded-full border-2 border-orange-500 px-6 py-2.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
            >
              Ver todos los productos
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner categoría destacada */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="relative h-[250px] overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <h2 className="text-2xl font-extrabold md:text-4xl">
              Descubre nuestra colección de Moda
            </h2>
            <p className="mt-2 max-w-lg text-sm text-gray-200 md:text-base">
              Ropa y accesorios para cada ocasión
            </p>
            <Link
              to="/productos?categoria=Ropa"
              className="mt-6 inline-flex items-center gap-1 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Ver productos →
            </Link>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            ¿Por qué elegir RAA?
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {RAZONES.map(({ icon: Icon, titulo, desc }) => (
              <div
                key={titulo}
                className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm transition hover:shadow-lg"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                  <Icon className="h-8 w-8 text-orange-500" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{titulo}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Lo que dicen nuestros clientes
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {RESENAS.map((r) => (
              <figure
                key={r.nombre}
                className="rounded-2xl border-l-4 border-orange-500 bg-gray-50 p-6 shadow-sm"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm text-gray-700">
                  “{r.texto}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                    {r.inicial}
                  </span>
                  <span className="text-sm font-semibold">{r.nombre}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

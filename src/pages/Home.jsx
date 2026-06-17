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
  ChevronDown,
} from "lucide-react"
import {
  obtenerProductosDestacados,
  obtenerCategorias,
} from "../services/productService"
import ProductCard from "../components/ProductCard"
import BrandLogo from "../components/BrandLogo"
import { CLASES_HOME_PRINCIPAL } from "../utils/brand"

const DESTACADOS_LIMITE = 8

const HERO_IMAGENES = [
  "/images/hero/hero-principal.png",
  "/images/hero/hero-1.png",
  "/images/hero/hero-2.png",
  "/images/hero/hero-3.png",
  "/images/hero/hero-4.png",
]

const IMAGENES_CATEGORIA = {
  "Zapatos Deportivos":
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  "Zapatos Casuales":
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",
  "Zapatos Formales":
    "https://images.unsplash.com/photo-1614252238956-54c2563aa9f3?w=400&q=80",
  Botas:
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80",
  Sandalias:
    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80",
  "Zapatos de Vestir":
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80",
  "Zapatos para Correr":
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
  "Zapatos de Moda":
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=80",
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

const TESTIMONIOS = [
  {
    nombre: "María G.",
    rating: 5,
    texto: "Excelente calidad, los zapatos son muy cómodos",
    inicial: "MG",
  },
  {
    nombre: "Carlos R.",
    rating: 5,
    texto: "El servicio es increíble, llegaron antes de lo esperado",
    inicial: "CR",
  },
  {
    nombre: "Laura M.",
    rating: 5,
    texto: "Ya he comprado 3 pares, siempre quedan perfectos",
    inicial: "LM",
  },
  {
    nombre: "Ana P.",
    rating: 5,
    texto: "Me encanta la variedad de colores y tallas",
    inicial: "AP",
  },
  {
    nombre: "José L.",
    rating: 5,
    texto: "Los materiales son de primera calidad",
    inicial: "JL",
  },
  {
    nombre: "Sofía C.",
    rating: 5,
    texto: "Mi tienda favorita para comprar zapatos",
    inicial: "SC",
  },
]

const FAQ = [
  {
    pregunta: "¿Cómo saber mi talla correcta?",
    respuesta:
      "Te recomendamos medir tu pie y revisar nuestra guía de tallas. También puedes contactarnos para asesoría personalizada.",
  },
  {
    pregunta: "¿Los zapatos son originales?",
    respuesta:
      "Sí, todos nuestros productos son 100% originales y de la mejor calidad.",
  },
  {
    pregunta: "¿Cuánto tiempo tarda el envío?",
    respuesta:
      "Los envíos nacionales tardan entre 2-5 días hábiles. Envíos internacionales pueden tardar 7-15 días.",
  },
  {
    pregunta: "¿Puedo cambiar o devolver un producto?",
    respuesta:
      "Sí, tienes 30 días para realizar cambios o devoluciones si el producto no te queda bien.",
  },
  {
    pregunta: "¿Qué métodos de pago aceptan?",
    respuesta:
      "Aceptamos tarjetas de crédito/débito, transferencias bancarias y pago contra entrega.",
  },
  {
    pregunta: "¿Tienen tallas para niños?",
    respuesta:
      "Sí, contamos con tallas desde el 25 hasta el 34 para niños y niñas.",
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
    <section className="relative min-h-[480px] overflow-hidden bg-gray-900 md:min-h-[560px]">
      {HERO_IMAGENES.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 flex items-center justify-center bg-gray-900 transition-opacity duration-700 ${
            i === actual ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== actual}
        >
          <img
            src={url}
            alt={i === 0 ? "Zapatos RAA — colección principal" : ""}
            className="max-h-full max-w-full object-contain object-center"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      <div className="relative mx-auto flex min-h-[480px] max-w-7xl flex-col items-start justify-center px-4 py-16 md:min-h-[560px] md:py-24">
        <span className="rounded-full bg-orange-500/20 px-4 py-1 text-sm font-semibold text-orange-300">
          Temporada de ofertas
        </span>
        <h1 className="mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Encuentra el calzado perfecto para ti
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-lg text-gray-300">
          Calidad, comodidad y estilo en cada paso
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/productos"
            className="rounded-full bg-orange-500 px-7 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
          >
            Ver Colección
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

function Estrellas({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

function SeccionTestimonios() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Lo que dicen nuestros clientes
        </h2>
        <div className="-mx-4 mt-8 flex gap-4 overflow-x-auto px-4 pb-2 snap-x md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-3">
          {TESTIMONIOS.map((t) => (
            <article
              key={t.nombre}
              className="flex min-w-[280px] snap-start flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm md:min-w-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-sm font-bold text-white">
                  {t.inicial}
                </span>
                <p className="text-sm font-semibold text-gray-900">{t.nombre}</p>
              </div>
              <div className="mt-3">
                <Estrellas rating={t.rating} />
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">
                “{t.texto}”
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SeccionFaq() {
  const [abierta, setAbierta] = useState(null)

  return (
    <section className="bg-[#F9FAFB]">
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-8 space-y-3">
          {FAQ.map((item, i) => {
            const expandida = abierta === i
            return (
              <div
                key={item.pregunta}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setAbierta(expandida ? null : i)}
                  aria-expanded={expandida}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 sm:text-base">
                    {item.pregunta}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#F97316] transition-transform duration-200 ${
                      expandida ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandida && (
                  <div className="border-t border-gray-100 px-5 pb-4 pt-2">
                    <p className="text-sm leading-relaxed text-gray-600">
                      {item.respuesta}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
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
    Promise.all([obtenerProductosDestacados(DESTACADOS_LIMITE), obtenerCategorias()])
      .then(([prods, cats]) => {
        setDestacados(prods)
        setCategorias(cats)
        setCargando(false)
      })
      .catch((err) => {
        console.error("Error cargando productos:", err)
        setCargando(false)
      })
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
            ¿Cómo comprar en Zapatos RAA?
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
              ? Array.from({ length: DESTACADOS_LIMITE }).map((_, i) => (
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

      <SeccionTestimonios />
      <SeccionFaq />

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
              Descubre nuestra colección de calzado
            </h2>
            <p className="mt-2 max-w-lg text-sm text-gray-200 md:text-base">
              Zapatos para cada ocasión, estilo y talla
            </p>
            <Link
              to="/productos?categoria=Zapatos%20Deportivos"
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
            ¿Por qué elegir Zapatos RAA?
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
    </div>
  )
}

import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ShieldCheck, Truck, Wallet, MessageCircle } from "lucide-react"
import { MARCA } from "../../utils/brand"

const BADGES_CONFIANZA = [
  { icono: "🛡️", texto: "Compra segura" },
  { icono: "📦", texto: "Pago contraentrega" },
  { icono: "🚚", texto: "Envío gratis a toda Colombia" },
]

const GARANTIAS = [
  {
    titulo: "Revisa antes de pagar",
    desc: "Recibes tu pedido y pagas solo cuando lo tengas en tus manos.",
  },
  {
    titulo: "Cambio fácil por talla",
    desc: "Si no te queda bien, te ayudamos a cambiarla sin complicaciones.",
  },
  {
    titulo: "Atención por WhatsApp",
    desc: "Resolvemos tus dudas en minutos, de lunes a sábado.",
  },
]

const FAQ_LANDING = [
  {
    pregunta: "¿Cómo funciona el pago contraentrega?",
    respuesta:
      "Eliges tu producto, confirmas tu pedido y pagas en efectivo cuando el mensajero te entrega el paquete en tu domicilio. Sin tarjeta, sin riesgo.",
  },
  {
    pregunta: "¿Cuánto tarda el envío?",
    respuesta:
      "Despachamos a todo Colombia. El envío tarda entre 2 y 5 días hábiles según tu ciudad.",
  },
  {
    pregunta: "¿Puedo revisar el producto antes de pagar?",
    respuesta:
      "Sí. Puedes revisar tu pedido al momento de la entrega y pagar solo si todo está correcto.",
  },
  {
    pregunta: "¿Cómo sé cuál es mi talla?",
    respuesta:
      "Si tienes dudas, escríbenos por WhatsApp con la talla que usas habitualmente y te asesoramos gratis.",
  },
  {
    pregunta: "¿Los zapatos son originales?",
    respuesta:
      "Sí. En Zapatos RAA vendemos calzado deportivo original con garantía de calidad y respaldo en cada entrega.",
  },
]

export function LandingBadgesConfianza() {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {BADGES_CONFIANZA.map(({ icono, texto }) => (
        <div
          key={texto}
          className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2"
        >
          <span className="text-base" aria-hidden="true">
            {icono}
          </span>
          <span className="text-xs font-medium leading-tight text-gray-800">
            {texto}
          </span>
        </div>
      ))}
    </div>
  )
}

export function LandingGarantias() {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-base font-bold text-gray-900">
        Compra con total tranquilidad
      </h2>
      <div className="space-y-2">
        {GARANTIAS.map(({ titulo, desc }) => (
          <div
            key={titulo}
            className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white"
              aria-hidden="true"
            >
              ✓
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{titulo}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function LandingFAQ() {
  const [abierta, setAbierta] = useState(null)

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-base font-bold text-gray-900">
        Preguntas frecuentes
      </h2>
      <div className="space-y-2">
        {FAQ_LANDING.map((item, i) => {
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
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {item.pregunta}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[#F97316] transition-transform ${
                    expandida ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandida && (
                <div className="border-t border-gray-100 px-4 pb-3.5 pt-2">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {item.respuesta}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function LandingFooter() {
  const items = [
    { icon: Truck, texto: "Envíos nacionales" },
    { icon: Wallet, texto: "Pago contraentrega" },
    { icon: MessageCircle, texto: "Atención por WhatsApp" },
    { icon: ShieldCheck, texto: "Garantía de satisfacción" },
    { icon: ShieldCheck, texto: "Compra segura" },
  ]

  return (
    <footer className="mt-10 border-t border-gray-200 bg-gray-50 pb-28 pt-8">
      <div className="mx-auto max-w-lg px-4">
        <p className="text-center text-base font-bold text-gray-900">
          {MARCA.nombre}
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">
          Calzado deportivo original · Entregas diarias en Colombia
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map(({ icon: Icon, texto }) => (
            <div
              key={texto}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 shadow-sm"
            >
              <Icon className="h-4 w-4 shrink-0 text-[#F97316]" />
              <span className="text-xs font-medium text-gray-700">{texto}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-900">
            Inicio
          </Link>
          <Link to="/productos" className="hover:text-gray-900">
            Catálogo
          </Link>
        </div>
        <p className="mt-4 text-center text-[10px] text-gray-400">
          © {new Date().getFullYear()} {MARCA.nombre}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  )
}

export function IconoWhatsApp({ className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

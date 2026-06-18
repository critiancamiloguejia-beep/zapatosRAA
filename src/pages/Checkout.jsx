import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCarrito } from "../context/CartContext"
import { formatearPrecio } from "../utils/formatters"
import { calcularTotales } from "../utils/calcularTotales"
import { crearPedido } from "../services/orderService"
import { abrirWhatsApp, mensajeConfirmacionPedido } from "../utils/whatsapp"
import { claveItemCarrito, textoTalla, textoColor } from "../utils/cartHelpers"

const USAR_SUPABASE = import.meta.env.VITE_USAR_SUPABASE === "true"

const formularioInicial = {
  nombreCompleto: "",
  email: "",
  telefono: "",
  direccion: "",
  ciudad: "",
}

// Página de checkout con formulario y resumen del pedido
export default function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrecio, vaciarCarrito } = useCarrito()
  const [formulario, setFormulario] = useState(formularioInicial)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState(null)

  const totales = calcularTotales(totalPrecio)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          No hay productos en el carrito
        </h1>
        <Link
          to="/productos"
          className="inline-block rounded-lg bg-[#F97316] px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          Ver productos
        </Link>
      </div>
    )
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formulario.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = "El nombre es obligatorio"
    }
    if (!formulario.email.trim()) {
      nuevosErrores.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) {
      nuevosErrores.email = "Ingresa un email válido"
    }
    if (!formulario.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio"
    }
    if (!formulario.direccion.trim()) {
      nuevosErrores.direccion = "La dirección es obligatoria"
    }
    if (!formulario.ciudad.trim()) {
      nuevosErrores.ciudad = "La ciudad es obligatoria"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const enviarPedidoYWhatsApp = (datosPedido) => {
    abrirWhatsApp(
      mensajeConfirmacionPedido({
        formulario,
        items,
        total: datosPedido.total,
      })
    )

    sessionStorage.setItem("ultimoPedido", JSON.stringify(datosPedido))
    vaciarCarrito()
    navigate("/pedido-confirmado")
  }

  const guardarPedidoLocal = () => {
    enviarPedidoYWhatsApp({
      ...formulario,
      items,
      subtotal: totales.subtotal,
      costoEnvio: totales.costoEnvio,
      total: totales.total,
      fecha: new Date().toISOString(),
    })
  }

  const manejarEnviar = async (e) => {
    e.preventDefault()
    if (!validarFormulario()) return

    // Modo local: sin Supabase, flujo anterior
    if (!USAR_SUPABASE) {
      guardarPedidoLocal()
      return
    }

    setEnviando(true)
    setErrorEnvio(null)

    try {
      const pedido = await crearPedido({
        formulario,
        items,
        totales: {
          subtotal: totales.subtotal,
          costoEnvio: totales.costoEnvio,
          total: totales.total,
        },
      })

      enviarPedidoYWhatsApp({
        pedidoId: pedido.id,
        nombreCompleto: formulario.nombreCompleto,
        email: formulario.email,
        telefono: formulario.telefono,
        direccion: formulario.direccion,
        ciudad: formulario.ciudad,
        items,
        subtotal: totales.subtotal,
        costoEnvio: totales.costoEnvio,
        total: pedido.total,
        fecha: new Date().toISOString(),
      })
    } catch (err) {
      setErrorEnvio(
        err instanceof Error
          ? err.message
          : "Hubo un problema al procesar tu pedido. Intenta de nuevo."
      )
      setEnviando(false)
    }
  }

  const campos = [
    { name: "nombreCompleto", label: "Nombre completo", type: "text", placeholder: "Juan Pérez" },
    { name: "email", label: "Email", type: "email", placeholder: "juan@email.com" },
    { name: "telefono", label: "Teléfono", type: "tel", placeholder: "300 123 4567" },
    { name: "direccion", label: "Dirección de envío", type: "text", placeholder: "Calle 123 #45-67" },
    { name: "ciudad", label: "Ciudad", type: "text", placeholder: "Bogotá" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
        Finalizar compra
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={manejarEnviar} className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              Datos de envío
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {campos.map((campo) => (
                <div
                  key={campo.name}
                  className={campo.name === "direccion" ? "sm:col-span-2" : ""}
                >
                  <label
                    htmlFor={campo.name}
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    {campo.label}
                  </label>
                  <input
                    id={campo.name}
                    name={campo.name}
                    type={campo.type}
                    placeholder={campo.placeholder}
                    value={formulario[campo.name]}
                    onChange={manejarCambio}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      errores[campo.name]
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#F97316] focus:ring-orange-200"
                    }`}
                  />
                  {errores[campo.name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errores[campo.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {errorEnvio && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {errorEnvio}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className={`mt-6 w-full rounded-lg bg-[#F97316] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600 sm:w-auto ${
              enviando ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {enviando ? "Procesando pedido..." : "Confirmar pedido"}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Resumen del pedido
          </h2>
          <ul className="mb-4 divide-y divide-gray-100">
            {items.map((item) => {
              const tallaTexto = textoTalla(item)
              const colorTexto = textoColor(item)

              return (
                <li
                  key={claveItemCarrito(item)}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <div className="min-w-0 flex-1 text-gray-600">
                    <p className="font-medium text-gray-900">
                      {item.nombre} × {item.cantidad}
                    </p>
                    <ul className="mt-1 space-y-0.5 text-xs text-gray-500">
                      {tallaTexto && <li>{tallaTexto}</li>}
                      {colorTexto && <li>{colorTexto}</li>}
                    </ul>
                  </div>
                  <span className="shrink-0 font-medium text-gray-900">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">
              {formatearPrecio(totales.subtotal)}
            </span>
          </div>
          <div className="mb-4 flex justify-between text-sm text-gray-600">
            <span>Envío</span>
            <span className="font-medium">
              {totales.envioGratis
                ? "Gratis"
                : formatearPrecio(totales.costoEnvio)}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatearPrecio(totales.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

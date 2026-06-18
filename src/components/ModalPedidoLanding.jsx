import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { formatearPrecio } from "../utils/formatters"
import { abrirWhatsApp, mensajeConfirmacionPedido } from "../utils/whatsapp"
import { textoTalla, textoColor } from "../utils/cartHelpers"

const formularioInicial = {
  nombreCompleto: "",
  telefono: "",
  direccion: "",
  ciudad: "",
}

// Modal de pedido para la landing (resumen + datos de envío + WhatsApp)
export default function ModalPedidoLanding({
  abierto,
  onCerrar,
  producto,
  talla,
  color,
  cantidad,
}) {
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState(formularioInicial)
  const [errores, setErrores] = useState({})

  if (!abierto || !producto) return null

  const total = producto.precio * cantidad
  const item = {
    ...producto,
    talla,
    color,
    cantidad,
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validar = () => {
    const nuevos = {}
    if (!formulario.nombreCompleto.trim()) {
      nuevos.nombreCompleto = "El nombre es obligatorio"
    }
    if (!formulario.telefono.trim()) {
      nuevos.telefono = "El teléfono es obligatorio"
    }
    if (!formulario.direccion.trim()) {
      nuevos.direccion = "La dirección es obligatoria"
    }
    if (!formulario.ciudad.trim()) {
      nuevos.ciudad = "La ciudad es obligatoria"
    }
    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  const manejarConfirmar = (e) => {
    e.preventDefault()
    if (!validar()) return

    const datosPedido = {
      ...formulario,
      items: [item],
      subtotal: total,
      costoEnvio: 0,
      total,
      fecha: new Date().toISOString(),
    }

    abrirWhatsApp(
      mensajeConfirmacionPedido({
        formulario,
        items: [item],
        total,
      })
    )

    sessionStorage.setItem("ultimoPedido", JSON.stringify(datosPedido))
    onCerrar()
    navigate("/pedido-confirmado")
  }

  const campo = (name, label, type = "text") => (
    <div>
      <label
        htmlFor={`landing-${name}`}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={`landing-${name}`}
        name={name}
        type={type}
        value={formulario[name]}
        onChange={manejarCambio}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:border-[#F97316] focus:outline-none focus:ring-2 focus:ring-orange-200 ${
          errores[name] ? "border-red-400" : "border-gray-200"
        }`}
      />
      {errores[name] && (
        <p className="mt-1 text-xs text-red-600">{errores[name]}</p>
      )}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-pedido-titulo"
      onClick={onCerrar}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 id="modal-pedido-titulo" className="text-lg font-bold text-gray-900">
            Realizar pedido
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={manejarConfirmar} className="space-y-6 p-6">
          <div className="rounded-xl bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Resumen del pedido
            </h3>
            <p className="font-semibold text-gray-900">{producto.nombre}</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {textoTalla(item) && <li>{textoTalla(item)}</li>}
              {textoColor(item) && <li>{textoColor(item)}</li>}
              <li>Cantidad: {cantidad}</li>
              <li>Precio unitario: {formatearPrecio(producto.precio)}</li>
            </ul>
            <p className="mt-3 text-lg font-bold text-gray-900">
              Total: {formatearPrecio(total)}
            </p>
          </div>

          <div className="space-y-4">
            {campo("nombreCompleto", "Nombre completo")}
            {campo("telefono", "Teléfono", "tel")}
            {campo("direccion", "Dirección de envío")}
            {campo("ciudad", "Ciudad")}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#F97316] px-6 py-3.5 text-base font-bold text-white transition hover:bg-orange-600"
          >
            Confirmar pedido
          </button>
        </form>
      </div>
    </div>
  )
}

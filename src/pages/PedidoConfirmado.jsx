import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { formatearPrecio } from "../utils/formatters"

// Pantalla de confirmación después de completar el pedido
export default function PedidoConfirmado() {
  const navigate = useNavigate()
  const [pedido, setPedido] = useState(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    const datos = sessionStorage.getItem("ultimoPedido")
    if (datos) {
      setPedido(JSON.parse(datos))
    }
    setListo(true)
  }, [])

  // Sin datos en sessionStorage → redirigir al inicio
  useEffect(() => {
    if (listo && !pedido) {
      navigate("/", { replace: true })
    }
  }, [listo, pedido, navigate])

  if (!listo || !pedido) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">Cargando confirmación...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          ¡Pedido confirmado!
        </h1>
        <p className="mb-2 text-gray-500">
          Gracias, <strong>{pedido.nombreCompleto}</strong>. Tu pedido ha sido
          registrado exitosamente.
        </p>

        {pedido.pedidoId && (
          <p className="mb-2 text-sm text-gray-500">
            Número de pedido:{" "}
            <span className="font-mono font-medium text-gray-900">
              {pedido.pedidoId}
            </span>
          </p>
        )}

        <p className="mb-8 text-sm text-gray-500">
          Recibirás la confirmación en{" "}
          <span className="font-medium text-gray-900">{pedido.email}</span>
        </p>

        <div className="mb-8 rounded-lg bg-gray-50 p-6 text-left">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Detalles del envío
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{pedido.email}</dd>
            </div>
            {pedido.telefono && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Teléfono</dt>
                <dd className="font-medium text-gray-900">{pedido.telefono}</dd>
              </div>
            )}
            {pedido.direccion && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Dirección</dt>
                <dd className="font-medium text-gray-900">{pedido.direccion}</dd>
              </div>
            )}
            {pedido.ciudad && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Ciudad</dt>
                <dd className="font-medium text-gray-900">{pedido.ciudad}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <dt className="font-semibold text-gray-900">Total pagado</dt>
              <dd className="font-bold text-[#F97316]">
                {formatearPrecio(pedido.total)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mb-8 text-left">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Productos ({pedido.items.length})
          </h2>
          <ul className="space-y-2">
            {pedido.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span>
                  {item.emoji} {item.nombre} × {item.cantidad}
                </span>
                <span className="font-medium">
                  {formatearPrecio(item.precio * item.cantidad)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/"
          className="inline-block rounded-lg bg-[#F97316] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

import { Component } from "react"
import { Link } from "react-router-dom"

// Captura errores de renderizado en toda la aplicación
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { tieneError: false }
  }

  static getDerivedStateFromError() {
    return { tieneError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.tieneError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
          <span className="mb-4 text-5xl">⚠️</span>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Algo salió mal
          </h1>
          <p className="mb-8 max-w-md text-gray-500">
            Ocurrió un error inesperado. Por favor intenta de nuevo.
          </p>
          <Link
            to="/"
            className="rounded-xl bg-[#F97316] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
          >
            Volver al inicio
          </Link>
        </div>
      )
    }

    return this.props.children
  }
}

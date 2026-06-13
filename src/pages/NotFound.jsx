import { Link } from "react-router-dom"
import BrandLogo from "../components/BrandLogo"

// Página 404 para rutas no encontradas
export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-center">
        <BrandLogo variant="principal" className="!h-16 !w-auto sm:!h-20" />
      </div>
      <p className="mb-2 text-6xl font-bold text-[#F97316]">404</p>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
        Página no encontrada
      </h1>
      <p className="mb-8 text-gray-500">
        La página que buscas no existe o fue movida.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded-xl bg-[#F97316] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
        >
          Volver al inicio
        </Link>
        <Link
          to="/productos"
          className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
        >
          Ver productos
        </Link>
      </div>
    </div>
  )
}

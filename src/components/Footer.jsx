import { Link } from "react-router-dom"
import BrandLogo from "./BrandLogo"
import { MARCA, NOMBRE_TIENDA } from "../utils/brand"

// Footer con 4 columnas
export default function Footer() {
  const anioActual = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Columna 1: Marca */}
          <div>
            <Link to="/" className="inline-block transition-opacity hover:opacity-90">
              <BrandLogo
                variant="principal"
                invert
                className="!h-20 !w-auto max-w-[180px] sm:!h-24"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {MARCA.eslogan}. Calzado de calidad para cada ocasión, con envío
              a todo Colombia.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              Enlaces
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="transition-all duration-200 hover:text-[#F97316]"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/productos"
                  className="transition-all duration-200 hover:text-[#F97316]"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/favoritos"
                  className="transition-all duration-200 hover:text-[#F97316]"
                >
                  Favoritos
                </Link>
              </li>
              <li>
                <Link
                  to="/carrito"
                  className="transition-all duration-200 hover:text-[#F97316]"
                >
                  Carrito
                </Link>
              </li>
              <li>
                <Link
                  to="/checkout"
                  className="transition-all duration-200 hover:text-[#F97316]"
                >
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Ayuda */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              Ayuda
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="cursor-default transition-all duration-200 hover:text-[#F97316]">
                  Envíos y entregas
                </span>
              </li>
              <li>
                <span className="cursor-default transition-all duration-200 hover:text-[#F97316]">
                  Devoluciones
                </span>
              </li>
              <li>
                <span className="cursor-default transition-all duration-200 hover:text-[#F97316]">
                  Preguntas frecuentes
                </span>
              </li>
              <li>
                <span className="cursor-default transition-all duration-200 hover:text-[#F97316]">
                  Términos y condiciones
                </span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm">
              <li>📧 hola@raa.com</li>
              <li>📞 +57 300 123 4567</li>
              <li>📍 Bogotá, Colombia</li>
              <li className="pt-2">
                <span className="mr-3 cursor-pointer transition-all duration-200 hover:text-[#F97316]">
                  Instagram
                </span>
                <span className="cursor-pointer transition-all duration-200 hover:text-[#F97316]">
                  Facebook
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {anioActual} {NOMBRE_TIENDA}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

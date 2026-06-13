import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import {
  obtenerProductosFiltrados,
  obtenerCategorias,
} from "../services/productService"
import ProductCard from "../components/ProductCard"

const OPCIONES_ORDEN = [
  { valor: "default", etiqueta: "Por defecto" },
  { valor: "menor", etiqueta: "Precio: menor a mayor" },
  { valor: "mayor", etiqueta: "Precio: mayor a mayor" },
]

// Actualiza los query params omitiendo valores vacíos o por defecto
function construirParams(actuales, cambios) {
  const params = new URLSearchParams(actuales)

  Object.entries(cambios).forEach(([clave, valor]) => {
    if (!valor || valor === "default") {
      params.delete(clave)
    } else {
      params.set(clave, valor)
    }
  })

  return params
}

// Página de catálogo con filtros sincronizados en la URL y datos desde productService
export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [reintentar, setReintentar] = useState(0)

  // Filtros leídos desde la URL
  const categoriaFiltro = searchParams.get("categoria") || ""
  const busquedaUrl = searchParams.get("q") || ""
  const orden = searchParams.get("orden") || "default"

  // Estado local del input de búsqueda (con debounce hacia la URL)
  const [busquedaInput, setBusquedaInput] = useState(busquedaUrl)
  const debounceRef = useRef(null)

  // Sincronizar input cuando cambia la URL externamente
  useEffect(() => {
    setBusquedaInput(busquedaUrl)
  }, [busquedaUrl])

  // Debounce de 300ms: actualizar URL solo después de dejar de escribir
  useEffect(() => {
    if (busquedaInput === busquedaUrl) return

    debounceRef.current = setTimeout(() => {
      setSearchParams(construirParams(searchParams, { q: busquedaInput }), {
        replace: true,
      })
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [busquedaInput, busquedaUrl, searchParams, setSearchParams])

  const actualizarFiltros = (cambios) => {
    setSearchParams(construirParams(searchParams, cambios), { replace: true })
  }

  // Cargar categorías una sola vez al montar
  useEffect(() => {
    obtenerCategorias().then(setCategorias).catch(console.error)
  }, [])

  // Cargar productos cuando cambien los filtros de la URL
  const cargarProductos = useCallback(() => {
    const categoria = searchParams.get("categoria") || ""
    const q = searchParams.get("q") || ""
    const ordenParam = searchParams.get("orden") || ""

    setCargando(true)
    setError(null)

    obtenerProductosFiltrados({ categoria, q, orden: ordenParam })
      .then((data) => {
        setProductos(data)
        setCargando(false)
      })
      .catch(() => {
        setError("No se pudieron cargar los productos")
        setCargando(false)
      })
  }, [searchParams])

  useEffect(() => {
    cargarProductos()
  }, [searchParams, reintentar, cargarProductos])

  const limpiarFiltros = () => {
    setBusquedaInput("")
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        Catálogo de productos
      </h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busquedaInput}
            onChange={(e) => setBusquedaInput(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 text-sm focus:border-[#F97316] focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <select
          value={orden}
          onChange={(e) => actualizarFiltros({ orden: e.target.value })}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#F97316] focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          {OPCIONES_ORDEN.map((op) => (
            <option key={op.valor} value={op.valor}>
              {op.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <button
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 lg:hidden"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
        </button>

        <aside
          className={`lg:block lg:w-56 lg:shrink-0 ${
            filtrosAbiertos ? "block" : "hidden"
          }`}
        >
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Categoría
            </h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => actualizarFiltros({ categoria: "" })}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    categoriaFiltro === ""
                      ? "bg-orange-50 font-medium text-[#F97316]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Todas
                </button>
              </li>
              {categorias.map((cat) => (
                <li key={cat.nombre}>
                  <button
                    onClick={() => actualizarFiltros({ categoria: cat.nombre })}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      categoriaFiltro === cat.nombre
                        ? "bg-orange-50 font-medium text-[#F97316]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {cat.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          {error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 py-16 text-center">
              <p className="mb-4 text-lg text-red-600">{error}</p>
              <button
                onClick={() => setReintentar((n) => n + 1)}
                className="rounded-xl bg-[#F97316] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
              >
                Reintentar
              </button>
            </div>
          ) : cargando ? (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-gray-500">
                Cargando productos...
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {productos.length} producto
                {productos.length !== 1 ? "s" : ""} encontrado
                {productos.length !== 1 ? "s" : ""}
              </p>

              {productos.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {productos.map((producto) => (
                    <ProductCard key={producto.id} producto={producto} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
                  <p className="text-lg text-gray-500">
                    No se encontraron productos
                  </p>
                  <button
                    onClick={limpiarFiltros}
                    className="mt-4 text-sm font-medium text-[#F97316] hover:text-orange-600"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

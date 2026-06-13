import { useRef, lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { FavoritesProvider } from "./context/FavoritesContext"
import ErrorBoundary from "./components/ErrorBoundary"
import Header, { ALTURA_HEADER } from "./components/Header"
import Footer from "./components/Footer"
import WhatsAppButton from "./components/WhatsAppButton"

// Carga diferida de páginas para reducir el bundle inicial
const Home = lazy(() => import("./pages/Home"))
const Catalogo = lazy(() => import("./pages/Catalogo"))
const DetalleProducto = lazy(() => import("./pages/DetalleProducto"))
const Carrito = lazy(() => import("./pages/Carrito"))
const Checkout = lazy(() => import("./pages/Checkout"))
const PedidoConfirmado = lazy(() => import("./pages/PedidoConfirmado"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Favoritos = lazy(() => import("./pages/Favoritos"))

// Indicador de carga mientras se importa una ruta
function CargandoPagina() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <p className="text-sm font-medium text-gray-500">Cargando...</p>
    </div>
  )
}

// Componente principal con rutas y layout
export default function App() {
  const sentinelRef = useRef(null)

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CartProvider>
          <FavoritesProvider>
            <div className="flex min-h-screen flex-col bg-white">
              <Header sentinelRef={sentinelRef} />
              <main className="flex-1" style={{ paddingTop: ALTURA_HEADER }}>
                <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
                <Suspense fallback={<CargandoPagina />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/productos" element={<Catalogo />} />
                    <Route path="/productos/:id" element={<DetalleProducto />} />
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/favoritos" element={<Favoritos />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route
                      path="/pedido-confirmado"
                      element={<PedidoConfirmado />}
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <WhatsAppButton />
            </div>
          </FavoritesProvider>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

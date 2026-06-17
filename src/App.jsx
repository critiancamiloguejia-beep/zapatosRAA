import { useRef, lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { FavoritesProvider } from "./context/FavoritesContext"
import ErrorBoundary from "./components/ErrorBoundary"
import Header, { ALTURA_HEADER } from "./components/Header"
import Footer from "./components/Footer"
import WhatsAppButton from "./components/WhatsAppButton"

const Home = lazy(() => import("./pages/Home"))
const Catalogo = lazy(() => import("./pages/Catalogo"))
const DetalleProducto = lazy(() => import("./pages/DetalleProducto"))
const Carrito = lazy(() => import("./pages/Carrito"))
const Checkout = lazy(() => import("./pages/Checkout"))
const PedidoConfirmado = lazy(() => import("./pages/PedidoConfirmado"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Favoritos = lazy(() => import("./pages/Favoritos"))
const LandingProducto = lazy(() => import("./pages/LandingProducto"))

function CargandoPagina() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <p className="text-sm font-medium text-gray-500">Cargando...</p>
    </div>
  )
}

function LayoutTienda({ children }) {
  const sentinelRef = useRef(null)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header sentinelRef={sentinelRef} />
      <main className="flex-1" style={{ paddingTop: ALTURA_HEADER }}>
        <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

function RutasTienda() {
  return (
    <LayoutTienda>
      <Suspense fallback={<CargandoPagina />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalogo />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </LayoutTienda>
  )
}

function AppRoutes() {
  const location = useLocation()
  const esLanding = location.pathname.startsWith("/ofertas")

  if (esLanding) {
    return (
      <Suspense fallback={<CargandoPagina />}>
        <Routes>
          <Route path="/ofertas" element={<LandingProducto />} />
          <Route path="/ofertas/:id" element={<LandingProducto />} />
        </Routes>
      </Suspense>
    )
  }

  return <RutasTienda />
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CartProvider>
          <FavoritesProvider>
            <AppRoutes />
          </FavoritesProvider>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

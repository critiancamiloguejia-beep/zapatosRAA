import { Link } from "react-router-dom"
import { useCarrito } from "../context/CartContext"

// Ícono del carrito con contador de productos
export default function CartIcon() {
  const { totalItems } = useCarrito()

  return (
    <Link
      to="/carrito"
      className="relative flex items-center justify-center rounded-full p-2 text-gray-800 transition-all duration-200 hover:bg-gray-100"
      aria-label={`Carrito con ${totalItems} productos`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F97316] text-[10px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  )
}

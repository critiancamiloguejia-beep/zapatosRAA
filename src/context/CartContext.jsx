import { createContext, useContext, useReducer, useEffect } from "react"

// Clave para persistir el carrito en localStorage
const STORAGE_KEY = "tiendanova-carrito"

// Acciones del reducer del carrito
const ACCIONES = {
  AGREGAR: "AGREGAR",
  QUITAR: "QUITAR",
  ELIMINAR: "ELIMINAR",
  VACIAR: "VACIAR",
  CARGAR: "CARGAR",
}

// Estado inicial del carrito
const estadoInicial = {
  items: [],
}

// Cargar carrito guardado desde localStorage
function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    if (guardado) {
      return { items: JSON.parse(guardado) }
    }
  } catch {
    // Si hay error al leer, iniciar con carrito vacío
  }
  return estadoInicial
}

// Reducer que maneja todas las operaciones del carrito
function carritoReducer(estado, accion) {
  switch (accion.type) {
    case ACCIONES.CARGAR:
      return accion.payload

    case ACCIONES.AGREGAR: {
      const { producto, cantidad = 1 } = accion.payload
      const existente = estado.items.find((item) => item.id === producto.id)

      if (existente) {
        return {
          items: estado.items.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          ),
        }
      }

      return {
        items: [...estado.items, { ...producto, cantidad }],
      }
    }

    case ACCIONES.QUITAR: {
      const { id } = accion.payload
      return {
        items: estado.items
          .map((item) =>
            item.id === id
              ? { ...item, cantidad: item.cantidad - 1 }
              : item
          )
          .filter((item) => item.cantidad > 0),
      }
    }

    case ACCIONES.ELIMINAR: {
      const { id } = accion.payload
      return {
        items: estado.items.filter((item) => item.id !== id),
      }
    }

    case ACCIONES.VACIAR:
      return estadoInicial

    default:
      return estado
  }
}

const CartContext = createContext(null)

// Proveedor del contexto del carrito
export function CartProvider({ children }) {
  const [estado, dispatch] = useReducer(carritoReducer, estadoInicial)

  // Cargar carrito al montar el componente
  useEffect(() => {
    dispatch({ type: ACCIONES.CARGAR, payload: cargarCarrito() })
  }, [])

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado.items))
  }, [estado.items])

  // Agregar producto al carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    dispatch({ type: ACCIONES.AGREGAR, payload: { producto, cantidad } })
  }

  // Reducir cantidad de un producto
  const quitarDelCarrito = (id) => {
    dispatch({ type: ACCIONES.QUITAR, payload: { id } })
  }

  // Eliminar producto completamente del carrito
  const eliminarDelCarrito = (id) => {
    dispatch({ type: ACCIONES.ELIMINAR, payload: { id } })
  }

  // Vaciar todo el carrito
  const vaciarCarrito = () => {
    dispatch({ type: ACCIONES.VACIAR })
  }

  // Total de unidades en el carrito (para el ícono del header)
  const totalItems = estado.items.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  // Precio total del carrito
  const totalPrecio = estado.items.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items: estado.items,
        agregarAlCarrito,
        quitarDelCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        totalItems,
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook personalizado para usar el contexto del carrito
export function useCarrito() {
  const contexto = useContext(CartContext)
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de un CartProvider")
  }
  return contexto
}

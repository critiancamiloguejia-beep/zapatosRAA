import { createContext, useContext, useReducer, useEffect } from "react"

const STORAGE_KEY = "tiendanova-favoritos"

const ACCIONES = {
  AGREGAR: "AGREGAR",
  ELIMINAR: "ELIMINAR",
  ALTERNAR: "ALTERNAR",
  CARGAR: "CARGAR",
}

const estadoInicial = {
  ids: [],
}

function cargarFavoritos() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    if (guardado) {
      const ids = JSON.parse(guardado)
      if (Array.isArray(ids)) {
        return { ids }
      }
    }
  } catch {
    // Si hay error al leer, iniciar con favoritos vacíos
  }
  return estadoInicial
}

function favoritosReducer(estado, accion) {
  switch (accion.type) {
    case ACCIONES.CARGAR:
      return accion.payload

    case ACCIONES.AGREGAR: {
      const { id } = accion.payload
      if (estado.ids.includes(id)) return estado
      return { ids: [...estado.ids, id] }
    }

    case ACCIONES.ELIMINAR: {
      const { id } = accion.payload
      return { ids: estado.ids.filter((favId) => favId !== id) }
    }

    case ACCIONES.ALTERNAR: {
      const { id } = accion.payload
      if (estado.ids.includes(id)) {
        return { ids: estado.ids.filter((favId) => favId !== id) }
      }
      return { ids: [...estado.ids, id] }
    }

    default:
      return estado
  }
}

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [estado, dispatch] = useReducer(favoritosReducer, estadoInicial)

  useEffect(() => {
    dispatch({ type: ACCIONES.CARGAR, payload: cargarFavoritos() })
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado.ids))
  }, [estado.ids])

  const agregarFavorito = (id) => {
    dispatch({ type: ACCIONES.AGREGAR, payload: { id: Number(id) } })
  }

  const eliminarFavorito = (id) => {
    dispatch({ type: ACCIONES.ELIMINAR, payload: { id: Number(id) } })
  }

  const alternarFavorito = (id) => {
    dispatch({ type: ACCIONES.ALTERNAR, payload: { id: Number(id) } })
  }

  const esFavorito = (id) => estado.ids.includes(Number(id))

  const totalFavoritos = estado.ids.length

  return (
    <FavoritesContext.Provider
      value={{
        ids: estado.ids,
        agregarFavorito,
        eliminarFavorito,
        alternarFavorito,
        esFavorito,
        totalFavoritos,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavoritos() {
  const contexto = useContext(FavoritesContext)
  if (!contexto) {
    throw new Error("useFavoritos debe usarse dentro de un FavoritesProvider")
  }
  return contexto
}

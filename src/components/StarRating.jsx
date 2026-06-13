// Componente de estrellas para calificaciones de productos
export default function StarRating({ calificacion, reseñas, tamano = "sm" }) {
  const estrellasLlenas = Math.floor(calificacion)
  const tieneMedia = calificacion % 1 >= 0.5

  const tamanoTexto = tamano === "lg" ? "text-base" : "text-sm"
  const tamanoEstrella = tamano === "lg" ? "text-lg" : "text-sm"

  return (
    <div className={`flex items-center gap-1.5 ${tamanoTexto}`}>
      <div className={`flex ${tamanoEstrella} text-amber-400`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i}>
            {i <= estrellasLlenas
              ? "★"
              : i === estrellasLlenas + 1 && tieneMedia
                ? "★"
                : "☆"}
          </span>
        ))}
      </div>
      {reseñas !== undefined && (
        <span className="text-gray-500">({reseñas})</span>
      )}
    </div>
  )
}

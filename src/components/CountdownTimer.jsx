import { useState, useEffect } from "react"

const STORAGE_KEY = "tiendanova-oferta-fin"
const DURACION_MS = 24 * 60 * 60 * 1000 // 24 horas

// Obtener o crear la fecha de fin del contador (persistida 24h)
function obtenerFechaFin() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  if (guardado) {
    const fin = Number(guardado)
    if (fin > Date.now()) return fin
  }
  const nuevaFin = Date.now() + DURACION_MS
  localStorage.setItem(STORAGE_KEY, String(nuevaFin))
  return nuevaFin
}

function calcularTiempoRestante(fechaFin) {
  const diferencia = Math.max(0, fechaFin - Date.now())
  const horas = Math.floor(diferencia / (1000 * 60 * 60))
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000)

  return {
    horas: String(horas).padStart(2, "0"),
    minutos: String(minutos).padStart(2, "0"),
    segundos: String(segundos).padStart(2, "0"),
    terminado: diferencia === 0,
  }
}

// Contador regresivo de 24 horas para el banner de oferta
export default function CountdownTimer() {
  const [fechaFin] = useState(obtenerFechaFin)
  const [tiempo, setTiempo] = useState(() => calcularTiempoRestante(fechaFin))

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempo(calcularTiempoRestante(fechaFin))
    }, 1000)
    return () => clearInterval(intervalo)
  }, [fechaFin])

  if (tiempo.terminado) {
    return (
      <span className="font-mono text-sm font-bold sm:text-base">
        ¡Oferta finalizada!
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {[
        { valor: tiempo.horas, etiqueta: "Hrs" },
        { valor: tiempo.minutos, etiqueta: "Min" },
        { valor: tiempo.segundos, etiqueta: "Seg" },
      ].map((bloque) => (
        <div
          key={bloque.etiqueta}
          className="flex min-w-[52px] flex-col items-center rounded-lg bg-black/20 px-2 py-1.5 sm:min-w-[60px] sm:px-3"
        >
          <span className="font-mono text-lg font-bold sm:text-2xl">
            {bloque.valor}
          </span>
          <span className="text-[10px] uppercase tracking-wide opacity-80 sm:text-xs">
            {bloque.etiqueta}
          </span>
        </div>
      ))}
    </div>
  )
}

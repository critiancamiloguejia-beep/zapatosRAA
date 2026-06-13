import { ENVIO_COSTO, ENVIO_GRATIS_MINIMO } from "./constants"

// Calcula subtotal, costo de envío y total de forma unificada
export function calcularTotales(subtotal) {
  const envioGratis = subtotal >= ENVIO_GRATIS_MINIMO
  const costoEnvio = envioGratis ? 0 : ENVIO_COSTO
  const total = subtotal + costoEnvio

  return {
    subtotal,
    costoEnvio,
    envioGratis,
    total,
  }
}

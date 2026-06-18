import { MARCA, IMAGENES_LANDING, LOGO_FALLBACK_COMPACT } from "../utils/brand"
import ImagenMarca from "./ImagenMarca"

const TAMANOS = {
  principal: "h-16 w-auto sm:h-20",
  horizontal: "h-10 w-auto max-w-full sm:h-12 md:h-14",
  monograma: "h-24 w-[7.5rem] sm:h-28 sm:w-[9rem]",
}

// Logo de marca Zapatos RAA (Supabase Storage + fallback local)
export default function BrandLogo({
  variant = "principal",
  className = "",
  invert = false,
  eager = false,
}) {
  const src = MARCA.logos[variant] ?? IMAGENES_LANDING.logo

  return (
    <ImagenMarca
      src={src}
      fallback={LOGO_FALLBACK_COMPACT}
      alt={MARCA.nombre}
      className={`object-contain ${TAMANOS[variant]} ${invert ? "invert" : ""} ${className}`}
      loading={eager ? "eager" : "lazy"}
    />
  )
}

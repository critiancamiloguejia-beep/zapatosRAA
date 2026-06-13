import { MARCA } from "../utils/brand"

const TAMANOS = {
  principal: "h-16 w-auto sm:h-20",
  horizontal: "h-10 w-auto max-w-full sm:h-12 md:h-14",
  monograma: "h-24 w-[7.5rem] sm:h-28 sm:w-[9rem]",
}

// Muestra una de las tres versiones del logo RAA
export default function BrandLogo({
  variant = "principal",
  className = "",
  invert = false,
  eager = false,
}) {
  const src = MARCA.logos[variant]
  const alt =
    variant === "monograma"
      ? MARCA.nombre
      : `${MARCA.nombre} — ${MARCA.eslogan}`

  return (
    <img
      src={src}
      alt={alt}
      width={variant === "monograma" ? 144 : undefined}
      height={variant === "monograma" ? 112 : undefined}
      className={`object-contain ${TAMANOS[variant]} ${invert ? "invert" : ""} ${className}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  )
}

// Identidad visual y constantes de marca RAA
export const MARCA = {
  nombre: "RAA",
  eslogan: "Tu estilo, a tu puerta",
  logos: {
    principal: "/images/logo-principal.png",
    horizontal: "/images/logo-horizontal.png",
    monograma: "/images/logo-monograma.png",
  },
}

export const NOMBRE_TIENDA = MARCA.nombre
export const ESLOGAN = MARCA.eslogan

// Clases Tailwind — header compacto, logo principal grande en Home
export const CLASES_HEADER_MONOGRAMA =
  "!h-24 !w-[7.5rem] !max-w-none scale-[1.55] object-contain sm:!h-28 sm:!w-[9rem] sm:scale-[1.6]"
export const CLASES_HEADER_MONOGRAMA_MARCO =
  "inline-flex h-[3.25rem] w-[4rem] shrink-0 items-center justify-center overflow-hidden sm:h-[3.75rem] sm:w-[4.75rem]"
export const CLASES_HEADER_TEXTO = "text-2xl sm:text-3xl"
export const CLASES_HOME_PRINCIPAL = "!h-56 !w-auto sm:!h-64 md:!h-72"

// Identidad visual y constantes de marca Zapatos RAA
const SUPABASE_STORAGE =
  "https://eogphstlsslxbpkxrjhk.supabase.co/storage/v1/object/public/productos"

export const MARCA = {
  nombre: "Zapatos RAA",
  eslogan: "Calidad, comodidad y estilo en cada paso",
  logos: {
    principal: `${SUPABASE_STORAGE}/logo-marca.jpg`,
    horizontal: `${SUPABASE_STORAGE}/logo-marca.jpg`,
    monograma: `${SUPABASE_STORAGE}/logo-marca.jpg`,
  },
}

// Imágenes de la landing (/ofertas/:id) — solo logo-marca.jpg en Supabase
export const IMAGENES_LANDING = {
  logo: `${SUPABASE_STORAGE}/logo-marca.jpg`,
  logoFallback: "/images/marca/banner-marca.jpg",
}

// Fallback cuadrado para header compacto de la tienda
export const LOGO_FALLBACK_COMPACT = "/images/marca/logo-marca.png"

export const NOMBRE_TIENDA = MARCA.nombre
export const ESLOGAN = MARCA.eslogan

// Clases Tailwind — header compacto, logo principal grande en Home
export const CLASES_HEADER_MONOGRAMA =
  "!h-24 !w-[7.5rem] !max-w-none scale-[1.55] object-contain sm:!h-28 sm:!w-[9rem] sm:scale-[1.6]"
export const CLASES_HEADER_MONOGRAMA_MARCO =
  "inline-flex h-[3.25rem] w-[4rem] shrink-0 items-center justify-center overflow-hidden sm:h-[3.75rem] sm:w-[4.75rem]"
export const CLASES_HEADER_TEXTO = "text-2xl sm:text-3xl"
export const CLASES_HOME_PRINCIPAL = "!h-56 !w-auto sm:!h-64 md:!h-72"

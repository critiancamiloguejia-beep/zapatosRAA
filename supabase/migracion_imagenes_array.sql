-- ============================================================
-- Zapatos RAA — Hasta 8 imágenes por producto (columna array)
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS imagenes TEXT[] DEFAULT '{}';

-- Ejemplo: asignar varias imágenes a un producto (máximo 8)
-- UPDATE productos
-- SET imagenes = ARRAY[
--   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
--   'https://images.unsplash.com/photo-1518002170953-080d8d1b7c1d?w=800'
-- ]
-- WHERE id = 1;

-- Migrar la imagen única existente al array (opcional)
UPDATE productos
SET imagenes = ARRAY[imagen]
WHERE imagen IS NOT NULL
  AND imagen <> ''
  AND (imagenes IS NULL OR imagenes = '{}');

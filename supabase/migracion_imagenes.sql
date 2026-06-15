-- ============================================================
-- RAA — Múltiples imágenes por producto
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS producto_imagenes (
  id serial PRIMARY KEY,
  producto_id bigint NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  url text NOT NULL,
  orden integer NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_producto_imagenes_producto_id
  ON producto_imagenes(producto_id);

ALTER TABLE producto_imagenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "producto_imagenes_publicas" ON producto_imagenes
  FOR SELECT USING (true);

-- Ejemplo: agregar imágenes a un producto existente
-- INSERT INTO producto_imagenes (producto_id, url, orden) VALUES
--   (1, 'camiseta-1.jpg', 1),
--   (1, 'camiseta-2.jpg', 2);

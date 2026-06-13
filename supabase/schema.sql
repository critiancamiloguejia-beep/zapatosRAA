-- ============================================================
-- RAA — Esquema de base de datos Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Tabla categorias
CREATE TABLE categorias (
  id serial PRIMARY KEY,
  nombre text UNIQUE NOT NULL,
  emoji text NOT NULL,
  activa boolean DEFAULT true
);

-- Tabla productos
CREATE TABLE productos (
  id bigserial PRIMARY KEY,
  nombre text NOT NULL,
  categoria_id int REFERENCES categorias(id),
  precio integer NOT NULL,
  precio_anterior integer,
  descripcion text,
  emoji text,
  imagen text,
  destacado boolean DEFAULT false,
  badge text,
  calificacion numeric(2,1),
  resenas integer DEFAULT 0,
  stock integer DEFAULT 0,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla pedidos
CREATE TABLE pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  email text NOT NULL,
  telefono text,
  direccion text NOT NULL,
  ciudad text NOT NULL,
  subtotal integer NOT NULL,
  costo_envio integer DEFAULT 0,
  total integer NOT NULL,
  estado text DEFAULT 'pendiente',
  created_at timestamptz DEFAULT now()
);

-- Tabla pedido_items
CREATE TABLE pedido_items (
  id serial PRIMARY KEY,
  pedido_id uuid REFERENCES pedidos(id),
  producto_id bigint REFERENCES productos(id),
  nombre text NOT NULL,
  precio integer NOT NULL,
  cantidad integer NOT NULL,
  emoji text
);

-- Índices
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_destacado ON productos(destacado) WHERE activo = true;
CREATE INDEX idx_productos_nombre ON productos USING gin(to_tsvector('spanish', nombre));

-- Activar RLS
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;

-- Lectura pública de productos activos
CREATE POLICY "productos_publicos" ON productos
  FOR SELECT USING (activo = true);

-- Lectura pública de categorías activas
CREATE POLICY "categorias_publicas" ON categorias
  FOR SELECT USING (activa = true);

-- Inserción pública de pedidos (anon). Sin SELECT: el cliente genera el UUID.
CREATE POLICY "insertar_pedidos" ON pedidos
  FOR INSERT WITH CHECK (true);

-- Inserción pública de items
CREATE POLICY "insertar_items" ON pedido_items
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Supabase Storage — bucket de imágenes de productos
-- Ejecutar también en el SQL Editor si el proyecto ya existe
-- ============================================================

-- ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "imagenes_publicas" ON storage.objects
  FOR SELECT USING (bucket_id = 'productos');

CREATE POLICY "subir_imagenes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'productos');

-- ============================================================
-- TiendaNova — Datos iniciales
-- Ejecutar después de schema.sql en el SQL Editor de Supabase
-- ============================================================

-- Insertar categorías
INSERT INTO categorias (id, nombre, emoji) VALUES
  (1, 'Ropa', '👕'),
  (2, 'Calzado', '👟'),
  (3, 'Accesorios', '🎒'),
  (4, 'Hogar', '🏠'),
  (5, 'Electrónica', '📱'),
  (6, 'Deportes', '⚽')
ON CONFLICT (nombre) DO NOTHING;

-- Ajustar secuencia para que el próximo id sea 7
SELECT setval('categorias_id_seq', 6);

-- Insertar los 12 productos conservando IDs 1-12
INSERT INTO productos
  (id, nombre, categoria_id, precio, precio_anterior, descripcion, emoji, destacado, badge, calificacion, resenas, stock, activo)
OVERRIDING SYSTEM VALUE
VALUES
  (1,  'Camiseta básica',     1, 35000,  45000, 'Camiseta de algodón 100%',            '👕', true,  'Más vendido', 4.8, 124, 5,  true),
  (2,  'Tenis urbanos',       2, 120000, 150000,'Tenis cómodos para el día a día',      '👟', true,  '20% OFF',     4.6, 89,  3,  true),
  (3,  'Mochila urbana',      3, 85000,  null,  'Mochila resistente con porta laptop',  '🎒', true,  'Nuevo',       4.9, 56,  7,  true),
  (4,  'Vela aromática',      4, 18000,  null,  'Vela de soya con aroma natural',       '🕯️', false, null,          4.5, 34,  8,  true),
  (5,  'Gorra ajustable',     3, 28000,  35000, 'Gorra con cierre ajustable',           '🧢', false, '20% OFF',     4.3, 67,  4,  true),
  (6,  'Libreta premium',     4, 15000,  null,  'Libreta de 200 páginas, tapa dura',    '📓', false, null,          4.7, 45,  6,  true),
  (7,  'Audífonos BT',        5, 120000, 160000,'Audífonos inalámbricos 20h batería',   '🎧', true,  '25% OFF',     4.8, 203, 2,  true),
  (8,  'Calcetines pack x3',  1, 12000,  null,  'Pack de 3 pares de calcetines',        '🧦', false, null,          4.2, 78,  8,  true),
  (9,  'Botella térmica',     4, 45000,  55000, 'Botella acero inox 500ml',             '🍶', true,  'Más vendido', 4.9, 156, 6,  true),
  (10, 'Canguro deportivo',   3, 32000,  null,  'Canguro con cierre seguro',            '👜', false, 'Nuevo',       4.4, 23,  5,  true),
  (11, 'Camiseta deportiva',  1, 42000,  50000, 'Camiseta dry-fit para ejercicio',      '🏃', true,  '16% OFF',     4.6, 91,  3,  true),
  (12, 'Lonchera térmica',    4, 38000,  null,  'Lonchera conserva temperatura 6h',     '🧺', false, null,          4.5, 41,  7,  true);

-- Ajustar secuencia para que el próximo id sea 13
SELECT setval('productos_id_seq', 12);

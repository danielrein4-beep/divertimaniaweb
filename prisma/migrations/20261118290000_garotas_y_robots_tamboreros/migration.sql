-- Fichas nuevas «Garotas» y «Robots Tamboreros» en Personajes (Adultos), sin foto por ahora. Solo datos e idempotente.
INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_garotas', 'Personajes', 'Adultos', 1, 'Garotas', 'Garotas para tu evento.', NULL, 42, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Garotas');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_robots_tamboreros', 'Personajes', 'Adultos', 1, 'Robots Tamboreros', 'Robots tamboreros para tu evento.', NULL, 43, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Robots Tamboreros');

-- Ficha nueva «Tequileras» en Personajes (Adultos), con su video en bucle. Solo datos e idempotente.
INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_tequileras', 'Personajes', 'Adultos', 1, 'Tequileras', 'Tequileras para tu evento.', '/videos/tequileras-show.jpg', 48, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Tequileras');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_tequileras_2', "id", '/videos/tequileras-show.mp4', 'VIDEO', '/videos/tequileras-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Tequileras'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_tequileras_2');

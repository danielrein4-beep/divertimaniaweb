-- «Pelotas Boom» (las de choque) y «Pelotas Hámster» (las del agua) son servicios distintos:
-- la tarjeta existente vuelve a llamarse Pelotas Boom y se abre una nueva para las de hámster, con su video.
-- Solo datos e idempotente.
UPDATE "Servicio" SET "nombre" = 'Pelotas Boom' WHERE "nombre" = 'Pelotas Boom (Bolas de Hámster)';

UPDATE "Servicio" SET "orden" = "orden" + 1
WHERE "categoria" = 'Servicios para tu fiesta'
  AND "orden" > (SELECT "orden" FROM "Servicio" WHERE "nombre" = 'Pelotas Boom')
  AND NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "id" = 'svc_pelotas_hamster');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_pelotas_hamster', 'Servicios para tu fiesta', NULL, 1, 'Pelotas Hámster',
  'Los niños caminan y ruedan sobre el agua dentro de pelotas transparentes gigantes, en la piscina de tu fiesta.', '/videos/pelotas-hamster-show.jpg',
  (SELECT "orden" + 1 FROM "Servicio" WHERE "nombre" = 'Pelotas Boom'), 'cumpleanos'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "id" = 'svc_pelotas_hamster')
  AND EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Pelotas Boom');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_hamster', 'svc_pelotas_hamster', '/videos/pelotas-hamster-show.mp4', 'VIDEO', '/videos/pelotas-hamster-show.jpg', -10
WHERE EXISTS (SELECT 1 FROM "Servicio" WHERE "id" = 'svc_pelotas_hamster')
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_hamster');

-- Luli Pampin: portada (fotograma del video) y video en bucle. Barbie se elimina (no está en la oferta;
-- sin reservas ni referencias). Solo datos e idempotente.
UPDATE "Servicio" SET "fotoUrl" = '/videos/luli-pampin-show.jpg'
WHERE "nombre" = 'Luli Pampin' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_luli', "id", '/videos/luli-pampin-show.mp4', 'VIDEO', '/videos/luli-pampin-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Luli Pampin'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_luli');

DELETE FROM "Servicio" WHERE "nombre" = 'Barbie';

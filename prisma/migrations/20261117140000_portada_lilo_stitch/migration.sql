-- Lilo y Stitch: portada (fotograma del video) y video en bucle. Solo datos e idempotente.
UPDATE "Servicio" SET "fotoUrl" = '/videos/lilo-stitch-show.jpg'
WHERE "nombre" = 'Lilo y Stitch' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_lilo', "id", '/videos/lilo-stitch-show.mp4', 'VIDEO', '/videos/lilo-stitch-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Lilo y Stitch'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_lilo');

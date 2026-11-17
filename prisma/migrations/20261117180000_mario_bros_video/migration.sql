-- Super Mario Bros: se quitan sus fotos (portada y la de la galería) y queda un video en bucle.
-- La portada pasa a ser el fotograma del video. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "tipo" = 'FOTO' AND "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Super Mario Bros');

UPDATE "Servicio" SET "fotoUrl" = '/videos/mario-bros-show.jpg' WHERE "nombre" = 'Super Mario Bros';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_mario', "id", '/videos/mario-bros-show.mp4', 'VIDEO', '/videos/mario-bros-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Super Mario Bros'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_mario');

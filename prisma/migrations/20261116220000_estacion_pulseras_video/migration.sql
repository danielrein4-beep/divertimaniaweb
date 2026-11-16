-- Estación de Pulseras: portada (fotograma del video) y video en repetición en la tarjeta.
-- Solo datos e idempotente: si la tarjeta no existe o ya tiene el video, no hace nada.
UPDATE "Servicio" SET "fotoUrl" = '/videos/estacion-pulseras.jpg'
WHERE "nombre" = 'Estación de Pulseras' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pulseras_video', "id", '/videos/estacion-pulseras.mp4', 'VIDEO', '/videos/estacion-pulseras.jpg', 0
FROM "Servicio" WHERE "nombre" = 'Estación de Pulseras'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pulseras_video');

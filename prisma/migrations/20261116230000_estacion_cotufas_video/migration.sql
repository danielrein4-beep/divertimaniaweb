-- Estación de Cotufas: portada (fotograma del video) y video en repetición en la tarjeta.
-- El video va primero en la galería (orden -10) para que sea el que se reproduce en la tarjeta.
-- Solo datos e idempotente: si la tarjeta no existe o ya tiene el video, no hace nada.
UPDATE "Servicio" SET "fotoUrl" = '/videos/estacion-cotufas.jpg'
WHERE "nombre" = 'Estación de Cotufas' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'cotufas_video', "id", '/videos/estacion-cotufas.mp4', 'VIDEO', '/videos/estacion-cotufas.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Estación de Cotufas'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'cotufas_video');

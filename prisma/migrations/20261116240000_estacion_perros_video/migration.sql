-- Estación de Perros Calientes: portada (fotograma del video) y video en repetición en la tarjeta.
-- Solo datos e idempotente: si la tarjeta no existe o ya tiene el video, no hace nada.
UPDATE "Servicio" SET "fotoUrl" = '/videos/estacion-perros.jpg'
WHERE "nombre" = 'Estación de Perros Calientes' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'perros_video', "id", '/videos/estacion-perros.mp4', 'VIDEO', '/videos/estacion-perros.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Estación de Perros Calientes'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'perros_video');

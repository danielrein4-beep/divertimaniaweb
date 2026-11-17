-- Portada (fotograma del video) y video en bucle para Galletas, Encanto y Campanita.
-- Solo datos e idempotente: si la tarjeta no existe o ya tiene el video, no hace nada.
UPDATE "Servicio" SET "fotoUrl" = '/videos/estacion-galletas.jpg'
WHERE "nombre" = 'Estación de Galletas' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_galletas', "id", '/videos/estacion-galletas.mp4', 'VIDEO', '/videos/estacion-galletas.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Estación de Galletas'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_galletas');

UPDATE "Servicio" SET "fotoUrl" = '/videos/encanto-show.jpg'
WHERE "nombre" = 'Encanto' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_encanto', "id", '/videos/encanto-show.mp4', 'VIDEO', '/videos/encanto-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Encanto'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_encanto');

UPDATE "Servicio" SET "fotoUrl" = '/videos/campanita-show.jpg'
WHERE "nombre" = 'Campanita (Tinkerbell)' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_campanita', "id", '/videos/campanita-show.mp4', 'VIDEO', '/videos/campanita-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Campanita (Tinkerbell)'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_campanita');


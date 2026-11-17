-- Toy Story: se quitan sus fotos y quedan dos videos en bucle (primero toy-story-1, luego toy-story-2).
-- La portada pasa a ser el fotograma del primero. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "tipo" = 'FOTO' AND "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Toy Story');

UPDATE "Servicio" SET "fotoUrl" = '/videos/toy-story-1.jpg' WHERE "nombre" = 'Toy Story';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_toy', "id", '/videos/toy-story-1.mp4', 'VIDEO', '/videos/toy-story-1.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Toy Story'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_toy');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_toy_2', "id", '/videos/toy-story-2.mp4', 'VIDEO', '/videos/toy-story-2.jpg', -9
FROM "Servicio" WHERE "nombre" = 'Toy Story'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_toy_2');

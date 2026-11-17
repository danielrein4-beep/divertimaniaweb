-- Minnie Mouse: la tarjeta pasa a mostrar un solo video en bucle (se quitan su foto y videos anteriores).
-- La portada es el fotograma del video. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Minnie Mouse')
  AND "url" <> '/videos/minnie-show.mp4';

UPDATE "Servicio" SET "fotoUrl" = '/videos/minnie-show.jpg' WHERE "nombre" = 'Minnie Mouse';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_minnie', "id", '/videos/minnie-show.mp4', 'VIDEO', '/videos/minnie-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Minnie Mouse'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_minnie');

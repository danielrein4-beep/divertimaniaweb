-- Espumanía: la tarjeta pasa a mostrar un solo video en bucle (se quitan su foto y el video anterior).
-- La portada es el fotograma del video nuevo. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Espumanía')
  AND "url" <> '/videos/espumania-show.mp4';

UPDATE "Servicio" SET "fotoUrl" = '/videos/espumania-show.jpg' WHERE "nombre" = 'Espumanía';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_espumania', "id", '/videos/espumania-show.mp4', 'VIDEO', '/videos/espumania-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Espumanía'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_espumania');

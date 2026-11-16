-- Bella queda con dos shows: «Show de Bella» y «Show con la Bestia» (con su video en repetición).
-- Solo datos e idempotente: si Princesas Disney o esas variantes no existen, no hace nada.
UPDATE "Opcion"
SET "nombre" = 'Show de Bella', "fotoUrl" = '/images/bella-show.jpg', "orden" = 30
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Bella' AND "nombre" = 'Bella sola'
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

UPDATE "Opcion"
SET "nombre" = 'Show con la Bestia', "videoUrl" = '/videos/bella-bestia-show.mp4', "fotoUrl" = '/videos/bella-bestia-show.jpg', "orden" = 31
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Bella' AND "nombre" = 'Bella con la Bestia'
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

DELETE FROM "Opcion"
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Bella' AND "nombre" = 'Show de toda la película La Bella y la Bestia'
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

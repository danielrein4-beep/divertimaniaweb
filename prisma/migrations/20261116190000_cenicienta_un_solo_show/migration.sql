-- Cenicienta queda con un solo show, llamado simplemente «Cenicienta», con su video en repetición.
-- Solo datos e idempotente: si Princesas Disney o esas variantes no existen, no hace nada.
UPDATE "Opcion"
SET "nombre" = 'Cenicienta', "videoUrl" = '/videos/cenicienta.mp4', "fotoUrl" = '/videos/cenicienta.jpg', "orden" = 10
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Cenicienta' AND "nombre" = 'Cenicienta sola'
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

DELETE FROM "Opcion"
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Cenicienta'
  AND "nombre" IN ('Cenicienta con el Príncipe', 'Show de toda la película Cenicienta')
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

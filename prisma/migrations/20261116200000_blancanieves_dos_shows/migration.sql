-- Blancanieves queda con dos shows (el show y con acompañamiento), cada uno con su video en repetición,
-- y un video de primer plano en la galería de Princesas Disney. Solo datos e idempotente.
UPDATE "Opcion"
SET "nombre" = 'Show de Blancanieves', "videoUrl" = '/videos/blancanieves-show.mp4', "fotoUrl" = '/videos/blancanieves-show.jpg', "orden" = 20
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Blancanieves' AND "nombre" = 'Blancanieves sola'
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

UPDATE "Opcion"
SET "nombre" = 'Blancanieves con acompañamiento', "videoUrl" = '/videos/blancanieves-acompanada.mp4', "fotoUrl" = '/videos/blancanieves-acompanada.jpg', "orden" = 21
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Blancanieves' AND "nombre" = 'Blancanieves con el Príncipe'
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

DELETE FROM "Opcion"
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Blancanieves' AND "nombre" = 'Show de toda la película Blancanieves'
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'bln_primer_plano', "id", '/videos/blancanieves-primer-plano.mp4', 'VIDEO', '/videos/blancanieves-primer-plano.jpg', 5
FROM "Servicio" WHERE "nombre" = 'Princesas Disney'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'bln_primer_plano');

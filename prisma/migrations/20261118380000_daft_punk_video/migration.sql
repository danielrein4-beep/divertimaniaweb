-- Daft Punk: portada y video en bucle. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Daft Punk')
  AND "url" <> '/videos/daft-punk-show.mp4';

UPDATE "Servicio" SET "fotoUrl" = '/videos/daft-punk-show.jpg' WHERE "nombre" = 'Daft Punk';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_daftpunk', "id", '/videos/daft-punk-show.mp4', 'VIDEO', '/videos/daft-punk-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Daft Punk'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_daftpunk');

-- La Casa de Papel: portada y video en bucle. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'La Casa de Papel')
  AND "url" <> '/videos/casa-de-papel-show.mp4';

UPDATE "Servicio" SET "fotoUrl" = '/videos/casa-de-papel-show.jpg' WHERE "nombre" = 'La Casa de Papel';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_casapapel', "id", '/videos/casa-de-papel-show.mp4', 'VIDEO', '/videos/casa-de-papel-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'La Casa de Papel'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_casapapel');

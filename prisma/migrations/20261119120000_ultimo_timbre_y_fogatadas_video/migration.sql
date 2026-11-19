-- Último Timbre y Fogatadas: portada y video en bucle. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE ("servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Último Timbre') AND "url" <> '/videos/ultimo-timbre-show.mp4')
   OR ("servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Fogatadas') AND "url" <> '/videos/fogatadas-show.mp4');

UPDATE "Servicio" SET "fotoUrl" = '/videos/ultimo-timbre-show.jpg' WHERE "nombre" = 'Último Timbre';
UPDATE "Servicio" SET "fotoUrl" = '/videos/fogatadas-show.jpg' WHERE "nombre" = 'Fogatadas';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_ultimo_timbre', "id", '/videos/ultimo-timbre-show.mp4', 'VIDEO', '/videos/ultimo-timbre-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Último Timbre'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_ultimo_timbre');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_fogatadas', "id", '/videos/fogatadas-show.mp4', 'VIDEO', '/videos/fogatadas-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Fogatadas'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_fogatadas');

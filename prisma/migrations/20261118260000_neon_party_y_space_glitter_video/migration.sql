-- Neon Party y Space Glitter: portada (fotograma) y video en bucle. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE ("servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Neon Party') AND "url" <> '/videos/neon-party-show.mp4')
   OR ("servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Space Glitter') AND "url" <> '/videos/space-glitter-show.mp4');

UPDATE "Servicio" SET "fotoUrl" = '/videos/neon-party-show.jpg' WHERE "nombre" = 'Neon Party';
UPDATE "Servicio" SET "fotoUrl" = '/videos/space-glitter-show.jpg' WHERE "nombre" = 'Space Glitter';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_neon', "id", '/videos/neon-party-show.mp4', 'VIDEO', '/videos/neon-party-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Neon Party'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_neon');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_glitter', "id", '/videos/space-glitter-show.mp4', 'VIDEO', '/videos/space-glitter-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Space Glitter'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_glitter');

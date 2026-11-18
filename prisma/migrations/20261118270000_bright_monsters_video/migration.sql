-- Bright Monsters: portada y 3 videos en bucle, en orden. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Bright Monsters')
  AND "url" NOT IN ('/videos/bright-monsters-1.mp4', '/videos/bright-monsters-2.mp4', '/videos/bright-monsters-3.mp4');

UPDATE "Servicio" SET "fotoUrl" = '/videos/bright-monsters-1.jpg' WHERE "nombre" = 'Bright Monsters';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_bright', "id", '/videos/bright-monsters-1.mp4', 'VIDEO', '/videos/bright-monsters-1.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Bright Monsters'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_bright');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_bright_2', "id", '/videos/bright-monsters-2.mp4', 'VIDEO', '/videos/bright-monsters-2.jpg', -9
FROM "Servicio" WHERE "nombre" = 'Bright Monsters'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_bright_2');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_bright_3', "id", '/videos/bright-monsters-3.mp4', 'VIDEO', '/videos/bright-monsters-3.jpg', -8
FROM "Servicio" WHERE "nombre" = 'Bright Monsters'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_bright_3');

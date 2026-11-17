-- Portada (fotograma del video) y video en bucle para Hada, Zootopia, Show de Sonic y Minecraft.
-- Solo datos e idempotente: si la tarjeta no existe o ya tiene el video, no hace nada.
UPDATE "Servicio" SET "fotoUrl" = '/videos/hada-show.jpg'
WHERE "nombre" = 'Hada' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_hada', "id", '/videos/hada-show.mp4', 'VIDEO', '/videos/hada-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Hada'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_hada');

UPDATE "Servicio" SET "fotoUrl" = '/videos/zootopia-show.jpg'
WHERE "nombre" = 'Zootopia' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_zootopia', "id", '/videos/zootopia-show.mp4', 'VIDEO', '/videos/zootopia-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Zootopia'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_zootopia');

UPDATE "Servicio" SET "fotoUrl" = '/videos/sonic-show.jpg'
WHERE "nombre" = 'Show de Sonic' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_sonic', "id", '/videos/sonic-show.mp4', 'VIDEO', '/videos/sonic-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Show de Sonic'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_sonic');

UPDATE "Servicio" SET "fotoUrl" = '/videos/minecraft-show.jpg'
WHERE "nombre" = 'Minecraft' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_minecraft', "id", '/videos/minecraft-show.mp4', 'VIDEO', '/videos/minecraft-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Minecraft'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_minecraft');


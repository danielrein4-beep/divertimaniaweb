-- Garotas (1 video) y Robots Tamboreros (2 videos en bucle): portada y videos. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE ("servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Garotas') AND "url" <> '/videos/garotas-show.mp4')
   OR ("servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Robots Tamboreros') AND "url" NOT IN ('/videos/robots-tamboreros-1.mp4', '/videos/robots-tamboreros-2.mp4'));

UPDATE "Servicio" SET "fotoUrl" = '/videos/garotas-show.jpg' WHERE "nombre" = 'Garotas';
UPDATE "Servicio" SET "fotoUrl" = '/videos/robots-tamboreros-1.jpg' WHERE "nombre" = 'Robots Tamboreros';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_garotas', "id", '/videos/garotas-show.mp4', 'VIDEO', '/videos/garotas-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Garotas'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_garotas');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_tamboreros', "id", '/videos/robots-tamboreros-1.mp4', 'VIDEO', '/videos/robots-tamboreros-1.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Robots Tamboreros'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_tamboreros');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_tamboreros_2', "id", '/videos/robots-tamboreros-2.mp4', 'VIDEO', '/videos/robots-tamboreros-2.jpg', -9
FROM "Servicio" WHERE "nombre" = 'Robots Tamboreros'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_tamboreros_2');

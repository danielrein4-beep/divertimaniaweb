-- Diverticandy: portada (fotograma) y video en bucle. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Diverticandy')
  AND "url" <> '/videos/diverticandy-show.mp4';

UPDATE "Servicio" SET "fotoUrl" = '/videos/diverticandy-show.jpg' WHERE "nombre" = 'Diverticandy';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_diverticandy', "id", '/videos/diverticandy-show.mp4', 'VIDEO', '/videos/diverticandy-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Diverticandy'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_diverticandy');

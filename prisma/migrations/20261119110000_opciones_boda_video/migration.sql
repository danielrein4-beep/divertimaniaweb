-- Opciones para tu boda: video en bucle (en vez de foto). Solo datos e idempotente.
UPDATE "Servicio" SET "fotoUrl" = '/videos/opciones-boda-show.jpg' WHERE "nombre" = 'Opciones para tu boda';

DELETE FROM "ServicioMedia"
WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Opciones para tu boda')
  AND "url" <> '/videos/opciones-boda-show.mp4';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_opciones_boda', "id", '/videos/opciones-boda-show.mp4', 'VIDEO', '/videos/opciones-boda-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Opciones para tu boda'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_opciones_boda');

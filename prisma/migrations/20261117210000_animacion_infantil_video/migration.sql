-- Animación Infantil: la foto de la tarjeta se cambia por un video en bucle (la portada es su fotograma).
-- Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "tipo" = 'FOTO' AND "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Animación Infantil');

UPDATE "Servicio" SET "fotoUrl" = '/videos/animacion-infantil-show.jpg' WHERE "nombre" = 'Animación Infantil';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_animacion', "id", '/videos/animacion-infantil-show.mp4', 'VIDEO', '/videos/animacion-infantil-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Animación Infantil'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_animacion');

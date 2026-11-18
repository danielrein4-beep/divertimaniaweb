-- Guerreras K-Pop: portada y video en bucle. Solo datos e idempotente.
DELETE FROM "ServicioMedia"
WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Guerreras K-Pop')
  AND "url" <> '/videos/guerreras-kpop-show.mp4';

UPDATE "Servicio" SET "fotoUrl" = '/videos/guerreras-kpop-show.jpg' WHERE "nombre" = 'Guerreras K-Pop';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_kpop', "id", '/videos/guerreras-kpop-show.mp4', 'VIDEO', '/videos/guerreras-kpop-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Guerreras K-Pop'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_kpop');

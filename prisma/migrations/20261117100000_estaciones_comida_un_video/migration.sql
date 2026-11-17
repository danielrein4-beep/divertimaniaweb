-- Estaciones de Comida: un solo video por tarjeta, en bucle y sin sonido (corren solos en el catálogo).
-- Algodón de Azúcar recibe su video y portada; Cotufas deja solo el suyo (se quitan de su galería los
-- reels que no eran de cotufas; los archivos siguen en /public). Solo datos e idempotente.
UPDATE "Servicio" SET "fotoUrl" = '/videos/estacion-algodon.jpg'
WHERE "nombre" = 'Estación de Algodón de Azúcar' AND ("fotoUrl" IS NULL OR "fotoUrl" = '');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'algodon_video', "id", '/videos/estacion-algodon.mp4', 'VIDEO', '/videos/estacion-algodon.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Estación de Algodón de Azúcar'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'algodon_video');

DELETE FROM "ServicioMedia"
WHERE "url" IN ('/reels/reel-12.mp4', '/reels/reel-15.mp4')
  AND "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Estación de Cotufas');

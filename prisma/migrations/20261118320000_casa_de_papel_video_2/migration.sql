-- La Casa de Papel: segundo video en bucle, después del primero. Solo datos e idempotente.
INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_casapapel_2', "id", '/videos/casa-de-papel-show-2.mp4', 'VIDEO', '/videos/casa-de-papel-show-2.jpg', -9
FROM "Servicio" WHERE "nombre" = 'La Casa de Papel'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_casapapel_2');

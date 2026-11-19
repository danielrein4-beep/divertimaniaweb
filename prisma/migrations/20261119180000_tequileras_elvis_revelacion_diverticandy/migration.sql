-- Fichas nuevas en Personajes (Adultos): «Tequileras Biker» y «Elvis y Marilyn Monroe», con video en bucle;
-- video de Revelación de Género; video nuevo de Diverticandy. Solo datos e idempotente.
INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_tequileras_biker', 'Personajes', 'Adultos', 1, 'Tequileras Biker', 'Tequileras estilo biker para darle ritmo y brillo a tu evento.', '/videos/tequileras-biker-show.jpg', 46, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Tequileras Biker');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_elvis_marilyn', 'Personajes', 'Adultos', 1, 'Elvis y Marilyn Monroe', 'Elvis y Marilyn Monroe en persona para tu evento: fotos, baile y mucho estilo.', '/videos/elvis-marilyn-show.jpg', 47, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Elvis y Marilyn Monroe');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_tequileras', "id", '/videos/tequileras-biker-show.mp4', 'VIDEO', '/videos/tequileras-biker-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Tequileras Biker'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_tequileras');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_elvis_marilyn', "id", '/videos/elvis-marilyn-show.mp4', 'VIDEO', '/videos/elvis-marilyn-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Elvis y Marilyn Monroe'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_elvis_marilyn');

-- Revelación de Género: el video sale en la tarjeta; la portada sigue siendo la foto de la pareja.
DELETE FROM "ServicioMedia" WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Revelación de Género') AND "url" <> '/videos/revelacion-genero-show.mp4';
INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_revelacion', "id", '/videos/revelacion-genero-show.mp4', 'VIDEO', '/images/revelacion-genero.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Revelación de Género'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_revelacion');

-- Diverticandy: video nuevo (reemplaza al anterior).
UPDATE "ServicioMedia" SET "url" = '/videos/diverticandy-show-v2.mp4', "poster" = '/videos/diverticandy-show-v2.jpg' WHERE "url" = '/videos/diverticandy-show-4x5.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/diverticandy-show-v2.jpg' WHERE "fotoUrl" = '/videos/diverticandy-show-4x5.jpg';

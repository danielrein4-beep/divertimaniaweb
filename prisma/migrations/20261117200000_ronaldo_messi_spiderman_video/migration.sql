-- Dos tarjetas nuevas en Personajes Infantiles (Cristiano Ronaldo y Messi), cada una con su video en bucle,
-- y Spider-Man cambia su foto por video. Solo datos e idempotente.
INSERT INTO "Servicio" ("id", "categoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'sv_cristiano', 'Personajes Infantiles', 1, 'Cristiano Ronaldo', 'Cristiano Ronaldo en persona, para jugar fútbol con los invitados y tomarse fotos en tu fiesta.', '/videos/cristiano-ronaldo-show.jpg',
       (SELECT COALESCE(MAX("orden"), 130) + 1 FROM "Servicio" WHERE "categoria" = 'Personajes Infantiles'), 'cumpleanos'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Cristiano Ronaldo');

INSERT INTO "Servicio" ("id", "categoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'sv_messi', 'Personajes Infantiles', 1, 'Messi', 'Messi en persona, para jugar fútbol con los invitados y tomarse fotos en tu fiesta.', '/videos/messi-show.jpg',
       (SELECT COALESCE(MAX("orden"), 130) + 1 FROM "Servicio" WHERE "categoria" = 'Personajes Infantiles'), 'cumpleanos'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Messi');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_cristiano', "id", '/videos/cristiano-ronaldo-show.mp4', 'VIDEO', '/videos/cristiano-ronaldo-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Cristiano Ronaldo'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_cristiano');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_messi', "id", '/videos/messi-show.mp4', 'VIDEO', '/videos/messi-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Messi'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_messi');

DELETE FROM "ServicioMedia"
WHERE "tipo" = 'FOTO' AND "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Spider-Man');

UPDATE "Servicio" SET "fotoUrl" = '/videos/spiderman-show.jpg' WHERE "nombre" = 'Spider-Man';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_spiderman', "id", '/videos/spiderman-show.mp4', 'VIDEO', '/videos/spiderman-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Spider-Man'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_spiderman');

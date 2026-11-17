-- Mickey y Minnie en tarjetas propias dentro de Personajes: «Mickey Mouse», «Mickey y Minnie Mouse» y «Minnie Mouse»,
-- cada una con su video en bucle y el aviso de que tienen trajes temáticos (casual, Halloween, navideño, graduación).
-- «Casa de Mickey Mouse» queda como el show completo con toda la pandilla. Las variantes «solo / con» que ahora son
-- tarjetas se quitan. Solo datos e idempotente.

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "incluye", "ocasiones")
SELECT 'svc_mickey', 'Personajes', 'Infantiles', 1, 'Mickey Mouse', 'Mickey Mouse en persona para tu fiesta: baile, fotos con los invitados y el momento de la torta. Tiene distintos trajes temáticos: casual, Halloween, navideño y de graduación; dinos cuál quieres para tu fiesta.', '/videos/mickey-show.jpg', 0, 'Traje a elegir: clásico, casual, Halloween, navideño o de graduación
Baile y fotos con los invitados
Momento de la torta', 'cumpleanos,navidad,graduacion'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Mickey Mouse');

DELETE FROM "ServicioMedia" WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Mickey Mouse') AND "url" <> '/videos/mickey-show.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/mickey-show.jpg' WHERE "nombre" = 'Mickey Mouse';
INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_mickey', "id", '/videos/mickey-show.mp4', 'VIDEO', '/videos/mickey-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Mickey Mouse'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_mickey');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "incluye", "ocasiones")
SELECT 'svc_mickey_minnie', 'Personajes', 'Infantiles', 1, 'Mickey y Minnie Mouse', 'Mickey y Minnie Mouse juntos en tu fiesta: baile, fotos y el momento de la torta. Ambos tienen distintos trajes temáticos: casual, Halloween, navideño y de graduación; dinos cuáles quieres para tu fiesta.', '/videos/mickey-minnie-show.jpg', 0, 'Traje a elegir: clásico, casual, Halloween, navideño o de graduación
Baile y fotos con los invitados
Momento de la torta', 'cumpleanos,navidad,graduacion'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Mickey y Minnie Mouse');

DELETE FROM "ServicioMedia" WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Mickey y Minnie Mouse') AND "url" <> '/videos/mickey-minnie-show.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/mickey-minnie-show.jpg' WHERE "nombre" = 'Mickey y Minnie Mouse';
INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_mickey_minnie', "id", '/videos/mickey-minnie-show.mp4', 'VIDEO', '/videos/mickey-minnie-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Mickey y Minnie Mouse'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_mickey_minnie');

UPDATE "Servicio" SET "descripcion" = 'Minnie Mouse en persona para tu fiesta: baile, fotos con los invitados y el momento de la torta. Tiene distintos trajes temáticos: casual, Halloween, navideño y de graduación; dinos cuál quieres para tu fiesta.', "incluye" = 'Traje a elegir: clásico, casual, Halloween, navideño o de graduación
Baile y fotos con los invitados
Momento de la torta', "ocasiones" = 'cumpleanos,navidad,graduacion' WHERE "nombre" = 'Minnie Mouse';

DELETE FROM "Opcion" WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Minnie Mouse');
DELETE FROM "Opcion" WHERE "nombre" IN ('Mickey solo', 'Mickey con Minnie')
  AND "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Casa de Mickey Mouse');

UPDATE "Servicio" SET "orden" = 1 WHERE "nombre" = 'Princesas Disney';
UPDATE "Servicio" SET "orden" = 2 WHERE "nombre" = 'Super Mario Bros';
UPDATE "Servicio" SET "orden" = 3 WHERE "nombre" = 'Mickey Mouse';
UPDATE "Servicio" SET "orden" = 4 WHERE "nombre" = 'Mickey y Minnie Mouse';
UPDATE "Servicio" SET "orden" = 5 WHERE "nombre" = 'Minnie Mouse';
UPDATE "Servicio" SET "orden" = 6 WHERE "nombre" = 'Casa de Mickey Mouse';
UPDATE "Servicio" SET "orden" = 7 WHERE "nombre" = 'Show de Superhéroes';
UPDATE "Servicio" SET "orden" = 8 WHERE "nombre" = 'Encanto';
UPDATE "Servicio" SET "orden" = 9 WHERE "nombre" = 'Campanita (Tinkerbell)';
UPDATE "Servicio" SET "orden" = 10 WHERE "nombre" = 'Hada';
UPDATE "Servicio" SET "orden" = 11 WHERE "nombre" = 'Lilo y Stitch';
UPDATE "Servicio" SET "orden" = 12 WHERE "nombre" = 'Zootopia';
UPDATE "Servicio" SET "orden" = 13 WHERE "nombre" = 'Toy Story';
UPDATE "Servicio" SET "orden" = 14 WHERE "nombre" = 'Spider-Man';
UPDATE "Servicio" SET "orden" = 15 WHERE "nombre" = 'La Mujer Maravilla';
UPDATE "Servicio" SET "orden" = 16 WHERE "nombre" = 'Show de Paw Patrol';
UPDATE "Servicio" SET "orden" = 17 WHERE "nombre" = 'Peppa y George';
UPDATE "Servicio" SET "orden" = 18 WHERE "nombre" = 'Plim Plim';
UPDATE "Servicio" SET "orden" = 19 WHERE "nombre" = 'Show Granja de Zenón';
UPDATE "Servicio" SET "orden" = 20 WHERE "nombre" = 'Blippi';
UPDATE "Servicio" SET "orden" = 21 WHERE "nombre" = 'Muñecas LOL';
UPDATE "Servicio" SET "orden" = 22 WHERE "nombre" = 'Show de Sonic';
UPDATE "Servicio" SET "orden" = 23 WHERE "nombre" = 'Minecraft';
UPDATE "Servicio" SET "orden" = 24 WHERE "nombre" = 'Messi';
UPDATE "Servicio" SET "orden" = 25 WHERE "nombre" = 'Cristiano Ronaldo';
UPDATE "Servicio" SET "orden" = 26 WHERE "nombre" = 'Luli Pampin';
UPDATE "Servicio" SET "orden" = 27 WHERE "nombre" = 'Conejo de Pascua';
UPDATE "Servicio" SET "orden" = 28 WHERE "nombre" = 'Bolas Disco';
UPDATE "Servicio" SET "orden" = 29 WHERE "nombre" = 'Show LED';
UPDATE "Servicio" SET "orden" = 30 WHERE "nombre" = 'Show según temática';
UPDATE "Servicio" SET "orden" = 31 WHERE "nombre" = 'El Chacal de la Trompeta';

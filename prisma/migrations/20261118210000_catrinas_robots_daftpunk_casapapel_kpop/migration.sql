-- Fichas nuevas en Personajes, por ahora sin foto ni video: Guerreras K-Pop (no existía), Catrinas, Robots, Daft Punk y La Casa de Papel.
-- Solo datos e idempotente.

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_guerreras_kpop', 'Personajes', 'Infantiles', 1, 'Guerreras K-Pop', 'Guerreras K-Pop para tu fiesta.', NULL, 0, 'cumpleanos'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Guerreras K-Pop');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_catrinas', 'Personajes', 'Adultos', 1, 'Catrinas', 'Catrinas para tu fiesta.', NULL, 0, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Catrinas');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_robots', 'Personajes', 'Adultos', 1, 'Robots', 'Robots para tu fiesta.', NULL, 0, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Robots');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_daft_punk', 'Personajes', 'Adultos', 1, 'Daft Punk', 'Daft Punk para tu fiesta.', NULL, 0, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Daft Punk');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_casa_de_papel', 'Personajes', 'Adultos', 1, 'La Casa de Papel', 'La Casa de Papel para tu fiesta.', NULL, 0, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'La Casa de Papel');

UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 1 WHERE "nombre" = 'Princesas Disney';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 2 WHERE "nombre" = 'Super Mario Bros';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 3 WHERE "nombre" = 'Mickey Mouse';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 4 WHERE "nombre" = 'Mickey y Minnie Mouse';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 5 WHERE "nombre" = 'Minnie Mouse';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 6 WHERE "nombre" = 'Casa de Mickey Mouse';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 7 WHERE "nombre" = 'Show de Superhéroes';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 8 WHERE "nombre" = 'Encanto';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 9 WHERE "nombre" = 'Campanita (Tinkerbell)';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 10 WHERE "nombre" = 'Hada';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 11 WHERE "nombre" = 'Lilo y Stitch';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 12 WHERE "nombre" = 'Zootopia';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 13 WHERE "nombre" = 'Toy Story';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 14 WHERE "nombre" = 'Spider-Man';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 15 WHERE "nombre" = 'La Mujer Maravilla';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 16 WHERE "nombre" = 'Show de Paw Patrol';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 17 WHERE "nombre" = 'Peppa y George';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 18 WHERE "nombre" = 'Plim Plim';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 19 WHERE "nombre" = 'Show Granja de Zenón';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 20 WHERE "nombre" = 'Blippi';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 21 WHERE "nombre" = 'Muñecas LOL';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 22 WHERE "nombre" = 'Show de Sonic';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 23 WHERE "nombre" = 'Minecraft';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 24 WHERE "nombre" = 'Messi';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 25 WHERE "nombre" = 'Cristiano Ronaldo';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 26 WHERE "nombre" = 'Luli Pampin';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 27 WHERE "nombre" = 'Conejo de Pascua';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 28 WHERE "nombre" = 'Bright Monsters';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 29 WHERE "nombre" = 'Diverticandy';
UPDATE "Servicio" SET "subcategoria" = 'Infantiles', "orden" = 30 WHERE "nombre" = 'Guerreras K-Pop';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 31 WHERE "nombre" = 'Bolas Disco';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 32 WHERE "nombre" = 'Show LED';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 33 WHERE "nombre" = 'Show según temática';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 34 WHERE "nombre" = 'El Chacal de la Trompeta';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 35 WHERE "nombre" = 'Neon Party';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 36 WHERE "nombre" = 'Space Glitter';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 37 WHERE "nombre" = 'Catrinas';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 38 WHERE "nombre" = 'Robots';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 39 WHERE "nombre" = 'Daft Punk';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 40 WHERE "nombre" = 'La Casa de Papel';

-- Fichas nuevas en Personajes, por ahora sin foto ni video (quedan en la lista de pendientes): Neon Party, Bright Monsters y Diverticandi.
-- Solo datos e idempotente.

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_neon_party', 'Personajes', 'Infantiles', 1, 'Neon Party', 'Neon Party para tu fiesta.', NULL, 0, 'cumpleanos'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Neon Party');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_bright_monsters', 'Personajes', 'Infantiles', 1, 'Bright Monsters', 'Monstruos brillantes en cuatro colores: uno plateado, uno dorado, uno azul y uno morado.', NULL, 0, 'cumpleanos'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Bright Monsters');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_diverticandi', 'Personajes', 'Infantiles', 1, 'Diverticandi', 'Diverticandi para tu fiesta.', NULL, 0, 'cumpleanos'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Diverticandi');

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
UPDATE "Servicio" SET "orden" = 28 WHERE "nombre" = 'Neon Party';
UPDATE "Servicio" SET "orden" = 29 WHERE "nombre" = 'Bright Monsters';
UPDATE "Servicio" SET "orden" = 30 WHERE "nombre" = 'Diverticandi';
UPDATE "Servicio" SET "orden" = 31 WHERE "nombre" = 'Bolas Disco';
UPDATE "Servicio" SET "orden" = 32 WHERE "nombre" = 'Show LED';
UPDATE "Servicio" SET "orden" = 33 WHERE "nombre" = 'Show según temática';
UPDATE "Servicio" SET "orden" = 34 WHERE "nombre" = 'El Chacal de la Trompeta';

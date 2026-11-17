-- Textos de Neon Party y Diverticandy (el nombre lleva «y» al final) y ficha nueva Space Glitter (sin foto ni video por ahora).
-- Neon Party y Space Glitter son para eventos de adultos/corporativos: van en el grupo «Adultos» de Personajes. Solo datos e idempotente.
UPDATE "Servicio" SET "nombre" = 'Diverticandy', "descripcion" = 'Diverticandy acompaña a tus niños durante toda la fiesta y les da los mejores caramelos. ¡Diversión y dulzura en un solo show!' WHERE "nombre" IN ('Diverticandi', 'Diverticandy');
UPDATE "Servicio" SET "descripcion" = 'La diversión más vibrante y brillante para cualquier evento corporativo o evento de adultos.', "subcategoria" = 'Adultos', "ocasiones" = 'corporativo' WHERE "nombre" = 'Neon Party';

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_space_glitter', 'Personajes', 'Adultos', 1, 'Space Glitter', 'Space Glitter son nuestras chicas que van a tu evento y le llenan de brillo la noche.', NULL, 0, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Space Glitter');

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
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 30 WHERE "nombre" = 'Bolas Disco';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 31 WHERE "nombre" = 'Show LED';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 32 WHERE "nombre" = 'Show según temática';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 33 WHERE "nombre" = 'El Chacal de la Trompeta';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 34 WHERE "nombre" = 'Neon Party';
UPDATE "Servicio" SET "subcategoria" = 'Adultos', "orden" = 35 WHERE "nombre" = 'Space Glitter';

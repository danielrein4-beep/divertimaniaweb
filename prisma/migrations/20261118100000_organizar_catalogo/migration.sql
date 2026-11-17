-- Catálogo en 3 secciones: Personajes · Servicios para tu fiesta · Celebraciones (más "Todo").
-- Personajes junta los infantiles y los de adultos (campo nuevo "subcategoria" para separarlos);
-- Baby Shower pasa a Celebraciones. Solo datos más una columna nueva; idempotente.
-- La lista maestra está en prisma/organizacion.ts (el seed la vuelve a aplicar).

ALTER TABLE "Servicio" ADD COLUMN "subcategoria" TEXT;

UPDATE "Categoria" SET "nombre" = 'Personajes', "color" = '#00e5ff', "orden" = 0 WHERE "nombre" = 'Personajes Infantiles';
UPDATE "Categoria" SET "nombre" = 'Servicios para tu fiesta', "color" = '#a8ff30', "orden" = 1 WHERE "nombre" = 'Fiestas Infantiles';
UPDATE "Categoria" SET "nombre" = 'Celebraciones', "color" = '#ff4fd8', "orden" = 2 WHERE "nombre" = 'Baby Shower';
DELETE FROM "Categoria" WHERE "nombre" NOT IN ('Personajes', 'Servicios para tu fiesta', 'Celebraciones');

UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 1 WHERE "nombre" = 'Princesas Disney';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 2 WHERE "nombre" = 'Super Mario Bros';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 3 WHERE "nombre" = 'Casa de Mickey Mouse';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 4 WHERE "nombre" = 'Show de Superhéroes';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 5 WHERE "nombre" = 'Encanto';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 6 WHERE "nombre" = 'Campanita (Tinkerbell)';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 7 WHERE "nombre" = 'Hada';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 8 WHERE "nombre" = 'Lilo y Stitch';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 9 WHERE "nombre" = 'Zootopia';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 10 WHERE "nombre" = 'Minnie Mouse';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 11 WHERE "nombre" = 'Toy Story';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 12 WHERE "nombre" = 'Spider-Man';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 13 WHERE "nombre" = 'La Mujer Maravilla';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 14 WHERE "nombre" = 'Show de Paw Patrol';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 15 WHERE "nombre" = 'Peppa y George';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 16 WHERE "nombre" = 'Plim Plim';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 17 WHERE "nombre" = 'Show Granja de Zenón';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 18 WHERE "nombre" = 'Blippi';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 19 WHERE "nombre" = 'Muñecas LOL';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 20 WHERE "nombre" = 'Show de Sonic';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 21 WHERE "nombre" = 'Minecraft';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 22 WHERE "nombre" = 'Messi';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 23 WHERE "nombre" = 'Cristiano Ronaldo';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 24 WHERE "nombre" = 'Luli Pampin';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Infantiles', "orden" = 25 WHERE "nombre" = 'Conejo de Pascua';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Adultos', "orden" = 26 WHERE "nombre" = 'Bolas Disco';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Adultos', "orden" = 27 WHERE "nombre" = 'Show LED';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Adultos', "orden" = 28 WHERE "nombre" = 'Show según temática';
UPDATE "Servicio" SET "categoria" = 'Personajes', "subcategoria" = 'Adultos', "orden" = 29 WHERE "nombre" = 'El Chacal de la Trompeta';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 1 WHERE "nombre" = 'Animación Infantil';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 2 WHERE "nombre" = 'Espumanía';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 3 WHERE "nombre" = 'Día de Piscina Infantil';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 4 WHERE "nombre" = 'Diverti Artistas';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 5 WHERE "nombre" = 'Pelotas Boom (Bolas de Hámster)';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 6 WHERE "nombre" = 'Castillos Inflables';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 7 WHERE "nombre" = 'Estación Creativa';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 8 WHERE "nombre" = 'Estación de Pulseras';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 9 WHERE "nombre" = 'Estación de Galletas';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 10 WHERE "nombre" = 'Estación de Cotufas';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 11 WHERE "nombre" = 'Estación de Algodón de Azúcar';
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 12 WHERE "nombre" = 'Estación de Perros Calientes';
UPDATE "Servicio" SET "categoria" = 'Celebraciones', "subcategoria" = NULL, "orden" = 1 WHERE "nombre" = 'Baby Shower o Revelación de Género';

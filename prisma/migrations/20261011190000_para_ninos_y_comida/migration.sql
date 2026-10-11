-- Nuevas secciones del catálogo: "Para Niños" (antes Atracciones, más las estaciones creativas)
-- y "Estaciones de Comida" (antes Estación Creativa), y el nuevo orden de las secciones.
UPDATE "Servicio" SET "categoria" = 'Estaciones de Comida' WHERE "nombre" = 'Carritos de Comida';
UPDATE "Servicio" SET "categoria" = 'Para Niños' WHERE "categoria" IN ('Atracciones', 'Estación Creativa');
UPDATE "Categoria" SET "nombre" = 'Para Niños' WHERE "nombre" = 'Atracciones';
UPDATE "Categoria" SET "nombre" = 'Estaciones de Comida' WHERE "nombre" = 'Estación Creativa';
UPDATE "Categoria" SET "orden" = 0 WHERE "nombre" = 'Fiestas Infantiles';
UPDATE "Categoria" SET "orden" = 1 WHERE "nombre" = 'Para Niños';
UPDATE "Categoria" SET "orden" = 2 WHERE "nombre" = 'Baby Shower';
UPDATE "Categoria" SET "orden" = 3 WHERE "nombre" = 'Personajes Infantiles';
UPDATE "Categoria" SET "orden" = 4 WHERE "nombre" = 'Show para Adultos';
UPDATE "Categoria" SET "orden" = 5 WHERE "nombre" = 'Estaciones de Comida';

-- Fotos reales del show de Toy Story (Buzz, Woody y Jesse en el cumpleaños de Dylan).
-- La horizontal pasa a ser la portada; la vertical y la de antes quedan en la galería de la ficha.
-- Solo datos: si el servicio no existe o ya tiene estas fotos, no hace nada.
UPDATE "Servicio" SET "fotoUrl" = '/images/toy-story-dylan.jpg' WHERE "nombre" = 'Toy Story';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "orden")
SELECT 'toy_story_dylan_vertical', "id", '/images/toy-story-dylan-vertical.jpg', 'FOTO', 1
FROM "Servicio" WHERE "nombre" = 'Toy Story'
AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'toy_story_dylan_vertical');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "orden")
SELECT 'toy_story_buzz_anterior', "id", '/images/toy-story-buzz.jpg', 'FOTO', 2
FROM "Servicio" WHERE "nombre" = 'Toy Story'
AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "servicioId" = "Servicio"."id" AND "url" = '/images/toy-story-buzz.jpg');

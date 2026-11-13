-- Las 3 fotos de portada que eran de baja resolución vuelven mejoradas (más grandes, sin ruido, más nítidas).
-- Los archivos nuevos terminan en -hd.jpg; se cambian todas las referencias y se devuelven a las galerías.
UPDATE "Servicio" SET "fotoUrl" = '/images/mickey-navidad-show-hd.jpg' WHERE "fotoUrl" = '/images/mickey-navidad-show.png';
UPDATE "Opcion" SET "fotoUrl" = '/images/mickey-navidad-show-hd.jpg' WHERE "fotoUrl" = '/images/mickey-navidad-show.png';
UPDATE "Servicio" SET "fotoUrl" = '/images/bella-y-bestia-hd.jpg' WHERE "fotoUrl" = '/images/bella-y-bestia.png';
UPDATE "Opcion" SET "fotoUrl" = '/images/bella-y-bestia-hd.jpg' WHERE "fotoUrl" = '/images/bella-y-bestia.png';
UPDATE "Servicio" SET "fotoUrl" = '/images/rapunzel-cumpleanos-hd.jpg' WHERE "fotoUrl" = '/images/rapunzel-cumpleanos.png';
UPDATE "Opcion" SET "fotoUrl" = '/images/rapunzel-cumpleanos-hd.jpg' WHERE "fotoUrl" = '/images/rapunzel-cumpleanos.png';

INSERT INTO "ServicioMedia" ("id","servicioId","url","tipo","orden")
SELECT 'hd_mickey_navidad_show', "id", '/images/mickey-navidad-show-hd.jpg', 'FOTO', 2 FROM "Servicio"
WHERE "nombre" = 'Casa de Mickey Mouse' AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "url" = '/images/mickey-navidad-show-hd.jpg' AND "servicioId" = "Servicio"."id");
INSERT INTO "ServicioMedia" ("id","servicioId","url","tipo","orden")
SELECT 'hd_bella_y_bestia', "id", '/images/bella-y-bestia-hd.jpg', 'FOTO', 0 FROM "Servicio"
WHERE "nombre" = 'Princesas Disney' AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "url" = '/images/bella-y-bestia-hd.jpg' AND "servicioId" = "Servicio"."id");
INSERT INTO "ServicioMedia" ("id","servicioId","url","tipo","orden")
SELECT 'hd_rapunzel_cumpleanos', "id", '/images/rapunzel-cumpleanos-hd.jpg', 'FOTO', 2 FROM "Servicio"
WHERE "nombre" = 'Princesas Disney' AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "url" = '/images/rapunzel-cumpleanos-hd.jpg' AND "servicioId" = "Servicio"."id");

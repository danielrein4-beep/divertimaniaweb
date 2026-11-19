-- Mejores portadas (Encanto, Cenicienta, Bailarinas Árabes, Garotas, Robots Tamboreros), Blippi y Revelación de Género centrados,
-- Pascua con el muñeco menos grande, servicios de 2.5 y 3 horas pasan a 4 horas, sin las dinámicas de Baby Shower,
-- y fichas nuevas Fogatadas y Último Timbre. Solo datos e idempotente.
UPDATE "Servicio" SET "fotoUrl" = '/videos/encanto-show-v2.jpg' WHERE "nombre" = 'Encanto';
UPDATE "ServicioMedia" SET "poster" = '/videos/encanto-show-v2.jpg' WHERE "url" = '/videos/encanto-show.mp4';

UPDATE "Opcion" SET "fotoUrl" = '/videos/cenicienta-v2.jpg' WHERE "nombre" = 'Show de Cenicienta';

UPDATE "Servicio" SET "fotoUrl" = '/images/blippi-centrado.jpg' WHERE "nombre" = 'Blippi';
UPDATE "Servicio" SET "fotoUrl" = '/images/revelacion-genero.jpg' WHERE "nombre" = 'Revelación de Género';

UPDATE "Servicio" SET "fotoUrl" = '/videos/bailarinas-arabes-show-v2.jpg' WHERE "nombre" = 'Bailarinas Árabes';
UPDATE "ServicioMedia" SET "poster" = '/videos/bailarinas-arabes-show-v2.jpg' WHERE "url" = '/videos/bailarinas-arabes-show.mp4';

UPDATE "Servicio" SET "fotoUrl" = '/videos/garotas-show-v2.jpg' WHERE "nombre" = 'Garotas';
UPDATE "ServicioMedia" SET "poster" = '/videos/garotas-show-v2.jpg' WHERE "url" = '/videos/garotas-show.mp4';

UPDATE "Servicio" SET "fotoUrl" = '/videos/robots-tamboreros-v2.jpg' WHERE "nombre" = 'Robots Tamboreros';
UPDATE "ServicioMedia" SET "orden" = -10 WHERE "url" = '/videos/robots-tamboreros-2.mp4';
UPDATE "ServicioMedia" SET "orden" = -9 WHERE "url" = '/videos/robots-tamboreros-1.mp4';

UPDATE "ServicioMedia" SET "url" = '/videos/personajes-pascua-show-v3.mp4', "poster" = '/videos/personajes-pascua-show-v3.jpg' WHERE "url" = '/videos/personajes-pascua-show-v2.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/personajes-pascua-show-v3.jpg' WHERE "fotoUrl" = '/videos/personajes-pascua-show-v2.jpg';

UPDATE "Servicio" SET "duracion" = '4 horas' WHERE "duracion" IN ('3 horas', '2.5 horas');

DELETE FROM "Opcion" WHERE "tipo" = 'DINAMICA';

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_fogatadas', 'Celebraciones', NULL, 1, 'Fogatadas', 'Fogatadas para tu celebración. Cuéntanos la fecha y el lugar y te cotizamos.', NULL, 3, 'cumpleanos'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Fogatadas');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_ultimo_timbre', 'Celebraciones', NULL, 1, 'Último Timbre', 'Celebración de Último Timbre para despedir el año escolar. Cuéntanos la fecha y el colegio y te cotizamos.', NULL, 4, 'graduacion'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Último Timbre');

-- Todas las princesas dentro de «Princesas Disney», una pestaña por princesa con sus shows; las tarjetas
-- sueltas (Cenicienta, Blancanieves, Bella y la Bestia, Rapunzel, Ariel, Elsa) se ocultan del catálogo
-- (activo = 0, no se borran) para dejar ese espacio a los demás personajes.
-- Solo datos e idempotente: si algo no existe o ya se movió, no hace nada.
-- Orden de las pestañas: Rapunzel (0), Cenicienta (10), Blancanieves (20), Bella (30), Ariel (40), Elsa (50).

-- 1) Cenicienta, Blancanieves y Ariel: sus shows pasan tal cual; sin foto propia usan la de su tarjeta.
INSERT INTO "Opcion" ("id", "servicioId", "tipo", "grupo", "nombre", "descripcion", "videoUrl", "fotoUrl", "orden")
SELECT 'pd_' || o."id",
       (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1),
       'VARIANTE', s."nombre", o."nombre", o."descripcion", o."videoUrl", COALESCE(o."fotoUrl", s."fotoUrl"),
       (CASE s."nombre" WHEN 'Cenicienta' THEN 10 WHEN 'Blancanieves' THEN 20 ELSE 40 END) + o."orden"
FROM "Opcion" o JOIN "Servicio" s ON s."id" = o."servicioId"
WHERE s."categoria" = 'Personajes Infantiles' AND s."nombre" IN ('Cenicienta', 'Blancanieves', 'Ariel')
  AND o."tipo" = 'VARIANTE'
  AND EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Princesas Disney')
  AND NOT EXISTS (SELECT 1 FROM "Opcion" x WHERE x."id" = 'pd_' || o."id");

-- 2) Bella: «Bella sola» y el show de la película vienen de su tarjeta; «Bella y Bestia» ya estaba y se renombra.
INSERT INTO "Opcion" ("id", "servicioId", "tipo", "grupo", "nombre", "descripcion", "videoUrl", "fotoUrl", "orden")
SELECT 'pd_' || o."id",
       (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1),
       'VARIANTE', 'Bella', o."nombre", o."descripcion", o."videoUrl", COALESCE(o."fotoUrl", s."fotoUrl"), 30 + o."orden"
FROM "Opcion" o JOIN "Servicio" s ON s."id" = o."servicioId"
WHERE s."categoria" = 'Personajes Infantiles' AND s."nombre" = 'Bella y la Bestia'
  AND o."tipo" = 'VARIANTE' AND o."nombre" <> 'Bella con la Bestia'
  AND EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Princesas Disney')
  AND NOT EXISTS (SELECT 1 FROM "Opcion" x WHERE x."id" = 'pd_' || o."id");

UPDATE "Opcion" SET "nombre" = 'Bella con la Bestia', "orden" = 31
WHERE "grupo" = 'Bella' AND "nombre" = 'Bella y Bestia'
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

-- 3) Elsa: se suma el show de toda la película Frozen a los tres que ya estaban.
INSERT INTO "Opcion" ("id", "servicioId", "tipo", "grupo", "nombre", "descripcion", "videoUrl", "fotoUrl", "orden")
SELECT 'pd_' || o."id",
       (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1),
       'VARIANTE', 'Elsa (Frozen)', o."nombre", o."descripcion", o."videoUrl", COALESCE(o."fotoUrl", s."fotoUrl"), 53
FROM "Opcion" o JOIN "Servicio" s ON s."id" = o."servicioId"
WHERE s."categoria" = 'Personajes Infantiles' AND s."nombre" = 'Elsa'
  AND o."tipo" = 'VARIANTE' AND o."nombre" LIKE 'Show de toda la película%'
  AND EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Princesas Disney')
  AND NOT EXISTS (SELECT 1 FROM "Opcion" x WHERE x."id" = 'pd_' || o."id");

UPDATE "Opcion" SET "orden" = CASE "nombre" WHEN 'Elsa sola' THEN 50 WHEN 'Elsa y Anna' THEN 51 ELSE 52 END
WHERE "grupo" = 'Elsa (Frozen)' AND "nombre" IN ('Elsa sola', 'Elsa y Anna', 'Elsa, Anna y Olaf')
  AND "servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

-- 4) Las fotos de las tarjetas sueltas se suman a la galería de Princesas Disney (sin repetir).
INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pdm_' || m."id", (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1),
       m."url", m."tipo", m."poster", 100 + m."orden"
FROM "ServicioMedia" m JOIN "Servicio" s ON s."id" = m."servicioId"
WHERE s."categoria" = 'Personajes Infantiles'
  AND s."nombre" IN ('Cenicienta', 'Blancanieves', 'Bella y la Bestia', 'Rapunzel', 'Ariel', 'Elsa')
  AND EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Princesas Disney')
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" y
                  WHERE y."url" = m."url"
                    AND y."servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1));

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pdf_' || s."id", (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1),
       s."fotoUrl", 'FOTO', NULL, 90
FROM "Servicio" s
WHERE s."categoria" = 'Personajes Infantiles' AND s."fotoUrl" IS NOT NULL
  AND s."nombre" IN ('Cenicienta', 'Blancanieves', 'Bella y la Bestia', 'Rapunzel', 'Ariel', 'Elsa')
  AND EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Princesas Disney')
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" y
                  WHERE y."url" = s."fotoUrl"
                    AND y."servicioId" = (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1))
  AND s."fotoUrl" <> (SELECT COALESCE("fotoUrl", '') FROM "Servicio" WHERE "nombre" = 'Princesas Disney' LIMIT 1);

-- 5) Se ocultan las tarjetas sueltas (solo si Princesas Disney existe para recibirlas).
UPDATE "Servicio" SET "activo" = 0
WHERE "categoria" = 'Personajes Infantiles'
  AND "nombre" IN ('Cenicienta', 'Blancanieves', 'Bella y la Bestia', 'Rapunzel', 'Ariel', 'Elsa')
  AND EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Princesas Disney');

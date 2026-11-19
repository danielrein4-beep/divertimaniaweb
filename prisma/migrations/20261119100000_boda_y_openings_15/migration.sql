-- Fichas nuevas en Celebraciones: «Opciones para tu boda» y «Openings para tus 15 años». Solo datos e idempotente.
INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_opciones_boda', 'Celebraciones', NULL, 1, 'Opciones para tu boda', 'Opciones para tu boda: te armamos la propuesta según tu fecha, el lugar y lo que quieras para tu gran día.', '/images/boda-portada.jpg', 3, 'boda'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Opciones para tu boda');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_openings_15', 'Celebraciones', NULL, 1, 'Openings para tus 15 años', 'Openings para tus 15 años: la entrada que tu quinceañera merece. Cuéntanos la fecha y la temática y te cotizamos.', '/images/quince-portada.jpg', 4, 'quince'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Openings para tus 15 años');

UPDATE "Servicio" SET "orden" = 5 WHERE "nombre" = 'Fogatadas';
UPDATE "Servicio" SET "orden" = 6 WHERE "nombre" = 'Último Timbre';

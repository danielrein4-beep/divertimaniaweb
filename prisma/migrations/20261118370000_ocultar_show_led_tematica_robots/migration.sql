-- Se quitan del sitio (ocultas, sin borrarlas): Show LED, Show según temática y Robots. Solo datos e idempotente.
UPDATE "Servicio" SET "activo" = 0 WHERE "nombre" IN ('Show LED', 'Show según temática', 'Robots');

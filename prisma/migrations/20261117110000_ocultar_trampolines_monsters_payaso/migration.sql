-- Se quitan del sitio (ocultas, sin borrarlas): Trampolines, Monsters Inc. y El Payaso (no tenían foto).
-- Solo datos e idempotente.
UPDATE "Servicio" SET "activo" = 0 WHERE "nombre" IN ('Trampolines', 'Monsters Inc.', 'El Payaso');

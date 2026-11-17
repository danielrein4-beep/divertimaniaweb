-- «Estación Creativa» y «Diverti Artistas» eran la misma tarjeta (misma foto): queda solo Diverti Artistas.
-- Idempotente: si la tarjeta ya no existe, no hace nada.
DELETE FROM "EventoServicio" WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Estación Creativa');
DELETE FROM "Opcion" WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Estación Creativa');
DELETE FROM "ServicioMedia" WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Estación Creativa');
UPDATE "Servicio"
SET "combinaCon" = NULLIF(TRIM(REPLACE(',' || "combinaCon" || ',', ',' || (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Estación Creativa') || ',', ','), ','), '')
WHERE "combinaCon" IS NOT NULL AND EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Estación Creativa');
DELETE FROM "Servicio" WHERE "nombre" = 'Estación Creativa';

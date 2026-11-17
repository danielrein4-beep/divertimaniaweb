-- Se elimina el servicio «Oso Cariñoso» (no existe en la oferta). Primero se quita de las sugerencias
-- «combina con» de otras fichas y luego se borra (sus variantes y medios caen en cascada). Idempotente.
UPDATE "Servicio"
SET "combinaCon" = NULLIF(trim(replace(',' || "combinaCon" || ',', ',' || (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Oso Cariñoso') || ',', ','), ','), '')
WHERE EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Oso Cariñoso')
  AND "combinaCon" LIKE '%' || (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Oso Cariñoso') || '%';

DELETE FROM "Servicio" WHERE "nombre" = 'Oso Cariñoso';

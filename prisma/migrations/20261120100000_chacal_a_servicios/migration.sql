-- El Chacal de la Trompeta pasa de Personajes (Adultos) a Servicios para tu fiesta, después de Castillos Inflables. Solo datos e idempotente.
UPDATE "Servicio" SET "categoria" = 'Servicios para tu fiesta', "subcategoria" = NULL, "orden" = 8 WHERE "nombre" = 'El Chacal de la Trompeta';

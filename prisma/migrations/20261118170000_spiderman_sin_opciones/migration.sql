-- Spider-Man es un solo personaje: sin variantes, la tarjeta muestra "Agregar" directo. Solo datos e idempotente.
DELETE FROM "Opcion" WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Spider-Man');

-- Por ahora solo «Princesas Disney» tiene variantes; las demás fichas muestran únicamente «Agregar».
-- No toca las dinámicas de Baby Shower (son otro tipo de opción). Solo datos e idempotente.
DELETE FROM "Opcion"
WHERE "tipo" = 'VARIANTE'
  AND "servicioId" NOT IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Princesas Disney');

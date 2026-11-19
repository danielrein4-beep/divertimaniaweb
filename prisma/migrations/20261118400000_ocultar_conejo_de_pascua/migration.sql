-- Se quita del sitio (oculta, sin borrarla): Conejo de Pascua, reemplazada por «Personajes de Pascua». Solo datos e idempotente.
UPDATE "Servicio" SET "activo" = 0 WHERE "nombre" = 'Conejo de Pascua';

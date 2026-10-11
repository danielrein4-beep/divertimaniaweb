-- La sección "Personajes" pasa a llamarse "Personajes Infantiles".
UPDATE "Categoria" SET "nombre" = 'Personajes Infantiles' WHERE "nombre" = 'Personajes';
UPDATE "Servicio" SET "categoria" = 'Personajes Infantiles' WHERE "categoria" = 'Personajes';

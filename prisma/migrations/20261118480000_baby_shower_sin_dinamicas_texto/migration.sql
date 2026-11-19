-- Baby Shower y Revelación de Género: sin la línea de «7+ dinámicas» (esas dinámicas no existen). Solo datos e idempotente.
UPDATE "Servicio" SET "incluye" = REPLACE("incluye", 'Selección de 7+ dinámicas interactivas y emotivas' || char(10), '')
WHERE "nombre" IN ('Baby Shower', 'Revelación de Género');
UPDATE "Servicio" SET "incluye" = REPLACE("incluye", 'Juegos y dinámicas mientras llega el gran momento', 'Juegos con los invitados mientras llega el gran momento')
WHERE "nombre" = 'Revelación de Género';

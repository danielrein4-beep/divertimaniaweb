-- Video real de Rapunzel bailando con su sartén como portada de la variante «Rapunzel sola».
-- Solo datos: si la variante no existe, no hace nada.
UPDATE "Opcion"
SET "videoUrl" = '/videos/rapunzel-sola.mp4', "fotoUrl" = '/videos/rapunzel-sola.jpg'
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Rapunzel' AND "nombre" = 'Rapunzel sola';

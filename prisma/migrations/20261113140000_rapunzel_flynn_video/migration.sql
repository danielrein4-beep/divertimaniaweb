-- Video real de Rapunzel bailando con Flynn como portada de la variante «Rapunzel con el príncipe».
-- Solo datos: si la variante no existe, no hace nada.
UPDATE "Opcion"
SET "videoUrl" = '/videos/rapunzel-flynn.mp4', "fotoUrl" = '/videos/rapunzel-flynn.jpg'
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Rapunzel' AND "nombre" = 'Rapunzel con el príncipe';

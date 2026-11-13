-- La tercera variante de Rapunzel es el show con Madre Gothel (la madrastra) y Flynn Rider, con su video real.
-- Solo datos: si la variante no existe, no hace nada.
UPDATE "Opcion"
SET "nombre" = 'Show de Rapunzel con Madre Gothel y Flynn',
    "descripcion" = 'Rapunzel, el príncipe Flynn Rider y Madre Gothel, su madrastra, en un show juntos.',
    "videoUrl" = '/videos/rapunzel-gothel-flynn.mp4',
    "fotoUrl" = '/videos/rapunzel-gothel-flynn.jpg'
WHERE "tipo" = 'VARIANTE' AND "grupo" = 'Rapunzel' AND "nombre" = 'Rapunzel con todas las princesas';

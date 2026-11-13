-- Quita de las galerías de las fichas las 4 fotos de baja resolución (menos de 600 px de ancho).
-- Los archivos siguen en /public porque otras partes del sitio los usan.
DELETE FROM "ServicioMedia" WHERE "tipo" = 'FOTO' AND "url" IN (
  '/images/mickey-navidad-show.png',
  '/images/bella-y-bestia.png',
  '/images/rapunzel-cumpleanos.png',
  '/images/pelotas-boom-piscina.png'
);

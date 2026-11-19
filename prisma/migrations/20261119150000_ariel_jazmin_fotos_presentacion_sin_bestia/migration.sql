-- Fotos nuevas de Show de Ariel y Show de Jazmín; presentación de Princesas sin el clip de Bella y la Bestia. Solo datos e idempotente.
UPDATE "Opcion" SET "fotoUrl" = '/images/ariel-show.jpg' WHERE "nombre" = 'Show de Ariel';
UPDATE "Opcion" SET "fotoUrl" = '/images/jazmin-show.jpg' WHERE "nombre" = 'Show de Jazmín';
UPDATE "ServicioMedia" SET "url" = '/videos/princesas-disney-show-v5.mp4', "poster" = '/videos/princesas-disney-show-v5.jpg' WHERE "url" = '/videos/princesas-disney-show-v2.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/princesas-disney-show-v5.jpg' WHERE "fotoUrl" = '/videos/princesas-disney-show-v2.jpg';

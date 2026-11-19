-- Show con la Bestia: versión 4:5 sin bordes difuminados. Solo datos e idempotente.
UPDATE "Opcion" SET "videoUrl" = '/videos/bella-bestia-show-4x5.mp4', "fotoUrl" = '/videos/bella-bestia-show-4x5.jpg' WHERE "videoUrl" = '/videos/bella-bestia-show.mp4';
UPDATE "ServicioMedia" SET "url" = '/videos/bella-bestia-show-4x5.mp4', "poster" = '/videos/bella-bestia-show-4x5.jpg' WHERE "url" = '/videos/bella-bestia-show.mp4';

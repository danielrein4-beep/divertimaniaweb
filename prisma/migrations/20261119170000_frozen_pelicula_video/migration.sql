-- Show de toda la película de Frozen: video nuevo (reemplaza la foto). Solo datos e idempotente.
UPDATE "Opcion" SET "videoUrl" = '/videos/frozen-pelicula-show.mp4', "fotoUrl" = '/videos/frozen-pelicula-show.jpg' WHERE "nombre" = 'Show de toda la película de Frozen';

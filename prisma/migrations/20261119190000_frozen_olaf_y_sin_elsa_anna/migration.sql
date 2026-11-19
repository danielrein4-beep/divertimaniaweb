-- Se quita «Show de Elsa y Anna»; el video del show de Frozen suma la parte con Olaf. Solo datos e idempotente.
DELETE FROM "Opcion" WHERE "nombre" = 'Show de Elsa y Anna';
UPDATE "Opcion" SET "videoUrl" = '/videos/frozen-pelicula-show-v2.mp4' WHERE "nombre" = 'Show de toda la película de Frozen';

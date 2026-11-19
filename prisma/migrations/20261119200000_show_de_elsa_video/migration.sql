-- Show de Elsa: video en bucle con solo las escenas donde Elsa aparece sola. Solo datos e idempotente.
UPDATE "Opcion" SET "videoUrl" = '/videos/elsa-show.mp4', "fotoUrl" = '/videos/elsa-show.jpg' WHERE "nombre" = 'Show de Elsa';

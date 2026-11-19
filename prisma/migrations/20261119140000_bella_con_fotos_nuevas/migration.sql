-- Bella y la Bestia con las fotos nuevas (sin videos). Solo datos e idempotente.
UPDATE "Opcion" SET "fotoUrl" = '/images/bella-show-2.jpg', "videoUrl" = NULL WHERE "nombre" = 'Show de Bella';
UPDATE "Opcion" SET "nombre" = 'Show de Bella y la Bestia', "fotoUrl" = '/images/bella-bestia-show-2.jpg', "videoUrl" = NULL WHERE "nombre" IN ('Show con la Bestia', 'Show de Bella y la Bestia');

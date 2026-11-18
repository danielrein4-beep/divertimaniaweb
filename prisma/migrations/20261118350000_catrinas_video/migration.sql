-- Catrinas: texto (pueden ser mujeres u hombres), portada y video en bucle. Solo datos e idempotente.
UPDATE "Servicio" SET "descripcion" = 'Catrinas y Catrines, pueden ser mujeres u hombres, con el maquillaje y el vestuario más elegante del Día de Muertos. Reciben a tus invitados, sirven los tragos y llenan de misterio y color tu evento de adultos.' WHERE "nombre" = 'Catrinas';

DELETE FROM "ServicioMedia"
WHERE "servicioId" IN (SELECT "id" FROM "Servicio" WHERE "nombre" = 'Catrinas')
  AND "url" <> '/videos/catrinas-show.mp4';

UPDATE "Servicio" SET "fotoUrl" = '/videos/catrinas-show.jpg' WHERE "nombre" = 'Catrinas';

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_catrinas', "id", '/videos/catrinas-show.mp4', 'VIDEO', '/videos/catrinas-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Catrinas'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_catrinas');

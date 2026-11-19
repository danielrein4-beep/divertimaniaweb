-- Personajes de Pascua: video sin el conejo (solo las escenas con los demás personajes). Solo datos e idempotente.
UPDATE "ServicioMedia" SET "url" = '/videos/personajes-pascua-show-v4.mp4', "poster" = '/videos/personajes-pascua-show-v4.jpg' WHERE "url" = '/videos/personajes-pascua-show-v3.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/personajes-pascua-show-v4.jpg' WHERE "fotoUrl" = '/videos/personajes-pascua-show-v3.jpg';

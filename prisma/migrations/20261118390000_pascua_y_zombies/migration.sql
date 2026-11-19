-- Fichas nuevas en Personajes: «Personajes de Pascua» (Infantiles) y «Zombies» (Adultos), con su video en bucle.
-- Solo datos e idempotente.
INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_personajes_pascua', 'Personajes', 'Infantiles', 1, 'Personajes de Pascua', 'Personajes de Pascua para tu fiesta: conejos y personajes con animación, baile y fotos para los pequeños.', '/videos/personajes-pascua-show.jpg', 44, 'cumpleanos'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Personajes de Pascua');

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_zombies', 'Personajes', 'Adultos', 1, 'Zombies', 'Zombies para tu evento: personajes caracterizados que recorren la fiesta, bailan y le dan un susto de buen humor a tus invitados.', '/videos/zombies-show.jpg', 45, 'corporativo'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Zombies');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_pascua', "id", '/videos/personajes-pascua-show.mp4', 'VIDEO', '/videos/personajes-pascua-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Personajes de Pascua'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_pascua');

INSERT INTO "ServicioMedia" ("id", "servicioId", "url", "tipo", "poster", "orden")
SELECT 'pv_zombies', "id", '/videos/zombies-show.mp4', 'VIDEO', '/videos/zombies-show.jpg', -10
FROM "Servicio" WHERE "nombre" = 'Zombies'
  AND NOT EXISTS (SELECT 1 FROM "ServicioMedia" WHERE "id" = 'pv_zombies');

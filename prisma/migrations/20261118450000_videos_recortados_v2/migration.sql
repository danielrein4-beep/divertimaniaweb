-- Videos corregidos (se quitó el final de pantalla del celular y los textos del reel; presentación de princesas con Bella sin bordes).
-- Archivos nuevos (-v2) para que el navegador no use la copia vieja. Solo datos e idempotente.
UPDATE "ServicioMedia" SET "url" = '/videos/bright-monsters-1-v2.mp4' WHERE "url" = '/videos/bright-monsters-1.mp4';
UPDATE "ServicioMedia" SET "url" = '/videos/personajes-pascua-show-v2.mp4', "poster" = '/videos/personajes-pascua-show-v2.jpg' WHERE "url" = '/videos/personajes-pascua-show.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/personajes-pascua-show-v2.jpg' WHERE "fotoUrl" = '/videos/personajes-pascua-show.jpg';
UPDATE "ServicioMedia" SET "url" = '/videos/princesas-disney-show-v2.mp4', "poster" = '/videos/princesas-disney-show-v2.jpg' WHERE "url" = '/videos/princesas-disney-show.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/princesas-disney-show-v2.jpg' WHERE "fotoUrl" = '/videos/princesas-disney-show.jpg';

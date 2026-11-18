-- Sonic: versión recortada a 4:5 sin bordes difuminados. Solo datos e idempotente.
UPDATE "ServicioMedia" SET "url" = '/videos/sonic-show-4x5.mp4', "poster" = '/videos/sonic-show-4x5.jpg' WHERE "url" = '/videos/sonic-show.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/sonic-show-4x5.jpg' WHERE "fotoUrl" = '/videos/sonic-show.jpg';

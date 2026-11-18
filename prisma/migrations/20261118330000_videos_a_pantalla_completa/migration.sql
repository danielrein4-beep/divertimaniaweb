-- Videos que traían bordes difuminados (fondo borroso): se cambian por versiones recortadas a 4:5 sin bordes. Solo datos e idempotente.
UPDATE "ServicioMedia" SET "url" = '/videos/zootopia-show-4x5.mp4', "poster" = '/videos/zootopia-show-4x5.jpg' WHERE "url" = '/videos/zootopia-show.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/zootopia-show-4x5.jpg' WHERE "fotoUrl" = '/videos/zootopia-show.jpg';
UPDATE "ServicioMedia" SET "url" = '/videos/diverticandy-show-4x5.mp4', "poster" = '/videos/diverticandy-show-4x5.jpg' WHERE "url" = '/videos/diverticandy-show.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/diverticandy-show-4x5.jpg' WHERE "fotoUrl" = '/videos/diverticandy-show.jpg';
UPDATE "ServicioMedia" SET "url" = '/videos/toy-story-1-4x5.mp4', "poster" = '/videos/toy-story-1-4x5.jpg' WHERE "url" = '/videos/toy-story-1.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/toy-story-1-4x5.jpg' WHERE "fotoUrl" = '/videos/toy-story-1.jpg';
UPDATE "ServicioMedia" SET "url" = '/videos/toy-story-2-4x5.mp4', "poster" = '/videos/toy-story-2-4x5.jpg' WHERE "url" = '/videos/toy-story-2.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/toy-story-2-4x5.jpg' WHERE "fotoUrl" = '/videos/toy-story-2.jpg';
UPDATE "ServicioMedia" SET "url" = '/videos/spiderman-show-4x5.mp4', "poster" = '/videos/spiderman-show-4x5.jpg' WHERE "url" = '/videos/spiderman-show.mp4';
UPDATE "Servicio" SET "fotoUrl" = '/videos/spiderman-show-4x5.jpg' WHERE "fotoUrl" = '/videos/spiderman-show.jpg';

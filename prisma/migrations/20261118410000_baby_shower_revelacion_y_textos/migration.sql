-- Baby Shower y Revelación de Género pasan a ser dos fichas; textos mejorados de varias fichas de Personajes. Solo datos e idempotente.
UPDATE "Servicio" SET "nombre" = 'Baby Shower', "descripcion" = 'Sonido e iluminación y 2 animadores encargados de juegos y dinámicas para los futuros padres y sus invitados: ¡en la dulce espera!', "incluye" = 'Sonido profesional y micrófono para la animación
2 recreadores especializados en ambiente familiar
Selección de 7+ dinámicas interactivas y emotivas
Momento especial para la apertura de regalos
Musicalización temática durante todo el evento', "ocasiones" = 'baby-shower' WHERE "nombre" = 'Baby Shower o Revelación de Género';

INSERT INTO "Servicio" ("id", "categoria", "subcategoria", "activo", "nombre", "descripcion", "incluye", "edadIdeal", "duracion", "fotoUrl", "orden", "ocasiones")
SELECT 'svc_revelacion_genero', 'Celebraciones', NULL, 1, 'Revelación de Género', 'Sonido e iluminación y 2 animadores para llevar la emoción hasta el gran momento: la revelación del género de tu bebé, con juegos para todos los invitados.', 'Sonido profesional y micrófono para la animación
2 recreadores especializados en ambiente familiar
Juegos y dinámicas mientras llega el gran momento
Momento especial para la revelación de género
Musicalización temática durante todo el evento', 'Adultos y familia', '2.5 horas', '/images/gender-reveal-portada.jpg', 2, 'gender-reveal'
WHERE NOT EXISTS (SELECT 1 FROM "Servicio" WHERE "nombre" = 'Revelación de Género');

UPDATE "Servicio" SET "descripcion" = 'Guerreras K-Pop: bailarinas con vestuario y coreografías de K-Pop que encienden la pista y se toman fotos con tus invitados.' WHERE "nombre" = 'Guerreras K-Pop';
UPDATE "Servicio" SET "descripcion" = 'Daft Punk en tu fiesta: dos robots con cascos brillantes que bailan, se toman fotos y ponen el ambiente en la pista.' WHERE "nombre" = 'Daft Punk';
UPDATE "Servicio" SET "descripcion" = 'La Casa de Papel: los atracadores de overol rojo y máscara llegan a tu fiesta con baile, fotos y mucha acción.' WHERE "nombre" = 'La Casa de Papel';
UPDATE "Servicio" SET "descripcion" = 'Bailarinas árabes con vestuario de ensueño y velos que sorprenden a tus invitados con su danza en cualquier evento.' WHERE "nombre" = 'Bailarinas Árabes';
UPDATE "Servicio" SET "descripcion" = 'Garotas: bailarinas estilo carnaval, con plumas y brillos, que bailan y le ponen ritmo y color a tu evento.' WHERE "nombre" = 'Garotas';
UPDATE "Servicio" SET "descripcion" = 'Robots Tamboreros: robots con trajes de luces LED que tocan los tambores en vivo y animan tu evento con ritmo y show de luz.' WHERE "nombre" = 'Robots Tamboreros';

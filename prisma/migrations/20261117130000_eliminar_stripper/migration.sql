-- Se elimina el servicio «Stripper» (no forma parte de la oferta de Divertimania).
-- Sus variantes, medios y vínculos a eventos se borran en cascada. Idempotente.
DELETE FROM "Servicio" WHERE "nombre" = 'Stripper';

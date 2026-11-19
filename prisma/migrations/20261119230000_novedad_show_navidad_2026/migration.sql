-- Novedades del Inicio con varias fotos y fechas de entrada/salida: «Show de Navidad 2026». Idempotente.
ALTER TABLE "Novedad" ADD COLUMN "fotos" TEXT;

UPDATE "Novedad" SET
  "badge" = 'Diciembre · Temporada navideña',
  "titulo" = 'Show de Navidad 2026',
  "descripcion" = 'Duendes, Santa, renos y animación especial de fin de año para fiestas familiares, colegios y empresas. Los cupos de diciembre se llenan rápido.',
  "fotoUrl" = '/images/navidad-2026-1.jpg',
  "fotos" = '/images/navidad-2026-2.jpg,/images/navidad-2026-3.jpg,/images/navidad-2026-4.jpg',
  "ctaTexto" = 'Consultar fecha navideña',
  "ctaUrl" = '/catalogo?ocasion=navidad',
  "activo" = 1,
  "fechaInicio" = 1795046400000,
  "fechaFin" = 1799279999000
WHERE "titulo" IN ('Shows navideños 2026', 'Show de Navidad 2026');

INSERT INTO "Novedad" ("id", "badge", "titulo", "descripcion", "fotoUrl", "fotos", "ctaTexto", "ctaUrl", "activo", "fechaInicio", "fechaFin", "orden", "createdAt")
SELECT 'nov_navidad_2026', 'Diciembre · Temporada navideña', 'Show de Navidad 2026',
  'Duendes, Santa, renos y animación especial de fin de año para fiestas familiares, colegios y empresas. Los cupos de diciembre se llenan rápido.',
  '/images/navidad-2026-1.jpg', '/images/navidad-2026-2.jpg,/images/navidad-2026-3.jpg,/images/navidad-2026-4.jpg',
  'Consultar fecha navideña', '/catalogo?ocasion=navidad', 1, 1795046400000, 1799279999000, 0, (strftime('%s','now') * 1000)
WHERE NOT EXISTS (SELECT 1 FROM "Novedad" WHERE "titulo" = 'Show de Navidad 2026');

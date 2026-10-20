-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#a8ff30',
    "orden" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- AlterTable
ALTER TABLE "Servicio" ADD COLUMN "activo" BOOLEAN NOT NULL DEFAULT true;

-- Las 6 secciones que estaban fijas en el código, con sus colores.
INSERT INTO "Categoria" ("id", "nombre", "color", "orden") VALUES
  ('cat_fiestas_infantiles', 'Fiestas Infantiles', '#a8ff30', 0),
  ('cat_baby_shower', 'Baby Shower', '#ff4fd8', 1),
  ('cat_personajes', 'Personajes', '#00e5ff', 2),
  ('cat_show_adultos', 'Show para Adultos', '#ffd166', 3),
  ('cat_estacion_creativa', 'Estación Creativa', '#ff8447', 4),
  ('cat_atracciones', 'Atracciones', '#b366ff', 5);

-- Categorías que ya usen los servicios y no estén en la lista (por si alguien escribió otra a mano).
INSERT INTO "Categoria" ("id", "nombre", "color", "orden")
SELECT 'cat_extra_' || lower(hex(randomblob(6))), "categoria", '#a8ff30', 100
FROM (SELECT DISTINCT "categoria" FROM "Servicio")
WHERE "categoria" NOT IN (SELECT "nombre" FROM "Categoria");

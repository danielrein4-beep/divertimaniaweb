-- CreateTable
CREATE TABLE "ServicioMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "servicioId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "poster" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ServicioMedia_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Servicio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoria" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "incluye" TEXT,
    "edadIdeal" TEXT,
    "duracion" TEXT,
    "masPedido" BOOLEAN NOT NULL DEFAULT false,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "soloAdultos" BOOLEAN NOT NULL DEFAULT false,
    "ocasiones" TEXT,
    "combinaCon" TEXT
);
INSERT INTO "new_Servicio" ("categoria", "descripcion", "fotoUrl", "id", "nombre", "orden") SELECT "categoria", "descripcion", "fotoUrl", "id", "nombre", "orden" FROM "Servicio";
DROP TABLE "Servicio";
ALTER TABLE "new_Servicio" RENAME TO "Servicio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

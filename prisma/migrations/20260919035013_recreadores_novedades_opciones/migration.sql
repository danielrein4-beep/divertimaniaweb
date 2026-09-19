-- CreateTable
CREATE TABLE "Opcion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "servicioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "grupo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "videoUrl" TEXT,
    "fotoUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Opcion_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recreador" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Novedad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "badge" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "ctaTexto" TEXT NOT NULL DEFAULT 'Consultar disponibilidad',
    "ctaUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaInicio" DATETIME,
    "fechaFin" DATETIME,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

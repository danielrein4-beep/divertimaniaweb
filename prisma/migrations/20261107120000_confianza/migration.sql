-- Confianza: testimonios administrables, cifras del Inicio y precios «desde» de los paquetes.
ALTER TABLE "ConfiguracionSitio" ADD COLUMN "cifras" TEXT;
ALTER TABLE "ConfiguracionSitio" ADD COLUMN "preciosPaquetes" TEXT;

CREATE TABLE "Testimonio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "ciudad" TEXT,
    "texto" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Metrica" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "origen" TEXT,
    "detalle" TEXT,
    "pagina" TEXT,
    "visitante" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Metrica_tipo_createdAt_idx" ON "Metrica"("tipo", "createdAt");

-- CreateIndex
CREATE INDEX "Metrica_createdAt_idx" ON "Metrica"("createdAt");

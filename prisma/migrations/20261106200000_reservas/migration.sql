-- Reservas con anticipo: datos de pago y tope diario en Ajustes, y la tabla de reservas.
ALTER TABLE "ConfiguracionSitio" ADD COLUMN "datosPago" TEXT;
ALTER TABLE "ConfiguracionSitio" ADD COLUMN "eventosPorDia" INTEGER NOT NULL DEFAULT 3;

CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'SOLICITADA',
    "fecha" TEXT NOT NULL,
    "horaInicio" TEXT,
    "tipoEvento" TEXT NOT NULL,
    "zona" TEXT NOT NULL,
    "lugar" TEXT,
    "invitados" TEXT,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "comentarios" TEXT,
    "servicios" TEXT,
    "montoAnticipo" REAL,
    "montoTotal" REAL,
    "metodoPago" TEXT,
    "referenciaPago" TEXT,
    "comprobante" TEXT,
    "notaInterna" TEXT,
    "eventoId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "Reserva_codigo_key" ON "Reserva"("codigo");
CREATE UNIQUE INDEX "Reserva_token_key" ON "Reserva"("token");

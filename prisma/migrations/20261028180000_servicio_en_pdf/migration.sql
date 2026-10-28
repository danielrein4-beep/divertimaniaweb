-- Casilla «Mostrar en el PDF»: un servicio puede verse en la web y no en el catálogo PDF.
ALTER TABLE "Servicio" ADD COLUMN "enPdf" BOOLEAN NOT NULL DEFAULT true;

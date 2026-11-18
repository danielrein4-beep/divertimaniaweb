-- Segundo número de WhatsApp (0424-743-5744): se ofrece junto al primero en todo el sitio.
ALTER TABLE "ConfiguracionSitio" ADD COLUMN "whatsapp2" TEXT;
UPDATE "ConfiguracionSitio" SET "whatsapp2" = '584247435744' WHERE "whatsapp2" IS NULL;

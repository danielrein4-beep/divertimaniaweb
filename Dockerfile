# Imagen para publicar Divertimania en Coolify (mismo VPS de Aurora, contenedor aparte).
# Todo lo que tiene que sobrevivir a una actualización (base SQLite y fotos subidas desde el
# panel) vive en /data, que en Coolify se monta como volumen persistente.
FROM node:22-bookworm-slim

# Prisma necesita openssl para conectarse a la base.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npx prisma generate && npm run build

ENV NODE_ENV=production \
    PORT=3000 \
    DATABASE_URL=file:/data/divertimania.db \
    UPLOADS_DIR=/data/uploads
VOLUME /data
EXPOSE 3000

CMD ["node", "scripts/arrancar.mjs"]

import path from "node:path";
import os from "node:os";
import { defineConfig } from "vitest/config";

// Las pruebas que tocan la base usan una SQLite temporal, nunca prisma/dev.db.
const baseDePrueba = path.join(os.tmpdir(), `divertimania-pruebas-${process.pid}.db`);
process.env.DATABASE_URL = `file:${baseDePrueba}`;

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: {
    include: ["pruebas/**/*.test.ts"],
    globalSetup: ["pruebas/preparar-base.ts"],
    env: { DATABASE_URL: process.env.DATABASE_URL },
    // Las pruebas de base comparten el archivo: una a la vez.
    fileParallelism: false,
  },
});

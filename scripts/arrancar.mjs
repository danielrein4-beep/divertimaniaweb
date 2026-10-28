// Arranque en el servidor: aplica las migraciones, carga el catálogo inicial solo si la base
// está vacía (el seed borra todo, así que nunca corre sobre una base con datos) y levanta el sitio.
import { execSync, spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

if (process.env.UPLOADS_DIR) mkdirSync(process.env.UPLOADS_DIR, { recursive: true });

run("npx prisma migrate deploy");

const prisma = new PrismaClient();
const servicios = await prisma.servicio.count();
const admins = await prisma.adminUser.count();
await prisma.$disconnect();

if (servicios === 0 && admins === 0) {
  console.log("Base vacía: cargando el catálogo inicial.");
  run("npm run db:seed");
} else {
  console.log(`Base con datos (${servicios} servicios): no se toca.`);
}

const sitio = spawn("npx", ["next", "start", "-p", process.env.PORT ?? "3000"], { stdio: "inherit" });
sitio.on("exit", (code) => process.exit(code ?? 0));
for (const senal of ["SIGTERM", "SIGINT"]) process.on(senal, () => sitio.kill(senal));

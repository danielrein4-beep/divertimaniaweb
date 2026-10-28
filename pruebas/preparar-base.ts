// Antes de las pruebas: crea la base temporal con las mismas migraciones que producción.
// Al terminar la borra.
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

export default function prepararBase() {
  const url = process.env.DATABASE_URL ?? "";
  if (!url.startsWith("file:") || url.includes("dev.db")) throw new Error(`Base de prueba inesperada: ${url}`);
  execSync("npx prisma migrate deploy", { stdio: "ignore", env: process.env });
  return () => rmSync(url.slice("file:".length), { force: true });
}

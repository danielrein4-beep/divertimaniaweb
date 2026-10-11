// Prepara el proyecto para correrlo en tu computadora: crea .env si falta,
// aplica las migraciones y carga los datos de ejemplo.
// Uso: npm run setup   (después: npm run dev → http://localhost:3000)
import { execSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

if (!existsSync(".env")) {
  writeFileSync(
    ".env",
    `DATABASE_URL="file:./dev.db"\nSESSION_SECRET="${randomBytes(32).toString("hex")}"\n`
  );
  console.log("✓ .env creado");
} else {
  console.log("= .env ya existe, no se toca");
}

run("npx prisma migrate deploy");
run("npx prisma generate");
run("npm run db:seed");

console.log("\n✓ Listo. Ahora corre: npm run dev  y abre http://localhost:3000");
console.log("  Panel admin: http://localhost:3000/admin/login  (usuario: admin · contraseña: divertimania2024)");

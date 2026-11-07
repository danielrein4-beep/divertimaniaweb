import { describe, expect, it } from "vitest";
import { FIESTAS, fiestaCompleta, rutaDeOcasion } from "@/lib/fiestas";
import { OCASIONES } from "@/lib/ocasiones";

describe("páginas por ocasión", () => {
  it("hay una página por cada ocasión y ninguna dirección se repite", () => {
    expect(FIESTAS.map((f) => f.ocasion).sort()).toEqual(OCASIONES.map((o) => o.slug).sort());
    expect(new Set(FIESTAS.map((f) => f.ruta)).size).toBe(FIESTAS.length);
    for (const f of FIESTAS) expect(f.ruta).toMatch(/^[a-z0-9-]+$/);
  });

  it("cada página trae tres paquetes, uno destacado, y sus preguntas", () => {
    for (const f of FIESTAS) {
      expect(f.paquetes, f.ruta).toHaveLength(3);
      expect(f.paquetes.filter((p) => p.destacado), f.ruta).toHaveLength(1);
      expect(f.preguntas.length, f.ruta).toBeGreaterThan(0);
      expect(f.seo.descripcion.length, f.ruta).toBeLessThanOrEqual(160);
    }
  });

  it("une la ocasión con su foto y su dirección", () => {
    expect(rutaDeOcasion("quince")).toBe("15-anos");
    expect(fiestaCompleta("15-anos")).toMatchObject({ nombre: "15 años", foto: "/images/quince-portada.jpg" });
    expect(fiestaCompleta("no-existe")).toBeNull();
  });
});

import Link from "next/link";
import { prisma } from "@/lib/db";
import { ORIGEN_LABEL } from "@/lib/metricas";

export const dynamic = "force-dynamic";

const RANGOS = [7, 30, 90] as const;
const ZONA = "America/Caracas";

const diaLocal = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit" });
const diaCorto = new Intl.DateTimeFormat("es-VE", { timeZone: ZONA, day: "numeric", month: "short" });
const numero = new Intl.NumberFormat("es-VE");

function contar<T>(lista: T[], clave: (x: T) => string | null | undefined) {
  const mapa = new Map<string, number>();
  for (const x of lista) {
    const k = clave(x);
    if (k) mapa.set(k, (mapa.get(k) ?? 0) + 1);
  }
  return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
}

const NOMBRE_PAGINA: Record<string, string> = {
  "/": "Inicio",
  "/catalogo": "Catálogo",
  "/galeria": "Galería",
  "/equipo": "Equipo",
  "/contacto": "Contacto",
  "/disponibilidad": "Consulta tu fecha",
};

const DIA_MS = 24 * 60 * 60 * 1000;

/** Inicio del periodo y todos sus días (hora de Venezuela), para que los días en cero también salgan. */
function rango(dias: number) {
  const ahora = Date.now();
  return {
    desde: new Date(ahora - dias * DIA_MS),
    diasSerie: Array.from({ length: dias }, (_, i) => {
      const fecha = new Date(ahora - (dias - 1 - i) * DIA_MS);
      return { clave: diaLocal.format(fecha), etiqueta: diaCorto.format(fecha) };
    }),
  };
}

export default async function ResultadosPage({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const { dias: diasParam } = await searchParams;
  const dias = RANGOS.find((r) => String(r) === diasParam) ?? 30;
  const { desde, diasSerie } = rango(dias);

  const [metricas, solicitudes] = await Promise.all([
    prisma.metrica.findMany({
      where: { createdAt: { gte: desde } },
      select: { tipo: true, origen: true, detalle: true, pagina: true, visitante: true, createdAt: true },
    }),
    prisma.solicitudContacto.groupBy({ by: ["estado"], where: { createdAt: { gte: desde } }, _count: true }),
  ]);

  const visitas = metricas.filter((m) => m.tipo === "VISITA");
  const contactos = metricas.filter((m) => m.tipo === "WHATSAPP" || m.tipo === "COTIZACION");
  const cotizaciones = metricas.filter((m) => m.tipo === "COTIZACION");
  const instagram = metricas.filter((m) => m.tipo === "INSTAGRAM");

  const personas = new Set(visitas.map((m) => m.visitante ?? m.createdAt.toISOString())).size;
  const personasQueEscribieron = new Set(contactos.map((m) => m.visitante ?? m.createdAt.toISOString())).size;
  const tasa = personas > 0 ? Math.round((personasQueEscribieron / personas) * 100) : 0;

  const porEstado = Object.fromEntries(solicitudes.map((s) => [s.estado, s._count]));
  const cerradas = porEstado.CONVERTIDA ?? 0;

  const serie = (lista: typeof metricas) => {
    const mapa = new Map(contar(lista, (m) => diaLocal.format(m.createdAt)));
    return diasSerie.map((d) => ({ ...d, valor: mapa.get(d.clave) ?? 0 }));
  };

  const servicios = contar(
    [
      ...cotizaciones.flatMap((m) => (m.detalle ?? "").split(", ")),
      ...contactos.filter((m) => m.origen === "ficha").map((m) => m.detalle ?? ""),
    ],
    (s) => s.trim() || null
  ).slice(0, 8);
  const origenes = contar(contactos, (m) => m.origen ?? "otro").slice(0, 8);
  const paginasTop = contar(visitas, (m) => m.pagina).slice(0, 8);
  // Las fichas se muestran con el nombre del servicio en vez de la dirección.
  const idsFicha = paginasTop.map(([p]) => p.match(/^\/catalogo\/([^/]+)$/)?.[1]).filter((id): id is string => Boolean(id));
  const nombres = new Map(
    (await prisma.servicio.findMany({ where: { id: { in: idsFicha } }, select: { id: true, nombre: true } })).map((s) => [
      `/catalogo/${s.id}`,
      s.nombre,
    ])
  );
  const paginas = paginasTop.map(([p, v]): [string, number] => [nombres.get(p) ?? NOMBRE_PAGINA[p] ?? p, v]);
  const busquedasSinResultado = contar(
    contactos.filter((m) => m.origen === "catalogo-busqueda"),
    (m) => m.detalle?.toLowerCase()
  ).slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resultados de la página</h1>
          <p className="text-sm text-muted">Cuánta gente entra y cuántos terminan escribiendo por WhatsApp.</p>
        </div>
        <nav aria-label="Periodo" className="flex gap-1 rounded-full border border-border p-1">
          {RANGOS.map((r) => (
            <Link
              key={r}
              href={`/admin/resultados?dias=${r}`}
              aria-current={r === dias ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                r === dias ? "bg-neon-green text-background" : "text-muted hover:text-foreground"
              }`}
            >
              {r} días
            </Link>
          ))}
        </nav>
      </div>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Dato titulo="Personas que entraron" valor={numero.format(personas)} nota={`${numero.format(visitas.length)} páginas vistas`} />
        <Dato
          titulo="Escribieron por WhatsApp"
          valor={numero.format(personasQueEscribieron)}
          nota={`${numero.format(contactos.length)} toques en total`}
          destacado
        />
        <Dato titulo="De cada 100 que entran, escriben" valor={`${tasa}`} nota="porcentaje de personas" />
        <Dato
          titulo="Cotizaciones armadas"
          valor={numero.format(cotizaciones.length)}
          nota={`${numero.format(cerradas)} marcadas como cerradas`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Barras titulo="Personas que escribieron, por día" unidad="contactos" datos={serie(contactos)} />
        <Barras titulo="Visitas, por día" unidad="páginas vistas" datos={serie(visitas)} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Ranking
          titulo="Lo que más piden"
          vacio="Todavía nadie ha pedido un servicio en este periodo."
          filas={servicios}
        />
        <Ranking
          titulo="Desde dónde escriben"
          vacio="Aún no hay toques a WhatsApp."
          filas={origenes.map(([k, v]) => [ORIGEN_LABEL[k] ?? "Otro", v])}
        />
        <Ranking titulo="Páginas más vistas" vacio="Aún no hay visitas." filas={paginas} />
        {busquedasSinResultado.length > 0 && (
          <Ranking
            titulo="Buscaron y no lo encontraron"
            vacio=""
            filas={busquedasSinResultado}
            nota="Ideas de servicios para agregar al catálogo."
          />
        )}
        <div className="card-glass rounded-2xl p-5">
          <h2 className="mb-3 font-semibold">Solicitudes en este periodo</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Nuevas", porEstado.NUEVA ?? 0],
              ["Contactadas", porEstado.CONTACTADA ?? 0],
              ["Cerradas", cerradas],
              ["Descartadas", porEstado.DESCARTADA ?? 0],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-background-elevated p-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-xl font-bold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <Link href="/admin/solicitudes" className="mt-4 inline-block text-sm text-neon-green hover:underline">
            Ver y marcar solicitudes →
          </Link>
        </div>
        <div className="card-glass rounded-2xl p-5">
          <h2 className="mb-1 font-semibold">Instagram</h2>
          <p className="text-3xl font-bold tabular-nums">{numero.format(instagram.length)}</p>
          <p className="text-sm text-muted">veces que tocaron el enlace a su Instagram</p>
        </div>
      </section>

      <p className="text-xs text-muted">
        Se cuenta a cada persona de forma anónima (sin nombre ni teléfono). Una persona que entra desde dos teléfonos
        cuenta como dos.
      </p>
    </div>
  );
}

function Dato({ titulo, valor, nota, destacado }: { titulo: string; valor: string; nota: string; destacado?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${destacado ? "border-neon-green/40 bg-neon-green/[0.06]" : "border-border bg-background-card"}`}>
      <p className="text-sm text-muted">{titulo}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{valor}</p>
      <p className="mt-1 text-xs text-muted">{nota}</p>
    </div>
  );
}

function Barras({
  titulo,
  unidad,
  datos,
}: {
  titulo: string;
  unidad: string;
  datos: { clave: string; etiqueta: string; valor: number }[];
}) {
  const max = Math.max(1, ...datos.map((d) => d.valor));
  const total = datos.reduce((s, d) => s + d.valor, 0);
  const cadaCuanto = Math.ceil(datos.length / 6);
  return (
    <figure className="card-glass rounded-2xl p-5">
      <figcaption className="mb-4 flex items-baseline justify-between gap-2">
        <span className="font-semibold">{titulo}</span>
        <span className="text-sm tabular-nums text-muted">
          {numero.format(total)} {unidad}
        </span>
      </figcaption>
      <div className="relative">
                <ol className="flex h-36 items-end gap-[2px]" aria-label={titulo}>
          {datos.map((d) => (
            <li key={d.clave} className="group relative flex h-full flex-1 items-end">
              <span
                className="w-full rounded-t-[4px] bg-neon-green/80 transition-colors group-hover:bg-neon-green"
                style={{ height: d.valor > 0 ? `${Math.max(3, (d.valor / max) * 100)}%` : "1px" }}
              />
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-background-elevated px-2 py-1 text-xs group-hover:block">
                <span className="text-muted">{d.etiqueta}:</span> <strong className="tabular-nums">{d.valor}</strong>
              </span>
              <span className="sr-only">
                {d.etiqueta}: {d.valor}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div aria-hidden className="mt-2 flex gap-[2px] text-[10px] text-muted">
        {datos.map((d, i) => (
          <span key={d.clave} className="flex-1 overflow-visible whitespace-nowrap">
            {i % cadaCuanto === 0 ? d.etiqueta : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}

function Ranking({
  titulo,
  filas,
  vacio,
  nota,
}: {
  titulo: string;
  filas: [string, number][];
  vacio: string;
  nota?: string;
}) {
  const max = Math.max(1, ...filas.map(([, v]) => v));
  return (
    <div className="card-glass rounded-2xl p-5">
      <h2 className="font-semibold">{titulo}</h2>
      {nota && <p className="text-xs text-muted">{nota}</p>}
      {filas.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{vacio}</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-2.5">
          {filas.map(([nombre, valor]) => (
            <li key={nombre} className="text-sm">
              <div className="flex justify-between gap-3">
                <span className="truncate">{nombre}</span>
                <span className="tabular-nums text-muted">{valor}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-neon-green/70" style={{ width: `${(valor / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

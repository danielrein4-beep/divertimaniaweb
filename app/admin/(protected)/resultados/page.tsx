import Link from "next/link";
import Encabezado from "@/components/admin/Encabezado";
import { prisma } from "@/lib/db";
import { ORIGEN_LABEL } from "@/lib/metricas";
import { contar, contarPersonas, diaLocal, NOMBRE_PAGINA, numero, RANGOS, rango, resumenReservas } from "@/lib/resultados";
import { Barras, Dato, Ranking } from "@/components/admin/resultados/Graficos";
import { FiestasPorLaWeb, Recorrido } from "@/components/admin/resultados/FiestasWeb";

export const dynamic = "force-dynamic";


export default async function ResultadosPage({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const { dias: diasParam } = await searchParams;
  const dias = RANGOS.find((r) => String(r) === diasParam) ?? 30;
  const { desde, diasSerie } = rango(dias);

  const [metricas, solicitudes, reservas] = await Promise.all([
    prisma.metrica.findMany({
      where: { createdAt: { gte: desde } },
      select: { tipo: true, origen: true, detalle: true, pagina: true, visitante: true, createdAt: true },
    }),
    prisma.solicitudContacto.groupBy({ by: ["estado"], where: { createdAt: { gte: desde } }, _count: true }),
    prisma.reserva.findMany({
      where: { createdAt: { gte: desde } },
      select: { estado: true, montoTotal: true, montoAnticipo: true },
    }),
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
  // Servicios más vistos: personas distintas que abrieron la ficha de cada servicio (todas, no solo las 8 más vistas).
  const esFicha = (p: string | null) => p?.match(/^\/catalogo\/([^/]+)$/)?.[1] ?? null;
  const fichasVistas = contarPersonas(visitas, (m) => esFicha(m.pagina)).filter(([id]) => id !== "pdf");
  const nombresFichas = new Map(
    (
      await prisma.servicio.findMany({ where: { id: { in: fichasVistas.map(([id]) => id) } }, select: { id: true, nombre: true } })
    ).map((s) => [s.id, s.nombre])
  );
  const serviciosVistos = fichasVistas
    .filter(([id]) => nombresFichas.has(id))
    .slice(0, 10)
    .map(([id, v]): [string, number] => [nombresFichas.get(id)!, v]);
  const agregados = metricas.filter((m) => m.tipo === "AGREGADO");
  const masAgregados = contarPersonas(agregados, (m) => m.detalle).slice(0, 10);
  const reservasWeb = resumenReservas(reservas);
  const personasCon = (lista: typeof metricas) => new Set(lista.map((m) => m.visitante ?? m.createdAt.toISOString())).size;
  const recorrido = [
    { titulo: "Entraron a la página", valor: personas },
    { titulo: "Vieron un servicio o celebración", valor: personasCon(visitas.filter((m) => esFicha(m.pagina) || m.pagina?.startsWith("/fiestas/"))) },
    { titulo: "Armaron su fiesta", valor: personasCon(agregados) },
    { titulo: "Escribieron por WhatsApp", valor: personasQueEscribieron },
    { titulo: "Fiestas confirmadas", valor: reservasWeb.confirmadas },
  ];

  const paginas = paginasTop.map(([p, v]): [string, number] => [nombres.get(p) ?? NOMBRE_PAGINA[p] ?? p, v]);
  const busquedasSinResultado = contar(
    contactos.filter((m) => m.origen === "catalogo-busqueda"),
    (m) => m.detalle?.toLowerCase()
  ).slice(0, 6);

  return (
    <div className="flex flex-col gap-8 [&>header]:mb-0">
      <Encabezado
        grupo="Negocio"
        titulo="Resultados"
        descripcion="Cuánta gente entra a la página y cuántos terminan escribiendo por WhatsApp."
        acciones={
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
        }
      />

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

      <Recorrido pasos={recorrido} />
      <FiestasPorLaWeb r={reservasWeb} />

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
        <Ranking
          titulo="Servicios más vistos"
          nota="Personas distintas que abrieron cada servicio: lo que más curiosidad da."
          vacio="Aún nadie abrió un servicio en este periodo."
          filas={serviciosVistos}
        />
        <Ranking
          titulo="Lo que más agregan a su fiesta"
          nota="El show exacto que suman a «Mi fiesta», aunque después no escriban."
          vacio="Se empieza a contar desde esta actualización."
          filas={masAgregados}
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
        <div className="border border-white/10 bg-background-card rounded-xl p-5">
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
        <div className="border border-white/10 bg-background-card rounded-xl p-5">
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


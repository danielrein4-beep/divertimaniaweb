// Diseño del catálogo PDF con los colores de la marca: negro, lima del logo y títulos Baloo.
// Portada · directorio con páginas · una ficha por fila con su foto (3 por página) · cierre con los dos WhatsApp.
import path from "node:path";
import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { COBERTURA } from "@/lib/negocio";
import { INSTAGRAM_HANDLE } from "@/lib/site";
import { DINAMICAS_POR_PAGINA, FICHAS_POR_PAGINA, type CatalogoPdf, type DinamicasPdf, type FichaPdf, type GrupoPdf } from "./datos";

const FUENTES = path.join(process.cwd(), "node_modules", "@fontsource", "baloo-2", "files");
Font.register({
  family: "Baloo",
  fonts: [
    { src: path.join(FUENTES, "baloo-2-latin-700-normal.woff"), fontWeight: 700 },
    { src: path.join(FUENTES, "baloo-2-latin-800-normal.woff"), fontWeight: 800 },
  ],
});
// Sin cortar palabras con guiones.
Font.registerHyphenationCallback((palabra) => [palabra]);

const C = { fondo: "#0b0b0b", tarjeta: "#161616", borde: "#2a2a2a", texto: "#f2f2f2", suave: "#a3a3b0", lima: "#a8ff30", morado: "#3d0a3a" };

const s = StyleSheet.create({
  pagina: { backgroundColor: C.fondo, color: C.texto, fontFamily: "Helvetica", fontSize: 9, paddingTop: 34, paddingBottom: 44, paddingHorizontal: 32 },
  portada: { backgroundColor: C.fondo, color: C.texto, fontFamily: "Helvetica", padding: 48, justifyContent: "center", alignItems: "center" },
  portadaBanda: { position: "absolute", left: 0, right: 0, bottom: 0, height: 160, backgroundColor: C.morado },
  titulo: { fontFamily: "Baloo", fontWeight: 800, fontSize: 40, color: C.lima, marginTop: 24 },
  subtitulo: { fontSize: 13, color: C.texto, marginTop: 6, textAlign: "center" },
  cabecera: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 40, marginBottom: 12 },
  cabeceraIzq: { flexDirection: "row", alignItems: "center", flex: 1 },
  barra: { width: 6, height: 26, borderRadius: 3, marginRight: 10, flexShrink: 0 },
  cabeceraTitulo: { fontFamily: "Baloo", fontWeight: 800, fontSize: 21 },
  cabeceraParte: { fontSize: 8.5, color: C.suave },
  ficha: { flexDirection: "row", height: 226, marginBottom: 10, backgroundColor: C.tarjeta, borderRadius: 10, borderWidth: 1, borderColor: C.borde, overflow: "hidden" },
  foto: { width: 181, height: 226, objectFit: "cover" },
  sinFoto: { width: 181, height: 226, backgroundColor: C.morado, justifyContent: "center", alignItems: "center" },
  cuerpo: { flex: 1, paddingVertical: 14, paddingHorizontal: 16 },
  nombre: { fontFamily: "Baloo", fontWeight: 700, fontSize: 17, color: C.texto, marginBottom: 4 },
  descripcion: { color: C.suave, fontSize: 9.5, lineHeight: 1.35, marginBottom: 6 },
  item: { flexDirection: "row", marginBottom: 2.5 },
  punto: { color: C.lima, width: 10, fontSize: 9 },
  itemTexto: { flex: 1, fontSize: 9, lineHeight: 1.3 },
  etiquetas: { flexDirection: "row", flexWrap: "wrap", marginBottom: 4 },
  etiqueta: { fontSize: 8, borderWidth: 1, borderColor: C.borde, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 7, marginRight: 4, marginBottom: 3, color: C.texto },
  pie: { position: "absolute", bottom: 18, left: 32, right: 32, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: C.suave },
  dirTitulo: { fontFamily: "Baloo", fontWeight: 800, fontSize: 30, color: C.lima, marginBottom: 2 },
  dirSub: { fontSize: 10, color: C.suave, marginBottom: 14 },
  dirColumnas: { flexDirection: "row", justifyContent: "space-between" },
  dirColumna: { width: "48.5%" },
  dirLinea: { flexDirection: "row", alignItems: "flex-end", height: 11.5 },
  dirPunteado: { flex: 1, borderBottomWidth: 0.6, borderBottomColor: "#444444", borderStyle: "dotted", marginHorizontal: 3, marginBottom: 2.5 },
  dinItem: { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: C.borde },
});

function Etiquetas({ f }: { f: FichaPdf }) {
  const e = [
    f.masPedido ? "Más pedido" : null,
    f.duracion ? `Duración: ${f.duracion}` : null,
    f.edadIdeal ? `Edad: ${f.edadIdeal}` : null,
    f.soloAdultos ? "+18" : null,
  ].filter((x): x is string => Boolean(x));
  if (e.length === 0) return null;
  return (
    <View style={s.etiquetas}>
      {e.map((t) => (
        <Text key={t} style={[s.etiqueta, t === "Más pedido" ? { borderColor: C.lima, color: C.lima } : {}]}>{t}</Text>
      ))}
    </View>
  );
}

function Ficha({ f, g }: { f: FichaPdf; g: GrupoPdf }) {
  return (
    <View id={`f-${g.id}-${f.id}`} style={s.ficha} wrap={false}>
      {f.foto ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt
        <Image style={s.foto} src={{ data: f.foto, format: "jpg" }} />
      ) : (
        <View style={[s.sinFoto, { borderRightWidth: 3, borderRightColor: g.color }]}>
          <Text style={{ fontFamily: "Baloo", fontWeight: 800, fontSize: 16, color: C.lima }}>Divertimania</Text>
        </View>
      )}
      <View style={s.cuerpo}>
        <Text style={s.nombre}>{f.nombre}</Text>
        <Etiquetas f={f} />
        {f.descripcion ? <Text style={s.descripcion}>{f.descripcion}</Text> : null}
        {f.incluye.map((linea) => (
          <View key={linea} style={s.item}>
            <Text style={s.punto}>•</Text>
            <Text style={s.itemTexto}>{linea}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Pie({ anio, telefonos }: { anio: number; telefonos: string }) {
  return (
    <View style={s.pie} fixed>
      <Text>Divertimania · Catálogo {anio}</Text>
      <Text>Cotiza por WhatsApp {telefonos}</Text>
      <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
    </View>
  );
}

function Cabecera({ titulo, color, parte, id }: { titulo: string; color: string; parte?: string; id?: string }) {
  return (
    <View id={id} style={s.cabecera}>
      <View style={s.cabeceraIzq}>
        <View style={[s.barra, { backgroundColor: color }]} />
        <Text style={[s.cabeceraTitulo, { color }]}>{titulo}</Text>
      </View>
      {parte ? <Text style={s.cabeceraParte}>{parte}</Text> : null}
    </View>
  );
}

function trozos<T>(lista: T[], n: number): T[][] {
  const r: T[][] = [];
  for (let i = 0; i < lista.length; i += n) r.push(lista.slice(i, i + n));
  return r.length ? r : [[]];
}

function PaginasGrupo({ g, anio, telefonos }: { g: GrupoPdf; anio: number; telefonos: string }) {
  const paginas = trozos(g.fichas, FICHAS_POR_PAGINA);
  return (
    <>
      {paginas.map((fichas, i) => (
        <Page key={i} size="A4" style={s.pagina}>
          <Cabecera
            titulo={g.titulo}
            color={g.color}
            id={i === 0 ? `g-${g.id}` : undefined}
            parte={paginas.length > 1 ? `Parte ${i + 1} de ${paginas.length}` : undefined}
          />
          {fichas.map((f) => (
            <Ficha key={f.id} f={f} g={g} />
          ))}
          <Pie anio={anio} telefonos={telefonos} />
        </Page>
      ))}
    </>
  );
}

function PaginasDinamicas({ d, anio, telefonos }: { d: DinamicasPdf; anio: number; telefonos: string }) {
  const paginas = trozos(d.items, DINAMICAS_POR_PAGINA);
  return (
    <>
      {paginas.map((items, i) => (
        <Page key={i} size="A4" style={s.pagina}>
          <Cabecera
            titulo={d.titulo}
            color={d.color}
            id={i === 0 ? `d-${d.id}` : undefined}
            parte={paginas.length > 1 ? `Parte ${i + 1} de ${paginas.length}` : undefined}
          />
          {items.map((it) => (
            <View key={it.nombre} style={s.dinItem} wrap={false}>
              <Text style={s.nombre}>{it.nombre}</Text>
              {it.descripcion ? <Text style={[s.descripcion, { marginBottom: 0, fontSize: 10.5 }]}>{it.descripcion}</Text> : null}
            </View>
          ))}
          <Pie anio={anio} telefonos={telefonos} />
        </Page>
      ))}
    </>
  );
}

export default function DocumentoCatalogo({ datos, sitio }: { datos: CatalogoPdf; sitio: string }) {
  const anio = new Date().getFullYear();
  // En la copia local no se muestra la dirección (sería localhost).
  const web = sitio.includes("localhost") ? "" : `  ·  ${sitio.replace(/^https?:\/\//, "")}`;
  const tel = datos.whatsappTextoTodos;
  return (
    <Document title={`Catálogo Divertimania ${anio}`} author="Divertimania" language="es">
      <Page size="A4" style={s.portada}>
        <View style={s.portadaBanda} fixed />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt */}
        <Image src={{ data: datos.logo, format: "png" }} style={{ width: 300 }} />
        <Text style={s.titulo}>Catálogo {anio}</Text>
        <Text style={s.subtitulo}>Personajes, shows y animación para toda clase de celebraciones</Text>
        <Text style={[s.subtitulo, { fontSize: 11, color: C.suave }]}>{datos.totalFichas} fichas, una por una, con su foto</Text>
        <Text style={[s.subtitulo, { color: C.lima, fontSize: 11, marginTop: 14 }]}>{COBERTURA.titulo}</Text>
        <Text style={{ position: "absolute", bottom: 64, left: 0, right: 0, textAlign: "center", fontSize: 11 }}>
          WhatsApp {tel}  ·  @{INSTAGRAM_HANDLE}{web}
        </Text>
      </Page>

      {datos.directorio.map((lineas, p) => (
        <Page key={`dir-${p}`} size="A4" style={s.pagina}>
          <Text style={s.dirTitulo}>Directorio{datos.paginasDirectorio > 1 ? ` (${p + 1}/${datos.paginasDirectorio})` : ""}</Text>
          <Text style={s.dirSub}>Toca el nombre para ir a la página. Personajes, servicios para tu fiesta y celebraciones.</Text>
          <View style={s.dirColumnas}>
            {trozos(lineas, Math.ceil(lineas.length / 2)).map((col, c) => (
              <View key={c} style={s.dirColumna}>
                {col.map((l) => {
                  const grupo = l.tipo === "grupo";
                  const estilo = grupo
                    ? { fontFamily: "Helvetica-Bold", fontSize: 10, color: C.lima, textDecoration: "none" as const }
                    : { fontFamily: "Helvetica", fontSize: 8.5, color: C.texto, textDecoration: "none" as const };
                  return (
                    <View key={l.destino} style={[s.dirLinea, grupo ? { marginTop: 5, height: 14 } : {}]}>
                      <Link src={`#${l.destino}`} style={[estilo, grupo ? {} : { marginLeft: 8 }]}>
                        {l.texto}
                      </Link>
                      <View style={s.dirPunteado} />
                      <Link src={`#${l.destino}`} style={estilo}>
                        {String(l.pagina)}
                      </Link>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
          <Pie anio={anio} telefonos={tel} />
        </Page>
      ))}

      {datos.bloques.map((b, i) =>
        b.tipo === "grupo" ? (
          <PaginasGrupo key={i} g={b.grupo} anio={anio} telefonos={tel} />
        ) : (
          <PaginasDinamicas key={i} d={b.dinamicas} anio={anio} telefonos={tel} />
        )
      )}

      <Page size="A4" style={s.portada}>
        <Text style={[s.titulo, { marginTop: 0, fontSize: 30, textAlign: "center" }]}>¿Armamos tu fiesta?</Text>
        <Text style={[s.subtitulo, { marginBottom: 24 }]}>Escanea el código del número que prefieras y escríbenos por WhatsApp. Te mandamos la cotización.</Text>
        <View style={{ flexDirection: "row", gap: 28 }}>
          {datos.qrs.map((q) => (
            <View key={q.texto} style={{ alignItems: "center" }}>
              <View style={{ backgroundColor: "#ffffff", padding: 10, borderRadius: 12 }}>
                {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt */}
                <Image src={{ data: q.qr, format: "png" }} style={{ width: datos.qrs.length > 1 ? 150 : 200, height: datos.qrs.length > 1 ? 150 : 200 }} />
              </View>
              <Text style={{ fontFamily: "Baloo", fontWeight: 800, fontSize: 16, color: C.lima, marginTop: 12 }}>{q.texto}</Text>
            </View>
          ))}
        </View>
        <Text style={[s.subtitulo, { fontSize: 11, marginTop: 24 }]}>@{INSTAGRAM_HANDLE}{web}</Text>
        <Text style={[s.subtitulo, { fontSize: 10, color: C.suave, marginTop: 18, maxWidth: 380 }]}>{COBERTURA.texto}</Text>
      </Page>
    </Document>
  );
}

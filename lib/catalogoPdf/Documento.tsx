// Catálogo en PDF con el diseño original de Divertimania: negro, verde lima, títulos en letra condensada (Anton),
// portada a página completa, bienvenida con índice, aperturas de sección con fotos grandes y fichas con su foto.
// Esta versión es COMPLETA: cada personaje y servicio aparece con su foto y todo su texto.
import path from "node:path";
import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { COBERTURA, PAGOS, PASOS_RESERVA } from "@/lib/negocio";
import { INSTAGRAM_HANDLE } from "@/lib/site";
import { DINAMICAS_POR_PAGINA, FICHAS_POR_PAGINA, type CatalogoPdf, type DinamicasPdf, type FichaPdf, type GrupoPdf } from "./datos";

const NM = path.join(process.cwd(), "node_modules", "@fontsource");
Font.register({ family: "Anton", src: path.join(NM, "anton", "files", "anton-latin-400-normal.woff") });
Font.register({
  family: "Montserrat",
  fonts: [400, 500, 600, 700, 800].map((w) => ({ src: path.join(NM, "montserrat", "files", `montserrat-latin-${w}-normal.woff`), fontWeight: w })),
});
// Sin cortar palabras con guiones.
Font.registerHyphenationCallback((palabra) => [palabra]);

const C = { fondo: "#0b0b0b", panel: "#121212", borde: "#242424", texto: "#f4f4f4", suave: "#b4b4b4", tenue: "#8a8a8a", lima: "#a8ff30" };
const W = 595;
const H = 841;
const PIE = 30;

const s = StyleSheet.create({
  completa: { backgroundColor: C.fondo, color: C.texto, fontFamily: "Montserrat", fontSize: 9 },
  pagina: { backgroundColor: C.fondo, color: C.texto, fontFamily: "Montserrat", fontSize: 9, paddingHorizontal: 32, paddingTop: 30 },
  etiquetaFila: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  etiquetaNum: { backgroundColor: C.lima, width: 20, height: 18, alignItems: "center", justifyContent: "center" },
  etiquetaNumTxt: { color: "#000", fontFamily: "Anton", fontSize: 11 },
  etiquetaTxt: { fontSize: 7, fontWeight: 700, letterSpacing: 2.4, color: C.texto, marginLeft: 8, textTransform: "uppercase" },
  titulo: { fontFamily: "Anton", fontSize: 40, color: C.texto, textTransform: "uppercase", lineHeight: 1.15 },
  lema: { fontSize: 9, fontWeight: 800, letterSpacing: 3, color: C.lima, textTransform: "uppercase", marginTop: 8 },
  tile: { width: 261, height: 216, flexDirection: "row", backgroundColor: C.panel, borderWidth: 1, borderColor: C.borde, overflow: "hidden" },
  tileFoto: { width: 112, height: 216, objectFit: "cover" },
  tileSinFoto: { width: 112, height: 216, backgroundColor: "#1b1b1b", justifyContent: "center", alignItems: "center" },
  tileCuerpo: { flex: 1, paddingVertical: 11, paddingHorizontal: 10 },
  tileNombre: { fontFamily: "Anton", fontSize: 14.5, color: C.texto, textTransform: "uppercase", lineHeight: 1.08, marginBottom: 4 },
  tileTags: { fontSize: 6.8, fontWeight: 700, color: C.lima, letterSpacing: 0.4, marginBottom: 4, textTransform: "uppercase" },
  tileDesc: { fontSize: 7.4, lineHeight: 1.3, color: C.suave, marginBottom: 4 },
  tileItem: { flexDirection: "row", marginBottom: 1.8 },
  tilePunto: { width: 8, fontSize: 7.4, color: C.lima, fontWeight: 800 },
  tileItemTxt: { flex: 1, fontSize: 7.2, lineHeight: 1.28, color: C.texto },
  pie: { position: "absolute", left: 0, right: 0, bottom: 0, height: PIE, backgroundColor: C.fondo, borderTopWidth: 1.5, borderTopColor: C.lima, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 32 },
  pieTxt: { fontSize: 6.8, color: C.suave, letterSpacing: 0.2 },
  pieNum: { fontFamily: "Anton", fontSize: 15, color: C.lima },
  dirLinea: { flexDirection: "row", alignItems: "flex-end", height: 11.2 },
  dirPunteado: { flex: 1, borderBottomWidth: 0.6, borderBottomColor: "#4a4a4a", borderStyle: "dotted", marginHorizontal: 3, marginBottom: 2.5 },
});

const tel = (t: string[]) => t.join("  ·  ");

/** Degradado a negro como imagen PNG (`abajo`: transparente arriba y negro abajo; `arriba`: al revés). */
function Degradado({ datos, tipo, alto, y = 0 }: { datos: CatalogoPdf; tipo: "abajo" | "arriba"; alto: number; y?: number }) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt
    <Image src={{ data: datos.degradados[tipo], format: "png" }} style={{ position: "absolute", left: 0, top: y, width: W, height: alto }} />
  );
}

function Pie({ datos, web }: { datos: CatalogoPdf; web: string }) {
  return (
    <View style={s.pie} fixed>
      <Text style={s.pieTxt}>
        @{INSTAGRAM_HANDLE}   ·   {web ? `${web}   ·   ` : ""}WhatsApp {tel(datos.telefonos)}
      </Text>
      <Text style={s.pieNum} render={({ pageNumber }) => String(pageNumber).padStart(2, "0")} />
    </View>
  );
}

function Etiqueta({ numero, texto }: { numero?: number; texto: string }) {
  return (
    <View style={s.etiquetaFila}>
      {numero ? <View style={s.etiquetaNum}><Text style={s.etiquetaNumTxt}>{String(numero).padStart(2, "0")}</Text></View> : <View style={{ width: 3, height: 18, backgroundColor: C.lima }} />}
      <Text style={s.etiquetaTxt}>{texto}</Text>
    </View>
  );
}

function trozos<T>(lista: T[], n: number): T[][] {
  const r: T[][] = [];
  for (let i = 0; i < lista.length; i += n) r.push(lista.slice(i, i + n));
  return r.length ? r : [[]];
}

function Tile({ f, g }: { f: FichaPdf; g: GrupoPdf }) {
  const tags = [f.duracion, f.edadIdeal, f.soloAdultos ? "+18" : null].filter(Boolean).join("  ·  ");
  return (
    <View id={`f-${g.id}-${f.id}`} style={s.tile} wrap={false}>
      <View>
        {f.foto ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt
          <Image style={s.tileFoto} src={{ data: f.foto, format: "jpg" }} />
        ) : (
          <View style={s.tileSinFoto}>
            <Text style={{ fontFamily: "Anton", fontSize: 13, color: C.lima }}>DIVERTIMANIA</Text>
          </View>
        )}
        {f.masPedido && (
          <Text style={{ position: "absolute", left: 6, top: 6, backgroundColor: C.lima, color: "#000", fontSize: 6, fontWeight: 800, letterSpacing: 1, paddingVertical: 2.5, paddingHorizontal: 5 }}>
            MÁS PEDIDO
          </Text>
        )}
      </View>
      <View style={s.tileCuerpo}>
        <Text style={s.tileNombre}>{f.nombre}</Text>
        {tags ? <Text style={s.tileTags}>{tags}</Text> : null}
        {f.descripcion ? <Text style={s.tileDesc}>{f.descripcion}</Text> : null}
        {f.incluye.map((linea) => (
          <View key={linea} style={s.tileItem}>
            <Text style={s.tilePunto}>•</Text>
            <Text style={s.tileItemTxt}>{linea}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Página de apertura de una sección: fotos grandes, título grande y a qué páginas van sus fichas. */
function Apertura({ g, datos, web }: { g: GrupoPdf; datos: CatalogoPdf; web: string }) {
  const fotos = g.hero;
  const alto = 520;
  const img = (b: Buffer, estilo: object, k: number) => (
    // eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt
    <Image key={k} src={{ data: b, format: "jpg" }} style={{ objectFit: "cover", ...estilo }} />
  );
  let mosaico: React.ReactNode = <View style={{ width: W, height: alto, backgroundColor: "#161616" }} />;
  if (fotos.length === 1) mosaico = img(fotos[0], { width: W, height: alto }, 0);
  else if (fotos.length === 2) mosaico = <View style={{ flexDirection: "row" }}>{fotos.map((b, i) => img(b, { width: W / 2, height: alto }, i))}</View>;
  else if (fotos.length === 3)
    mosaico = (
      <View style={{ flexDirection: "row" }}>
        {img(fotos[0], { width: W / 2, height: alto }, 0)}
        <View>
          {img(fotos[1], { width: W / 2, height: alto / 2 }, 1)}
          {img(fotos[2], { width: W / 2, height: alto / 2 }, 2)}
        </View>
      </View>
    );
  else if (fotos.length >= 4)
    mosaico = (
      <View>
        <View style={{ flexDirection: "row" }}>
          {img(fotos[0], { width: W / 2, height: alto / 2 }, 0)}
          {img(fotos[1], { width: W / 2, height: alto / 2 }, 1)}
        </View>
        <View style={{ flexDirection: "row" }}>
          {img(fotos[2], { width: W / 2, height: alto / 2 }, 2)}
          {img(fotos[3], { width: W / 2, height: alto / 2 }, 3)}
        </View>
      </View>
    );
  const ultima = g.pagina + g.paginasFichas;
  const grande = g.corto.length > 22 ? 40 : g.corto.length > 14 ? 52 : 66;
  return (
    <Page size="A4" style={s.completa}>
      <View id={`g-${g.id}`} style={{ position: "absolute", left: 0, top: 0 }}>
        {mosaico}
      </View>
      <Degradado datos={datos} tipo="abajo" alto={190} y={alto - 190} />
      <View style={{ position: "absolute", left: 32, top: 26 }}>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.72)", paddingRight: 10 }}>
          <View style={s.etiquetaNum}><Text style={s.etiquetaNumTxt}>{String(g.numero).padStart(2, "0")}</Text></View>
          <Text style={s.etiquetaTxt}>Catálogo · sección</Text>
        </View>
      </View>
      <View style={{ position: "absolute", left: 32, right: 32, top: alto + 6 }}>
        <Text style={[s.titulo, { fontSize: grande }]}>{g.corto}</Text>
        <Text style={s.lema}>{g.lema}</Text>
        <Text style={{ fontSize: 10, color: C.suave, marginTop: 12, lineHeight: 1.5, maxWidth: 420 }}>
          {g.fichas.length} fichas, una por una, con su foto y todo lo que incluyen. Encuéntralas en las páginas siguientes.
        </Text>
        <Text style={{ fontSize: 7.4, color: C.tenue, marginTop: 14, lineHeight: 1.6 }}>
          <Text style={{ fontWeight: 800, color: C.lima, letterSpacing: 1.4 }}>EN ESTA SECCIÓN:  </Text>
          {g.fichas.map((f) => f.nombre).join("  ·  ")}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 16, borderTopWidth: 1, borderTopColor: "#2c3a12", borderBottomWidth: 1, borderBottomColor: "#2c3a12" }}>
          {[
            [String(g.fichas.length), "Fichas"],
            [String(g.pagina + 1).padStart(2, "0"), "Desde la página"],
            [String(ultima).padStart(2, "0"), "Hasta la página"],
          ].map(([v, t], i) => (
            <View key={t} style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderLeftWidth: i ? 1 : 0, borderLeftColor: "#2c3a12" }}>
              <Text style={{ fontFamily: "Anton", fontSize: 20, color: C.lima }}>{v}</Text>
              <Text style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: 1.6, color: C.suave, textTransform: "uppercase", marginTop: 2 }}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
      <Pie datos={datos} web={web} />
    </Page>
  );
}

/** Relleno de la última página de un grupo: invita a seguir bajando en vez de dejar el espacio vacío. */
function Continua({ datos, ancho, alto }: { datos: CatalogoPdf; ancho: number; alto: number }) {
  const grande = ancho > 300;
  return (
    <View style={{ width: ancho, height: alto, borderWidth: 1, borderColor: "#2c3a12", backgroundColor: "#0e1508", alignItems: "center", justifyContent: "center", padding: 16 }}>
      {grande && (
        // eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt
        <Image src={{ data: datos.logo, format: "png" }} style={{ width: 130, marginBottom: 14 }} />
      )}
      <Text style={{ fontSize: grande ? 9 : 7.5, fontWeight: 800, letterSpacing: 3.5, color: C.lima, textTransform: "uppercase" }}>Continúa bajando</Text>
      <Text style={{ fontFamily: "Anton", fontSize: grande ? 30 : 19, color: "#fff", textTransform: "uppercase", textAlign: "center", lineHeight: 1.15, marginTop: 8 }}>
        para que descubras la magia de Divertimanía
      </Text>
      <View style={{ width: 36, height: 3, backgroundColor: C.lima, marginTop: grande ? 16 : 10 }} />
    </View>
  );
}

function PaginasFichas({ g, datos, web }: { g: GrupoPdf; datos: CatalogoPdf; web: string }) {
  const paginas = trozos(g.fichas, FICHAS_POR_PAGINA);
  return (
    <>
      {paginas.map((fichas, i) => (
        <Page key={i} size="A4" style={s.pagina}>
          <View style={{ height: 96, marginBottom: 10 }}>
            <Etiqueta numero={g.numero} texto={`${g.titulo}${paginas.length > 1 ? `  ·  parte ${i + 1} de ${paginas.length}` : ""}`} />
            <Text style={[s.titulo, { fontSize: g.corto.length > 22 ? 28 : 36 }]}>{g.corto}</Text>
            <Text style={s.lema}>{g.lema}</Text>
          </View>
          {trozos(fichas, 2).map((fila, r) => (
            <View key={r} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
              {fila.map((f) => (
                <Tile key={f.id} f={f} g={g} />
              ))}
              {fila.length === 1 && (i === paginas.length - 1 ? <Continua datos={datos} ancho={261} alto={216} /> : <View style={{ width: 261 }} />)}
            </View>
          ))}
          {i === paginas.length - 1 && fichas.length > 0 && Math.ceil(fichas.length / 2) < FICHAS_POR_PAGINA / 2 && (
            <Continua datos={datos} ancho={531} alto={(FICHAS_POR_PAGINA / 2 - Math.ceil(fichas.length / 2)) * 226 - 10} />
          )}
          <Pie datos={datos} web={web} />
        </Page>
      ))}
    </>
  );
}

function PaginasDinamicas({ d, datos, web }: { d: DinamicasPdf; datos: CatalogoPdf; web: string }) {
  const paginas = trozos(d.items, DINAMICAS_POR_PAGINA);
  return (
    <>
      {paginas.map((items, i) => (
        <Page key={i} size="A4" style={s.pagina}>
          <View id={i === 0 ? `d-${d.id}` : undefined} style={{ marginBottom: 14 }}>
            <Etiqueta texto={`Dinámicas${paginas.length > 1 ? `  ·  parte ${i + 1} de ${paginas.length}` : ""}`} />
            <Text style={[s.titulo, { fontSize: 36 }]}>{d.titulo}</Text>
            <Text style={s.lema}>Todo lo que podemos jugar</Text>
          </View>
          {items.map((it, k) => (
            <View key={it.nombre} style={{ flexDirection: "row", paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.borde }} wrap={false}>
              <Text style={{ fontFamily: "Anton", fontSize: 22, color: C.lima, width: 44 }}>{String(i * DINAMICAS_POR_PAGINA + k + 1).padStart(2, "0")}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Anton", fontSize: 15, textTransform: "uppercase", color: C.texto }}>{it.nombre}</Text>
                {it.descripcion ? <Text style={{ fontSize: 9, color: C.suave, marginTop: 3, lineHeight: 1.4 }}>{it.descripcion}</Text> : null}
              </View>
            </View>
          ))}
          <Pie datos={datos} web={web} />
        </Page>
      ))}
    </>
  );
}

function GrupoPaginas({ g, datos, web }: { g: GrupoPdf; datos: CatalogoPdf; web: string }) {
  return (
    <>
      <Apertura g={g} datos={datos} web={web} />
      <PaginasFichas g={g} datos={datos} web={web} />
    </>
  );
}

export default function DocumentoCatalogo({ datos, sitio }: { datos: CatalogoPdf; sitio: string }) {
  const anio = new Date().getFullYear();
  // En la copia local no se muestra la dirección (sería localhost).
  const web = sitio.includes("localhost") ? "" : sitio.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const paginaCierre =
    datos.bloques.reduce(
      (fin, b) =>
        b.tipo === "grupo"
          ? Math.max(fin, b.grupo.pagina + b.grupo.paginasFichas)
          : Math.max(fin, b.dinamicas.pagina + Math.max(1, Math.ceil(b.dinamicas.items.length / DINAMICAS_POR_PAGINA)) - 1),
      0
    ) + 1;
  const secciones = datos.indice;
  const pasos = [...PASOS_RESERVA.map((p) => p.titulo), "Disfruta tu fiesta"];

  return (
    <Document title={`Catálogo de servicios Divertimania ${anio}`} author="Divertimania" language="es">
      {/* PORTADA */}
      <Page size="A4" style={s.completa}>
        {datos.portada ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt
          <Image src={{ data: datos.portada, format: "jpg" }} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" }} />
        ) : null}
        <Degradado datos={datos} tipo="arriba" alto={260} />
        <Degradado datos={datos} tipo="abajo" alto={400} y={H - 400} />
        <View style={{ position: "absolute", left: 0, right: 0, top: 34, alignItems: "center" }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt */}
          <Image src={{ data: datos.logo, format: "png" }} style={{ width: 190 }} />
        </View>
        <View style={{ position: "absolute", left: 40, right: 40, bottom: 38, alignItems: "center" }}>
          <Text style={{ fontSize: 13, fontWeight: 800, letterSpacing: 9, color: C.lima }}>CATÁLOGO</Text>
          <Text style={{ fontFamily: "Anton", fontSize: 76, color: "#fff", lineHeight: 1.05, marginTop: 2 }}>DE SERVICIOS</Text>
          <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "stretch", marginTop: 8 }}>
            <View style={{ flex: 1, borderBottomWidth: 1.4, borderBottomColor: C.lima, borderStyle: "dashed" }} />
            <Text style={{ backgroundColor: C.lima, color: "#000", fontFamily: "Anton", fontSize: 19, letterSpacing: 6, paddingVertical: 3, paddingLeft: 14, paddingRight: 8, marginHorizontal: 8 }}>{anio}</Text>
            <View style={{ flex: 1, borderBottomWidth: 1.4, borderBottomColor: C.lima, borderStyle: "dashed" }} />
          </View>
          <Text style={{ fontSize: 10.5, color: C.suave, marginTop: 12 }}>Animación, shows y personajes para fiestas que se recuerdan.</Text>
          <View style={{ flexDirection: "row", alignSelf: "stretch", marginTop: 14, borderTopWidth: 1, borderTopColor: "#2c3a12", borderBottomWidth: 1, borderBottomColor: "#2c3a12" }}>
            {[`${datos.totalFichas} fichas`, "Personajes", "Servicios para tu fiesta", "Celebraciones"].map((t, i) => (
              <View key={t} style={{ flex: 1, alignItems: "center", paddingVertical: 11, borderLeftWidth: i ? 1 : 0, borderLeftColor: "#2c3a12" }}>
                <Text style={{ fontSize: 6.8, fontWeight: 800, letterSpacing: 1.6, color: C.texto, textTransform: "uppercase" }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* BIENVENIDA + ÍNDICE */}
      <Page size="A4" style={s.completa}>
        {datos.bienvenida ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt
          <Image src={{ data: datos.bienvenida, format: "jpg" }} style={{ position: "absolute", left: 0, top: 0, width: 290, height: H - PIE, objectFit: "cover" }} />
        ) : null}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt */}
        <Image src={{ data: datos.degradados.derecha, format: "png" }} style={{ position: "absolute", left: 120, top: 0, width: 180, height: H - PIE }} />
        <View style={{ position: "absolute", left: 300, right: 34, top: 36 }}>
          <Etiqueta texto="Quiénes somos" />
          <Text style={{ fontSize: 8, fontWeight: 800, letterSpacing: 5, color: C.lima, marginTop: 36 }}>BIENVENIDOS A</Text>
          <Text style={{ fontFamily: "Anton", fontSize: 44, color: "#fff", lineHeight: 1.05 }}>
            DIVERTI<Text style={{ color: C.lima }}>MANIA</Text>
          </Text>
          <Text style={{ fontSize: 9.5, color: C.suave, lineHeight: 1.5, marginTop: 10 }}>
            Desde San Cristóbal llevamos animación, shows y personajes a cumpleaños, 15 años, bodas y eventos de empresa en toda Venezuela, con equipo propio.
          </Text>
          <View style={{ marginTop: 18 }}>
            {secciones.slice(0, 7).map((x) => (
              <Link key={x.destino} src={`#${x.destino}`} style={{ textDecoration: "none" }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#26330f" }}>
                  <Text style={{ fontFamily: "Anton", fontSize: 20, color: C.lima, width: 34 }}>{String(x.numero).padStart(2, "0")}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Anton", fontSize: 11.5, color: "#fff", textTransform: "uppercase" }}>{x.titulo}</Text>
                    <Text style={{ fontSize: 7, color: C.tenue, marginTop: 1 }}>{x.detalle}</Text>
                  </View>
                  <Text style={{ fontSize: 7, fontWeight: 800, letterSpacing: 1, color: C.lima }}>PÁG. {String(x.pagina).padStart(2, "0")}</Text>
                </View>
              </Link>
            ))}
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
              <Text style={{ fontFamily: "Anton", fontSize: 20, color: C.lima, width: 34 }}>{String(secciones.length + 1).padStart(2, "0")}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Anton", fontSize: 11.5, color: "#fff", textTransform: "uppercase" }}>Aparta tu fecha</Text>
                <Text style={{ fontSize: 7, color: C.tenue, marginTop: 1 }}>Cómo reservar y pagar</Text>
              </View>
              <Text style={{ fontSize: 7, fontWeight: 800, letterSpacing: 1, color: C.lima }}>PÁG. {String(paginaCierre).padStart(2, "0")}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", backgroundColor: C.lima, marginTop: 16 }}>
            {[[datos.seguidores, "Seguidores"], [`+${datos.totalFichas}`, "Fichas con foto"], ["Toda", "Venezuela"]].map(([v, t], i) => (
              <View key={t} style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderLeftWidth: i ? 1 : 0, borderLeftColor: "#8fd51f" }}>
                <Text style={{ fontFamily: "Anton", fontSize: 17, color: "#000" }}>{v}</Text>
                <Text style={{ fontSize: 5.8, fontWeight: 800, letterSpacing: 1.2, color: "#000", textTransform: "uppercase", marginTop: 2 }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <Pie datos={datos} web={web} />
      </Page>

      {/* DIRECTORIO */}
      {datos.directorio.map((lineas, p) => (
        <Page key={`dir-${p}`} size="A4" style={s.pagina}>
          <Etiqueta texto="Directorio" />
          <Text style={[s.titulo, { fontSize: 38 }]}>Directorio{datos.paginasDirectorio > 1 ? ` ${p + 1}/${datos.paginasDirectorio}` : ""}</Text>
          <Text style={s.lema}>Todos los personajes y servicios</Text>
          <Text style={{ fontSize: 8, color: C.tenue, marginTop: 6, marginBottom: 14 }}>Toca un nombre para ir directo a su página.</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {trozos(lineas, Math.ceil(lineas.length / 2)).map((col, c) => (
              <View key={c} style={{ width: "48.5%" }}>
                {col.map((l) => {
                  const grupo = l.tipo === "grupo";
                  const estilo = grupo
                    ? { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: C.lima, textDecoration: "none" as const }
                    : { fontFamily: "Helvetica", fontSize: 8.2, color: C.texto, textDecoration: "none" as const };
                  return (
                    <View key={l.destino} style={[s.dirLinea, grupo ? { marginTop: 6, height: 13 } : {}]}>
                      <Link src={`#${l.destino}`} style={[estilo, grupo ? {} : { marginLeft: 8 }]}>
                        {grupo ? l.texto.toUpperCase() : l.texto}
                      </Link>
                      <View style={s.dirPunteado} />
                      <Link src={`#${l.destino}`} style={estilo}>
                        {String(l.pagina).padStart(2, "0")}
                      </Link>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
          <Pie datos={datos} web={web} />
        </Page>
      ))}

      {/* SECCIONES */}
      {datos.bloques.map((b, i) =>
        b.tipo === "grupo" ? (
          <GrupoPaginas key={i} g={b.grupo} datos={datos} web={web} />
        ) : (
          <PaginasDinamicas key={i} d={b.dinamicas} datos={datos} web={web} />
        )
      )}

      {/* APARTA TU FECHA */}
      <Page size="A4" style={s.completa}>
        {datos.cierre ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt
          <Image src={{ data: datos.cierre, format: "jpg" }} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" }} />
        ) : null}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt */}
        <Image src={{ data: datos.degradados.velo, format: "png" }} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />
        <View id="g-cierre" style={{ position: "absolute", left: 0, right: 0, top: 36, alignItems: "center" }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt */}
          <Image src={{ data: datos.logo, format: "png" }} style={{ width: 110 }} />
          <Text style={{ fontFamily: "Anton", fontSize: 44, color: "#fff", marginTop: 18, lineHeight: 1.2, textTransform: "uppercase" }}>Aparta tu fecha</Text>
        </View>
        <View style={{ position: "absolute", left: 40, right: 40, top: 215 }}>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            {pasos.map((t, i) => (
              <View key={t} style={{ flex: 1, alignItems: "center", paddingVertical: 14, paddingHorizontal: 6, borderWidth: 1, borderColor: "#2c3a12", marginLeft: i ? -1 : 0 }}>
                <Text style={{ fontFamily: "Anton", fontSize: 26, color: "#fff" }}>{i + 1}</Text>
                <Text style={{ fontSize: 7.2, color: C.suave, textAlign: "center", marginTop: 3 }}>{t}</Text>
              </View>
            ))}
          </View>
          <View style={{ backgroundColor: C.lima, padding: 18 }}>
            <Text style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 2, color: "#000", textAlign: "center" }}>ESCANEA Y COTIZA POR WHATSAPP</Text>
            <Text style={{ fontSize: 7.5, color: "#1a2a00", textAlign: "center", marginTop: 2 }}>Elige el número que prefieras</Text>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 14 }}>
              {datos.qrs.map((q, i) => (
                <View key={q.texto} style={{ alignItems: "center", marginLeft: i ? 34 : 0 }}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt */}
                  <Image src={{ data: q.qr, format: "png" }} style={{ width: 118, height: 118 }} />
                  <Text style={{ fontFamily: "Anton", fontSize: 17, color: "#000", marginTop: 8 }}>{q.texto}</Text>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 8, fontWeight: 700, color: "#000", textAlign: "center", marginTop: 14 }}>Pagos: {PAGOS.metodos.join(" · ")}</Text>
            <Text style={{ fontSize: 7.4, color: "#1a2a00", textAlign: "center", marginTop: 3 }}>{PAGOS.anticipo}</Text>
          </View>
          <Text style={{ fontSize: 8, color: C.suave, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>{COBERTURA.texto}</Text>
        </View>
        <Pie datos={datos} web={web} />
      </Page>
    </Document>
  );
}

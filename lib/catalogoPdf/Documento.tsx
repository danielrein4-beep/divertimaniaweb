// Diseño del catálogo PDF con los colores de la marca: negro, lima del logo y títulos Baloo.
import path from "node:path";
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { COBERTURA } from "@/lib/negocio";
import { INSTAGRAM_HANDLE } from "@/lib/site";
import type { CatalogoPdf, ServicioPdf } from "./datos";

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
  pagina: { backgroundColor: C.fondo, color: C.texto, fontFamily: "Helvetica", fontSize: 9, paddingTop: 36, paddingBottom: 44, paddingHorizontal: 32 },
  portada: { backgroundColor: C.fondo, color: C.texto, fontFamily: "Helvetica", padding: 48, justifyContent: "center", alignItems: "center" },
  portadaBanda: { position: "absolute", left: 0, right: 0, bottom: 0, height: 160, backgroundColor: C.morado },
  titulo: { fontFamily: "Baloo", fontWeight: 800, fontSize: 40, color: C.lima, marginTop: 24 },
  subtitulo: { fontSize: 13, color: C.texto, marginTop: 6, textAlign: "center" },
  seccion: { flexDirection: "row", alignItems: "center", marginBottom: 12, marginTop: 6 },
  seccionBarra: { width: 6, height: 26, borderRadius: 3, marginRight: 10, flexShrink: 0 },
  seccionNombre: { fontFamily: "Baloo", fontWeight: 800, fontSize: 22 },
  grilla: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  tarjeta: { width: "48.5%", backgroundColor: C.tarjeta, borderRadius: 10, borderWidth: 1, borderColor: C.borde, marginBottom: 12, overflow: "hidden" },
  foto: { width: "100%", height: 150, objectFit: "cover" },
  sinFoto: { width: "100%", height: 70, backgroundColor: C.morado, justifyContent: "center", alignItems: "center" },
  cuerpo: { padding: 10 },
  nombre: { fontFamily: "Baloo", fontWeight: 700, fontSize: 13, color: C.texto, marginBottom: 3 },
  descripcion: { color: C.suave, marginBottom: 5 },
  item: { flexDirection: "row", marginBottom: 2 },
  punto: { color: C.lima, width: 9 },
  etiquetas: { flexDirection: "row", flexWrap: "wrap", marginTop: 5 },
  etiqueta: { fontSize: 7.5, borderWidth: 1, borderColor: C.borde, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 6, marginRight: 4, marginTop: 3, color: C.texto },
  pie: { position: "absolute", bottom: 18, left: 32, right: 32, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: C.suave },
});

function Tarjeta({ servicio, color }: { servicio: ServicioPdf; color: string }) {
  const etiquetas = [
    servicio.masPedido ? "Más pedido" : null,
    servicio.duracion ? `Duración: ${servicio.duracion}` : null,
    servicio.edadIdeal ? `Edad: ${servicio.edadIdeal}` : null,
    servicio.soloAdultos ? "+18" : null,
  ].filter((e): e is string => Boolean(e));
  return (
    <View style={s.tarjeta} wrap={false}>
      {servicio.foto ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt
        <Image style={s.foto} src={{ data: servicio.foto, format: "jpg" }} />
      ) : (
        <View style={[s.sinFoto, { borderBottomWidth: 3, borderBottomColor: color }]}>
          <Text style={{ fontFamily: "Baloo", fontWeight: 800, fontSize: 14, color: C.lima }}>Divertimania</Text>
        </View>
      )}
      <View style={s.cuerpo}>
        <Text style={s.nombre}>{servicio.nombre}</Text>
        {servicio.descripcion ? <Text style={s.descripcion}>{servicio.descripcion}</Text> : null}
        {servicio.incluye.map((linea) => (
          <View key={linea} style={s.item}>
            <Text style={s.punto}>•</Text>
            <Text style={{ flex: 1 }}>{linea}</Text>
          </View>
        ))}
        {etiquetas.length > 0 && (
          <View style={s.etiquetas}>
            {etiquetas.map((e) => (
              <Text key={e} style={[s.etiqueta, e === "Más pedido" ? { borderColor: C.lima, color: C.lima } : {}]}>{e}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function filasDeDos<T>(lista: T[]): T[][] {
  const filas: T[][] = [];
  for (let i = 0; i < lista.length; i += 2) filas.push(lista.slice(i, i + 2));
  return filas;
}

export default function DocumentoCatalogo({ datos, sitio }: { datos: CatalogoPdf; sitio: string }) {
  const anio = new Date().getFullYear();
  // En la copia local no se muestra la dirección (sería localhost).
  const web = sitio.includes("localhost") ? "" : `  ·  ${sitio.replace(/^https?:\/\//, "")}`;
  return (
    <Document title={`Catálogo Divertimania ${anio}`} author="Divertimania" language="es">
      <Page size="A4" style={s.portada}>
        <View style={s.portadaBanda} fixed />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt */}
        <Image src={{ data: datos.logo, format: "png" }} style={{ width: 300 }} />
        <Text style={s.titulo}>Catálogo {anio}</Text>
        <Text style={s.subtitulo}>Personajes, shows y animación para toda clase de celebraciones</Text>
        <Text style={[s.subtitulo, { color: C.lima, fontSize: 11, marginTop: 14 }]}>{COBERTURA.titulo}</Text>
        <Text style={{ position: "absolute", bottom: 64, left: 0, right: 0, textAlign: "center", fontSize: 11 }}>
          WhatsApp {datos.whatsappTexto}  ·  @{INSTAGRAM_HANDLE}{web}
        </Text>
      </Page>

      {/* Las secciones van seguidas; el título nunca queda solo al final de una página. */}
      <Page size="A4" style={s.pagina}>
        {datos.secciones.map((seccion) => (
          <View key={seccion.nombre}>
            {filasDeDos(seccion.servicios).map((fila, i) => (
              // El título va pegado a la primera fila para que nunca quede solo al pie de una página.
              <View key={fila[0].id} wrap={false}>
                {i === 0 && (
                  <View style={s.seccion}>
                    <View style={[s.seccionBarra, { backgroundColor: seccion.color }]} />
                    <Text style={[s.seccionNombre, { color: seccion.color }]}>{seccion.nombre}</Text>
                  </View>
                )}
                <View style={s.grilla}>
                  {fila.map((servicio) => (
                    <Tarjeta key={servicio.id} servicio={servicio} color={seccion.color} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
        <View style={s.pie} fixed>
          <Text>Divertimania · Catálogo {anio}</Text>
          <Text>Cotiza por WhatsApp {datos.whatsappTexto}</Text>
          <Text render={({ pageNumber }) => `${pageNumber}`} />
        </View>
      </Page>

      <Page size="A4" style={s.portada}>
        <Text style={[s.titulo, { marginTop: 0, fontSize: 30, textAlign: "center" }]}>¿Armamos tu fiesta?</Text>
        <Text style={[s.subtitulo, { marginBottom: 24 }]}>Escanea el código y escríbenos por WhatsApp. Te mandamos la cotización.</Text>
        <View style={{ backgroundColor: "#ffffff", padding: 10, borderRadius: 12 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, no lleva alt */}
          <Image src={{ data: datos.whatsappQr, format: "png" }} style={{ width: 200, height: 200 }} />
        </View>
        <Text style={{ fontFamily: "Baloo", fontWeight: 800, fontSize: 20, color: C.lima, marginTop: 20 }}>{datos.whatsappTexto}</Text>
        <Text style={[s.subtitulo, { fontSize: 11 }]}>@{INSTAGRAM_HANDLE}{web}</Text>
        <Text style={[s.subtitulo, { fontSize: 10, color: C.suave, marginTop: 18, maxWidth: 380 }]}>{COBERTURA.texto}</Text>
      </Page>
    </Document>
  );
}

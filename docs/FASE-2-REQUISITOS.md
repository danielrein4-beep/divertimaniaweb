# Divertimania — Fase 2: brief para Antigravity

> Este documento es el punto de partida para planificar (no implementar todavía)
> los siguientes requisitos, recogidos en una reunión con los dueños de
> Divertimania. Léelo completo antes de tocar código. Al final se explica
> exactamente qué debes entregar.

## 1. Contexto del proyecto

**Repositorio:** https://github.com/danielrein4-beep/divertimaniaweb (rama `main`)

Es el sitio web real de **Divertimania**, una empresa de animación de eventos
(fiestas infantiles, 15 años, bodas, baby showers, corporativos) en Táchira,
Venezuela. El sitio ya está en producción de desarrollo (`npm run dev`) y
tiene contenido real (fotos, videos, catálogo) — no es una maqueta.

**Stack:**
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (sin archivo de config, tokens en `app/globals.css`)
- Prisma ORM + SQLite en desarrollo (`prisma/schema.prisma`, `prisma/seed.ts`)
- GSAP para animaciones (`components/site/MaskedHeading.tsx`,
  `components/site/AccordionGallery.tsx`, `components/site/Hero.tsx`)
- Autenticación de admin con sesión firmada (JWT en cookie, ver `lib/auth.ts`
  y `middleware.ts`) — sin roles, un solo usuario admin

**Identidad visual:** fondo oscuro (`#0a0a0f`), acento verde neón (`#9dff3c`),
tipografía bold/redondeada. Ver `app/globals.css` para los tokens de color
completos y `components/site/PlaceholderImage.tsx` para el patrón de
"tarjeta sin foto todavía".

**Estructura actual del sitio público:**
- `/` — Home: `Hero` (video de fondo con texto animado + mosaico de reels
  como intro) → `AccordionGallery` de categorías → destacados → CTA
- `/catalogo` — lista de `Servicio` filtrable por categoría (plana, una
  tarjeta por servicio)
- `/galeria` — mosaico de fotos
- `/disponibilidad` — calendario público informativo (no bloquea fechas)
- `/contacto` — formulario + botón de WhatsApp

**Panel admin** (`/admin`, protegido):
- `/admin/dashboard` — calendario de eventos
- `/admin/eventos` — CRUD de eventos, con asignación de `Recurso` (trajes,
  equipos, personal) y **detección de conflictos** cuando dos eventos que se
  solapan en horario piden el mismo recurso limitado (ver `lib/conflicts.ts`)
- `/admin/recursos` — CRUD de inventario (`components/admin/RecursosManager.tsx`
  es el patrón de referencia para cualquier CRUD nuevo)
- `/admin/solicitudes` — bandeja de mensajes del formulario de contacto

**Modelo de datos actual** (`prisma/schema.prisma`):
```
Cliente, Evento, Servicio (categoria, nombre, descripcion, fotoUrl, orden),
EventoServicio, Recurso, EventoRecurso, SolicitudContacto, AdminUser
```
`Servicio` es **plano**: una categoría (`Fiestas Infantiles`, `Baby Shower`,
`Personajes`, `Show para Adultos`, `Estación Creativa`, `Atracciones`) con una
lista de servicios/personajes dentro, cada uno con una sola foto. Las
categorías están hardcodeadas en `lib/site.ts` (`CATEGORIAS`).

**Primer paso obligatorio:** clona el repo, corre `npm install`,
`npm run db:seed` y `npm run dev`, y navega el sitio completo (público +
admin, usuario `admin` / contraseña `divertimania2024`) para entender los
patrones existentes antes de proponer nada nuevo. No repitas patrones que ya
existen con otro nombre.

---

## 2. Los 4 requisitos del cliente (tal cual los pidieron, ya limpios)

### Requisito 1 — Sección de Recreadores / Equipo
Quieren una sección profesional que muestre a su equipo de recreadores: foto
profesional de cada quien, nombre, cargo y características/descripción de esa
persona.

### Requisito 2 — Catálogo de juegos y dinámicas por tipo de evento
Divertimania no solo anima: para cada tipo de evento ofrecen un paquete de
dinámicas/juegos recreativos (ej. más de 7 juegos distintos solo para baby
showers, otro set para eventos de adultos, otro para infantiles). Quieren que
al entrar a una categoría (ej. "Baby Shower") se despliegue **todo** lo que
se ofrece para ese tipo de evento — lo básico (DJ, animación) y además una
lista de dinámicas, cada una con: video corto, título y descripción — y que
el cliente pueda **elegir** cuáles quiere para su evento.

### Requisito 3 — Panel de novedades en el Hero
Dentro de la secuencia de animación del Hero (el mosaico de reels + el texto
"DIVIERTE TUS FIESTAS"), agregar unos segundos para un panel de novedades:
por ejemplo, si se acerca Halloween, mostrar ahí sus próximos shows o
disponibilidad para esa fecha. Este panel lo actualiza el propio equipo de
Divertimania aproximadamente cada 15 días — necesitan poder editarlo sin
tocar código.

### Requisito 4 — Catálogo con navegación en profundidad y variantes
Ejemplo de flujo que quieren: el cliente entra, elige "cumpleaños", ve
"Personajes", elige "Princesas Disney", ve la lista de princesas disponibles,
elige "Rapunzel", y ahí ve las **variantes**: "show de Rapunzel sola",
"Rapunzel con el príncipe", "con todos los personajes", etc. — cada variante
con su propia descripción y, como en todo el catálogo, un botón de venta
directa a WhatsApp.

---

## 3. Lectura técnica de esos 4 requisitos (para que planifiques con esto en mente)

**Importante:** los requisitos 2 y 4 **son el mismo problema de fondo**. Ambos
necesitan que `Servicio` deje de ser plano y se convierta en una estructura
jerárquica con opciones seleccionables (dinámicas en un caso, variantes de
personaje en el otro). No los planifiques ni los implementes como dos parches
separados — diseña **un solo modelo de catálogo jerárquico** que sirva para
los dos casos (una "hoja" del catálogo puede ser un personaje con variantes,
o una categoría con dinámicas seleccionables; el mecanismo de fondo —
"opciones dentro de una categoría, cada una con su descripción/video y un
botón directo a WhatsApp" — es el mismo).

Con eso en mente, así los clasificaría por qué tan listos están para
implementar directo vs. cuánto diseño previo necesitan:

- **Requisito 1 (Equipo):** listo para implementar con diseño mínimo. Es un
  modelo nuevo (`Recreador`) + una página pública + un CRUD en admin, sin
  dependencias de los otros requisitos.
- **Requisito 3 (Panel de novedades):** listo para implementar con diseño
  mínimo. Modelo nuevo (`Novedad`) + CRUD en admin + una fase nueva en el
  ciclo del `Hero`/`IntroMontage`. Sí requiere decidir la mecánica exacta de
  cuándo y cuánto tiempo se muestra dentro del ciclo existente
  (`IntroMontage` → `MaskedHeading` → 50s → repetir).
- **Requisitos 2 y 4 (catálogo jerárquico + selección):** necesitan diseño
  previo real antes de tocar código, porque implican rediseñar el modelo de
  datos del catálogo completo (`Servicio` deja de ser plano) y la UX de
  navegación (breadcrumbs, cuántos niveles de profundidad, cómo se ve en
  mobile un árbol de 3-4 niveles). Además hay que decidir cómo se manejan los
  videos cortos de cada dinámica (el repo ya pesa bastante por los 12 reels
  del hero — no metas más video pesado sin plan de compresión/hosting).

---

## 4. Preguntas abiertas que el plan debe responder o al menos plantear explícitamente

No asumas la respuesta — decláralas como decisiones pendientes en tu plan:

1. **Fotos y videos nuevos:** hoy todo el contenido multimedia se agrega
   copiando archivos a mano en `public/images/` y `public/reels/` (no hay
   subida de archivos desde el admin). Con `Recreador` (fotos de cada
   persona) y las dinámicas (un video corto por juego) esto se vuelve mucho
   contenido. ¿Seguimos con el flujo manual o hace falta una función de
   subida de archivos en el panel admin?
2. **Precios:** ¿el catálogo con variantes (Requisito 4) debe mostrar precio
   público, o todo sigue siendo "consultar por WhatsApp" como hasta ahora?
3. **Mensaje de WhatsApp:** cuando el cliente selecciona dinámicas (Requisito
   2) o una variante de personaje (Requisito 4), ¿el botón de WhatsApp debe
   pre-llenar el mensaje con lo que eligió (ej. "Hola, quiero cotizar:
   Rapunzel con el príncipe")? Es el patrón más útil, pero decláralo como
   decisión de diseño, no lo des por hecho.
4. **Persistencia de la selección de dinámicas:** si el cliente marca 5
   juegos y navega a otra página, ¿se pierde la selección? Proponer si hace
   falta guardarla (localStorage) o si con que llegue al botón de WhatsApp
   en la misma vista alcanza para la primera versión.
5. **Panel de novedades:** ¿se muestra en cada ciclo del Hero (cada ~55s) o
   solo la primera vez que el visitante carga la página en la sesión?

---

## 5. Qué debes entregar (esto es una tarea de PLANIFICACIÓN, no de código)

Para cada uno de los 4 requisitos, entrega:

1. **Modelo de datos propuesto** (cambios a `prisma/schema.prisma`, como
   diff o como nuevos modelos completos)
2. **Rutas y componentes** nuevos o modificados, siguiendo los patrones que
   ya existen en el repo (nombra archivos concretos)
3. **Cambios en el panel admin** necesarios para que el equipo de
   Divertimania pueda mantener ese contenido solo, sin ayuda técnica
4. **Decisiones abiertas** que ese requisito necesita (usa la lista de la
   sección 4 como mínimo, agrega las que encuentres)
5. **Complejidad/riesgo estimado** (bajo/medio/alto) y por qué

Al final, agrega:

- **Un orden de implementación sugerido** entre los 4 requisitos, con
  justificación (qué depende de qué, qué es más rápido de entregar primero)
- Marca explícitamente cuáles de los 4 requisitos consideras **listos para
  pasar a implementación tal cual** y cuáles **necesitan que resolvamos las
  decisiones abiertas primero** con el equipo de Divertimania

**No escribas código todavía.** Este plan lo va a revisar Claude (el asistente
que construyó el sitio hasta ahora) antes de que se implemente nada, para
verificar que sea consistente con la arquitectura existente. Entrega el plan
como un documento markdown.

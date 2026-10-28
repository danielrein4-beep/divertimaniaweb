# Divertimania

Sitio web y panel de administración de **Divertimania**, empresa de animación, personajes y shows
para fiestas con base en San Cristóbal (Táchira) y cobertura en toda Venezuela.

- **Sitio público:** catálogo con fichas, fotos y videos; «Mi fiesta» para armar la cotización y
  enviarla por WhatsApp; consulta de fechas; galería; equipo; preguntas frecuentes; catálogo en PDF.
- **Panel (`/admin`):** resultados de visitas y contactos, solicitudes, calendario y eventos con
  aviso de cruces de inventario, catálogo (orden arrastrando, secciones, qué sale en la web y en el
  PDF), equipo, novedades de temporada y ajustes.

## Tecnología

| Capa | Herramienta |
|---|---|
| Aplicación | Next.js 16 (App Router), React 19, TypeScript estricto |
| Estilos | Tailwind CSS 4, GSAP para animaciones |
| Datos | Prisma 5 con SQLite (un solo archivo, en un volumen del servidor) |
| PDF | @react-pdf/renderer + sharp (fotos reducidas) + qrcode |
| Pruebas | Vitest, con una base SQLite temporal |

## Correr en local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run setup   # crea .env, aplica las migraciones y carga el catálogo de ejemplo
npm run dev     # http://localhost:3000
```

El panel está en `/admin`. La clave del primer usuario (`admin`) sale de la variable
`ADMIN_CLAVE_INICIAL`; si no la defines, el seed usa una de prueba solo para trabajar en local.
Cámbiala desde **Ajustes** apenas entres.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Sitio en modo desarrollo |
| `npm run build` | Compila para producción |
| `npm test` | Pruebas automáticas (no tocan `prisma/dev.db`) |
| `npm run lint` | Revisión de estilo y errores comunes |
| `npm run db:seed` | Vuelve a cargar el catálogo de ejemplo (**borra todo**) |
| `npm run videos` | Comprime los videos de `public/` |

## Cómo está organizado

```
app/
  (public)/          páginas del sitio: inicio, catálogo y ficha, PDF, galería, equipo, contacto…
  admin/             panel: login y pantallas protegidas
  api/               rutas del servidor (validan con zod y exigen sesión si son del panel)
components/
  site/              piezas del sitio público
  admin/             panel: marco, encabezado común, listas y formularios
    catalogo/        orden arrastrando, filas de servicio, vista previa de secciones
    servicio/        partes del editor de un servicio
    evento/          partes del formulario de evento
    opciones/        variantes y dinámicas de un servicio
    resultados/      gráficos de la pantalla Resultados
  mifiesta/          lista de cotización del cliente
  ui/                piezas genéricas (tarjeta de servicio, hoja deslizable…)
lib/
  servidor.ts        cliente del panel para hablar con el servidor (errores y sesión)
  catalogoPdf/       datos y diseño del catálogo en PDF
  negocio.ts         cobertura, pagos, preguntas y testimonios que se muestran en el sitio
  limiteIntentos.ts  tope de intentos por IP (login y formulario de contacto)
  conflicts.ts       cruces de inventario entre eventos que se solapan
prisma/
  schema.prisma      modelo de datos
  migrations/        historial de cambios de la base
  datos/             catálogo, inventario, equipo y fotos iniciales
  seed.ts            carga esos datos en una base vacía
pruebas/             pruebas automáticas
proxy.ts             protege /admin y las rutas privadas de la API
```

## Decisiones

- **Seguridad:** sesión del panel firmada (JWT en cookie `httpOnly`), contraseña con bcrypt,
  tope de intentos en el login, cabeceras contra clickjacking y sin `X-Powered-By`. Ningún secreto
  vive en el código: todo va en variables de entorno.
- **Datos de negocio en un solo lugar:** lo que cambia con el negocio (ciudades, formas de pago,
  preguntas frecuentes) está en `lib/negocio.ts`.
- **Catálogo PDF:** se arma con lo que hay en el panel, en el mismo orden, y se vuelve a generar
  solo cuando algo cambia.
- **Mediciones propias:** visitas y toques a WhatsApp se guardan en la base del sitio, sin
  servicios externos ni cookies de terceros.

## Publicar

Se publica con Docker en Coolify; la guía paso a paso está en
[`docs/PUBLICAR-COOLIFY.md`](docs/PUBLICAR-COOLIFY.md).

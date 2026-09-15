# Divertimania — Propuesta de sitio web

Proyecto independiente (no forma parte de aurora-plus). Sitio público con catálogo de
servicios y un panel de administración con calendario de eventos y control de recursos.

## Requisitos

- Node.js 18+
- npm

## Cómo correr todo en local

```bash
npm install
npm run db:seed   # crea/reinicia la base de datos SQLite con datos de ejemplo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Acceso al panel admin

[http://localhost:3000/admin/login](http://localhost:3000/admin/login)

- Usuario: `admin`
- Contraseña: `divertimania2024`

## Qué incluye

**Sitio público**
- Home, catálogo por categoría, galería, contacto (formulario que llega a la bandeja de
  solicitudes del admin) y un calendario de disponibilidad informativo.

**Panel admin** (`/admin`)
- Calendario de eventos con creación/edición
- Asignación de recursos (trajes, equipos, personal) a cada evento, con **aviso de
  conflicto** cuando un recurso queda sobre-asignado entre eventos que se solapan en
  horario — sin bloquear la creación de eventos simultáneos, ya que Divertimania sí puede
  cubrir varios eventos el mismo día con distintos equipos.
- Gestión de inventario de recursos (cantidad disponible por recurso)
- Bandeja de solicitudes de contacto del formulario público

## Notas de diseño

- Paleta e identidad basadas en el Instagram de Divertimania (@divertimania2): fondo
  oscuro con acentos verde neón, dorado y magenta.
- Las fotos son placeholders con la misma paleta — para producción, reemplazar por fotos
  reales del equipo (ver `components/site/PlaceholderImage.tsx` y los `fotoUrl` en el
  modelo de datos).
- Base de datos SQLite local (`prisma/dev.db`) — portable a Postgres para producción
  cambiando el `datasource` en `prisma/schema.prisma`.

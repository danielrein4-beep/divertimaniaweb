# Publicar Divertimania en Coolify (VPS de Aurora)

Divertimania corre en el mismo VPS de Aurora (Hostinger, Coolify), en un contenedor aparte.
No comparte base, claves ni archivos con Aurora.

## 1. Dominio
- Comprar el dominio (por ejemplo `divertimania.com.ve` en NIC.ve o un `.com`).
- En el DNS del dominio: registro **A** de `@` y de `www` apuntando a `2.25.251.103`.

## 2. Recurso nuevo en Coolify
1. Proyecto nuevo «Divertimania» → **+ New Resource** → Public/Private Repository (GitHub).
2. Repo `danielrein4-beep/divertimaniaweb`, rama de producción.
3. Build Pack: **Dockerfile** (usa el `Dockerfile` de la raíz). Puerto: **3000**.
4. Domains: `https://divertimania.com.ve,https://www.divertimania.com.ve` (Coolify saca el SSL solo).

## 3. Volumen persistente (obligatorio)
Storages → **+ Add** → Volume Mount:
- Name: `divertimania-data`
- Destination Path: `/data`

Ahí viven la base (`/data/divertimania.db`) y las fotos subidas desde el panel (`/data/uploads`).
Sin este volumen, cada actualización borra todo.

## 4. Variables de entorno (en Coolify, nunca en el código)
| Variable | Valor |
|---|---|
| `SESSION_SECRET` | texto aleatorio largo (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | `https://divertimania.com.ve` (marcar también «Build Variable») |
| `ADMIN_CLAVE_INICIAL` | clave del panel para el primer arranque |

`DATABASE_URL` y `UPLOADS_DIR` ya vienen en el Dockerfile.

## 5. Límite de recursos (para no frenar a Aurora)
Advanced → Resource Limits: memoria **512 MB**, CPU **0.5**.

## 6. Primer arranque
- `scripts/arrancar.mjs` aplica las migraciones y, **solo si la base está vacía**, carga el catálogo
  inicial con el seed. Si ya hay datos, no toca nada.
- Entrar a `/admin/login` (usuario `admin`, la clave de `ADMIN_CLAVE_INICIAL`) y cambiarla en Ajustes.
- Las fotos que se subieron en la copia local (`uploads/`) no viajan: subirlas otra vez desde el panel
  o copiarlas al volumen.

## 7. Respaldo
Sumar el volumen `divertimania-data` al respaldo cifrado a B2 que ya corre para Aurora.

## 8. Después de publicar
- Google Search Console: verificar el dominio y enviar `https://divertimania.com.ve/sitemap.xml`.
- Perfil de Empresa en Google Maps con el enlace al sitio.

# Despliegue en Vercel

## Qué queda disponible

La web institucional (`/`, `/padel`) y la propuesta (`/propuesta`) usan Next.js nativo. El despliegue no requiere credenciales para esas páginas. Se mantiene `noindex` hasta aprobar contenido y dominio definitivos.

Los módulos de socios, pagos, ingresos y reservas todavía dependen de Cloudflare D1 y de identidad de Sites. En Vercel las pantallas privadas muestran un aviso y todas las rutas `/api/*` responden 503 sin acceder a datos. Las cabeceras `oai-authenticated-*` enviadas por visitantes no autentican usuarios. No se habilita una identidad compartida de demostración en producción.

## Configuración

- Repositorio: `alexmp2602/gold-gym-mercedes`, rama `main`.
- Root Directory: raíz del repositorio.
- Framework Preset: Next.js.
- Build Command: `pnpm run build:vercel` (definido en `vercel.json`).
- Output Directory: `.next-vercel` (definido en `vercel.json`).
- Node.js: 22.x (fijado en `package.json`).
- Instalación: pnpm con el lockfile versionado.

Si existen overrides manuales diferentes en el proyecto de Vercel, quitarlos o alinearlos con estos valores. Volver a desplegar el commit nuevo; volver a desplegar el snapshot `f471071` conserva el error original.

El fallo `routes-manifest.json couldn't be found` se producía porque `pnpm build` ejecutaba Vinext y generaba `dist`, mientras Vercel esperaba la salida de Next.js. Cambiar solamente Output Directory a `dist` no adapta el backend de Workers a Vercel.

## Validación local

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm run build:vercel
pnpm run test:vercel
```

La prueba inicia un servidor Next de producción, comprueba páginas públicas y recursos, verifica el bloqueo de las pantallas privadas y prueba GET/POST en todas las API con cabeceras de identidad falsificadas. No equivale a una validación del despliegue remoto de Vercel.

Para desarrollo Next: `pnpm dev:vercel`. Para servir el build Next: `pnpm start:vercel`.

Los comandos `pnpm dev`, `pnpm build` y `pnpm start` conservan el runtime de Cloudflare. El alias `@club/runtime` separa sus bindings de la compilación Next. No copiar las variables o cabeceras de identidad de Sites a Vercel como sustituto de autenticación.

## Próximo hito: gestión independiente

Antes de habilitarla en Vercel faltan autenticación propia (sesiones, recuperación, invitaciones), base persistente con transacciones compatibles, provisión explícita del dueño del club, migración de datos y permisos, respaldos automáticos y pruebas de restauración. No asignar rol de dueño por el solo hecho de iniciar sesión con un proveedor nuevo.

Luego: anulaciones/devoluciones auditadas, paginación de listados, monitoreo y límites de solicitudes. El molinete requiere conocer su controlador/protocolo y probarlo físicamente. Los cobros actuales son registros manuales; no procesan pagos online.

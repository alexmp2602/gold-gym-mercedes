# Arquitectura y continuidad técnica

## Stack

React 19 y APIs App Router de Next.js 16, ejecutadas mediante Vinext sobre Cloudflare Workers en el entorno de alojamiento de esta entrega. Persistencia Cloudflare D1 (SQLite), esquema Drizzle y validación Zod. Es un proyecto con estructura Next.js; no se debe describir como un despliegue estándar de Next.js en Vercel. Para trasladarlo se reemplazan el acceso a D1 y la identidad del alojamiento y se verifica compatibilidad con el runtime elegido.

Las páginas comerciales son principalmente componentes de servidor. Solo navegación móvil y módulos interactivos requieren cliente. Los recursos propios están en `public/images`, optimizados a WebP y con dimensiones declaradas. Las fotos originales recuperadas y sus fuentes están en `docs/research`.

## Estructura

- `app/page.tsx`, `app/padel`: web comercial.
- `components/club-client.tsx`: gestión y formularios.
- `components/padel-agenda.tsx`: agenda administrativa.
- `app/ingreso`: terminal de presentación.
- `app/api/club/route.ts`: comandos de negocio y lecturas autenticadas.
- `app/api/export/route.ts`: exportación completa del propietario.
- `lib/server.ts`: identidad, binding D1 y validación de solicitudes.
- `lib/club.ts`: tipos, fechas, moneda, turnos y decisión de acceso.
- `db/schema.ts`, `drizzle`: esquema y migración versionada.
- `tests/club.test.mjs`: pruebas de API con transacciones SQLite.

## Seguridad del prototipo

En producción se exige la identidad verificada del alojamiento. En desarrollo exclusivamente se usa `local-preview` si falta identidad. Todas las consultas filtran propietario; los IDs recibidos se comprueban contra el mismo propietario. El DNI identifica un socio al validar ingreso; no autentica a un administrador ni abre una sesión.

SQL preparado, validación de tipos y límites de campos, control de origen de escrituras y respuestas `no-store`. Los cobros y reservas tienen claves de idempotencia. La unicidad de cancha/fecha/inicio para reservas confirmadas se exige en SQL; una serie se escribe en una transacción. Los cupos usan inserción condicional para evitar la carrera entre comprobación y alta.

Esto no sustituye rate limiting, límites de tráfico público, políticas de datos, rotación de credenciales y supervisión que requiere una operación real. No publicar la terminal para acceso anónimo a datos de socios.

## Datos y límites

Doce tablas: staff, imports, restores, settings y las ocho de negocio: planes, socios, pagos, ingresos, reservas, clases, inscripciones y auditoría. El resumen carga hasta 500 cobros y 100 eventos recientes; no es contabilidad completa. La exportación JSON descarga todos los registros propios y conserva relaciones por ID. A escala mayor se necesitan paginación, filtros SQL, exportaciones por lotes y reportes agregados en servidor.

Los turnos son de 90 minutos y cuatro canchas, con horarios de ejemplo. El esquema presupone franjas fijas; no permite ofrecer duraciones arbitrarias sin rediseñar la comprobación de solapamiento. Las cancelaciones conservan las reservas. No existe aún conciliación de pagos ni circuito de devolución. Los precios de los planes se pueden actualizar con auditoría y control de formulario obsoleto. El cambio rige para próximos cobros y conserva importes históricos y vencimientos. Cambiar duración o condiciones contractuales requiere una política de vigencia antes de implementarse. El campo `bookings.deposit` representa ahora el total pagado acumulado (seña inicial más saldo); el cobro del saldo queda auditado. No hay devoluciones automáticas.

No hay integración activa con el molinete, Donde Juego, procesadores de pago ni servicios de mensajería.

## Integración futura del molinete

Relevar primero protocolo y controlador. Diseñar un agente local por sede con credencial restringida a validar accesos y registrar eventos. El navegador del kiosco no debe controlar directamente un relé ni almacenar una clave administrativa. La respuesta de validación debe distinguir autorización, orden enviada y apertura confirmada por dispositivo. Usar identificadores de operación para evitar pulsos duplicados.

Acordar comportamiento offline con el responsable del gimnasio. Ensayar desconexión, reconexión, reinicio, reloj incorrecto, cuota recién pagada, doble lectura y fallas del controlador. Cualquier tratamiento de emergencia del equipo depende del hardware y de las prácticas del establecimiento; no improvisarlo desde software remoto.

## Comandos

```sh
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
node --test tests/club.test.mjs
pnpm dev
```

El entorno gestionado usa además sus scripts de preparación/preview/build. La migración local se aplica mediante Wrangler D1; no existe creación de tablas en runtime. Las migraciones que llegaron al alojamiento son inmutables: los cambios posteriores requieren una nueva migración. No guardar secretos en git.

## Roles, importación y recuperación implementados

`principal()` resuelve identidad, espacio y rol en cada solicitud. Los permisos se comprueban en cada endpoint. Las cuentas sin vínculo administran un espacio propio; las vinculadas acceden al espacio asignado. Desactivar una cuenta impide acceso al club; no la convierte en propietaria del espacio anterior. No se usan correos ni nombres como claves de autorización.

`/api/team` asigna recepción, terminal o jugador por identificador de cuenta del sitio. El acceso privado del alojamiento se administra por separado y no se modifica desde la aplicación.

`/api/import-members` valida un CSV de 1–200 filas, vista previa y revalidación al confirmar. Los inserts agrupados respetan el límite de parámetros de D1. El lote y su clave de idempotencia se guardan en una sola transacción.

`/api/backup` valida formato, identificadores, relaciones, duplicados y cupos. Restaura hasta 5.000 registros desde JSON de hasta 1,5 MB, mediante una transacción con inserciones condicionadas a que el espacio esté vacío. Usa JSON SQL con columnas derivadas de esquemas cerrados y nuevos IDs. No restaura roles ni la vinculación de reservas a cuentas. Las reglas de pádel sí se conservan. Los archivos antiguos sin configuración siguen siendo admitidos.

`/api/player` revela únicamente cancha/horario ocupado y reservas propias. La creación comparte el índice único de agenda con recepción. El jugador sólo cancela dentro del plazo y sin pagos registrados. El precio esperado se contrasta con el vigente. El acceso se mantiene privado; no hay alta pública libre ni pagos online.

`/api/settings` permite a administración cambiar precio único del portal, anticipación y plazo de cancelación. Los importes anteriores no se recalculan.

## Adaptación al entorno final

La aplicación aún requiere decisiones del cliente sobre reglas operativas, acceso público y soporte. El hardware exige un adaptador específico. Pagos y notificaciones requieren proveedores y credenciales. La implantación incluye límites de tráfico, monitoreo, backups programados y aceptación con dispositivos reales. Ver `PUESTA-EN-MARCHA.md`.

Referencias de implementación: https://developers.cloudflare.com/d1/platform/limits/ y https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html . No se declara una auditoría de seguridad externa ni cumplimiento normativo certificado.

## Informes y límites de entrada

`GET /api/reports` es exclusivo del propietario. Recibe `from`, `to`, `paymentPage`, `bookingPage` y opcional `format=csv`. Agrega cobros por medio y usa los índices existentes `(owner,created_at)` y `(owner,day)`. El intervalo de cobros es semiabierto: medianoche argentina inicial incluida y medianoche posterior al último día excluida. El contrato actual utiliza UTC−03:00 para fechas de negocio entre 2000 y 2100; no pretende reconstruir cambios históricos de huso horario.

La consulta de resumen usa una transacción de lectura consistente; las páginas se ordenan por fecha e ID. Cada consulta nueva ve el estado actual, no una fotografía permanente entre páginas. La exportación vuelve a consultar y puede incluir movimientos ingresados después del resumen. No hay nuevas tablas ni migraciones en esta versión.

`lib/csv.ts` centraliza comillas, escape y protección contra fórmulas. El CSV está destinado a planillas; para una copia exacta de datos se utiliza JSON, porque los prefijos protectores pueden modificar la representación textual en el CSV.

`body()` limita el tamaño UTF-8 por bytes mientras lee el stream y rechaza contenido inválido. Esto no reemplaza límites de tráfico, cuota por usuario ni controles del alojamiento.

Fuentes técnicas consultadas: https://www.sqlite.org/lang_datefunc.html y https://owasp.github.io/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Injection/21-CSV_Injection .

## Historial de cobros de pádel

La migración `0005_solid_the_watchers.sql` agrega `booking_payments`. Se guarda la seña del primer turno de una serie y cada cobro de saldo, en la misma transacción que modifica la reserva. Un índice único por reserva y concepto impide duplicados. No se reconstruyen pagos anteriores: el historial informa el importe sin detalle cuando corresponde.

`/api/booking-payments` permite consultar el historial de una reserva sólo a administración y recepción del mismo espacio. `/api/reports` y el CSV distinguen gimnasio/pádel y cuota/seña/saldo; el período corresponde a la fecha de cobro, no al día del partido. Cancelar una reserva conserva los cobros; no registra una devolución automática.

Los respaldos nuevos usan `schemaVersion: 2`. Incluyen el historial, validan su relación e importe y reasignan las referencias al restaurar. Los respaldos versión 1 continúan admitidos, sin inventar movimientos que no contenían. Pruebas automatizadas: 39 aprobadas, con falla simulada del registro de cobro para verificar reversión de toda la operación.

# Gold Gym Mercedes — entrega integral de demostración

24 de septiembre de 2026 · Nodra Studio

## Estado real

Web de presentación y aplicación funcional privada. Los registros se guardan en SQL; los módulos comparten datos. El código, las migraciones, los recursos y las pruebas están versionados. No se modificaron los proveedores actuales ni se importaron datos reales.

La versión sirve para demostrar el ecosistema y ensayar operaciones con datos ficticios. No se declara lista para sustituir sistemas en producción: faltan aceptación del club, integración física y preparación operativa del alojamiento.

| Ruta | Función implementada |
|---|---|
| `/` | Web institucional con identidad local, fotos, disciplinas, tres sedes, mapas y consultas |
| `/padel` | Presentación de cuatro canchas y canales oficiales |
| `/gestion` | Socios, planes, precios, cuotas, vencimientos, clases con cupos, ingresos y auditoría |
| `/ingreso` | Validación por DNI y registro; molinete expresamente simulado |
| `/reservas` | Agenda administrativa, turnos semanales, bloqueos, señas, cobro de saldo y cancelaciones |
| `/jugar` | Disponibilidad sin datos ajenos, reservas de la cuenta y cancelación dentro del plazo |
| `/configuracion` | Precio del portal, días de anticipación y plazo de cancelación |
| `/equipo` | Cuentas con rol de recepción, terminal o jugador; activación y desactivación |
| `/datos` | CSV con vista previa, descarga JSON, comprobación y restauración en espacio vacío |
| `/reportes` | Cobros de gimnasio por período y medio, saldos pendientes de pádel, membresías y CSV |
| `/propuesta` | Presentación comercial por etapas |

## Recorrido para mostrarlo

1. En Gestión, **Cargar ejemplos** una sola vez: seis socios ficticios, tres planes, una clase y una reserva.
2. Probar `99000001` vigente, `99000002` vencido y `99000003` pausado en la terminal.
3. Cobrar a Bruno Demo; el vencimiento se renueva desde hoy. Su DNI pasa a estar habilitado. No se mueve dinero real.
4. Actualizar un precio en Planes. Los cobros anteriores conservan sus importes. Un formulario abierto con precio viejo debe revisarse antes de cobrar.
5. Crear una clase, inscribir a un socio vigente y liberar su cupo.
6. Crear una reserva de pádel y una serie semanal. Registrar el saldo recibido; comprobar saldo pendiente cero. Cancelar un turno conserva el historial.
7. Abrir Mis partidos, elegir una fecha futura y reservar. La misma cancha queda ocupada en la agenda administrativa.
8. En Datos, descargar plantilla, importar un socio ficticio y verificar el alta. Revisar errores de un CSV con DNI repetido.
9. Descargar JSON y comprobarlo. La restauración completa sólo está disponible en un espacio vacío; no pisa el club en uso.
10. Mostrar Equipo. Cada persona obtiene su identificador desde su cuenta y administración asigna el rol. No se enviaron invitaciones ni se habilitaron personas reales.

## Permisos y alcance

| Rol | Acceso |
|---|---|
| Administración | Gestión, informes, precios, equipo, datos, reglas de pádel y portal para demostración |
| Recepción | Socios, cuotas, clases, agenda e ingresos; no precios, equipo o exportaciones |
| Terminal | Validar un DNI y registrar el resultado; no listados del club |
| Jugador | Ver ocupación de canchas y gestionar sólo sus reservas |

El propietario del espacio se identifica por su cuenta del sitio. Recepción, terminal y jugadores se vinculan a ese espacio. La privacidad del alojamiento es una capa adicional: asignar un rol no concede acceso al sitio privado. El cliente final todavía necesita decidir cómo será el acceso público y qué cuentas usará el equipo.

## Límites explícitos

- Importes, horarios y reglas iniciales son de demostración, no tarifas confirmadas de Gold Gym.
- Los pagos son registros manuales. No se cobra tarjeta, no se concilia un procesador ni se emite factura fiscal. Las devoluciones se coordinan fuera del sistema.
- Turnos de 90 minutos, cuatro canchas, franjas fijas de 08:00 a 23:00. El portal tiene precio único configurable; precios por franja requieren reglas del club.
- CSV: 1–200 socios por lote, 160 KB de texto, altas nuevas; no reemplaza ni fusiona registros. Los planes deben existir.
- Respaldo: JSON de hasta 1,5 MB; restauración de hasta 5.000 registros en espacio vacío. Se restauran datos y reglas de pádel, pero no permisos. Las reservas restauradas no se reasignan automáticamente a cuentas de jugadores.
- Resumen: hasta 500 cobros y 100 eventos recientes. Portal: hasta 100 reservas de la cuenta. No es contabilidad completa ni un reporte ilimitado.
- La copia manual y el ensayo de restauración no equivalen a respaldos automáticos, monitoreo ni recuperación completa ante caída del proveedor.

## Lo que requiere información o intervención externa

1. **Cliente:** aprobar fotos, datos, sedes, dominio, tarifas, horarios, reglas y alcance contratado.
2. **Molinete:** marca/modelo, controlador, protocolo, titularidad y acceso físico. Hace falta implementar el adaptador específico y probar apertura, desconexión y recuperación en el lugar.
3. **Proveedor actual:** exportación autorizada y descripción de campos para mapear, conciliar y ensayar la migración real.
4. **Cuentas y operación:** personas/roles, titularidad del alojamiento, acceso externo, backups programados, alertas, retención, soporte y recuperación ensayada en la infraestructura final.
5. **Pagos y mensajes:** proveedor, cuenta comercial y credenciales si el club contrata cobros online o notificaciones. No se inventan ni se conectan cuentas ajenas.
6. **Aceptación:** pruebas con personal y dispositivos reales, carga prevista, reglas de excepción y funcionamiento en paralelo antes del corte.

No dar de baja los abonos actuales hasta completar aceptación y reversión. Los pendientes externos están desarrollados en `PUESTA-EN-MARCHA.md`.

## Verificación

La batería de 39 pruebas cubre las rutas reales con SQLite: identidad, roles, aislamiento entre cuentas, importación atómica, restauración, relaciones, cuotas y precios, reservas, cancelaciones, cupos y portal de jugadores. Se verifican TypeScript y compilación de producción.

Se realizaron pruebas de navegador con D1 local y datos ficticios. La primera web se revisó entre 320 y 1920 píxeles; las nuevas pantallas se revisaron también en ventanas de 375 píxeles. Esto no sustituye dispositivos físicos, auditoría WCAG completa ni métricas de Core Web Vitals de usuarios reales.

WebMCP de lectura permanece con detección de soporte. El navegador de revisión no ofreció `modelContext`: no se declara validada su ejecución. El uso humano no depende de esa capacidad.

## Identidad y publicación

Se conserva el sello dorado de Gold Gym Mercedes, distinto de la cadena internacional Gold’s Gym. Los recursos y fuentes están en `docs/research`. Las fotos públicas recuperadas necesitan aprobación de uso y, cuando corresponda, autorización del fotógrafo. La imagen principal debe reemplazarse por un original de mayor resolución al recibirlo del club.

Se mantiene acceso privado y `noindex` durante la presentación. Dominio final, canonical, sitemap y datos estructurados locales se preparan con la información aprobada antes del lanzamiento público.

## Informes de administración

En `/reportes`, administración consulta un período de hasta 366 días. Los cobros de gimnasio se agrupan por medio de pago y se detallan en páginas de 25 registros. Los totales se calculan sobre todos los cobros del período, independientemente de la página. La exportación CSV admite hasta 10.000 cobros; para períodos mayores se solicita acotar las fechas.

Los saldos de pádel se calculan para reservas confirmadas con fecha de juego en el período y se muestran por separado. No se los presenta como ingresos cobrados: los pagos de pádel anteriores al historial detallado no permiten reconstruir un libro de caja completo por fecha y medio. Tampoco se infiere una deuda monetaria por una membresía vencida. El indicador de membresías corresponde al día actual, no al cierre histórico del período.

Se verificaron cortes a medianoche argentina, 511 cobros incluidos en un único día, paginación sin duplicados, exclusión de bloqueos/cancelaciones y permisos. La lectura de solicitudes JSON ahora limita bytes mientras recibe el cuerpo, incluso si no llega Content-Length.

Prueba de navegador: consulta de agosto vacía y septiembre con datos ficticios; archivo CSV preparado y enlace visible. El observador de descargas del navegador de prueba agotó el tiempo de espera, por lo que no se afirma verificada la descarga final a disco. Los bytes CSV y encabezados se verificaron en las pruebas del endpoint.

## Historial de cobros de pádel

La agenda registra nuevas señas y saldos con fecha y medio de pago, muestra los movimientos de cada reserva y los incluye en Informes y CSV. Los respaldos versión 2 conservan este detalle. Se mantienen compatibles los respaldos anteriores. Las devoluciones, comprobantes fiscales y conciliación bancaria siguen fuera del alcance implementado.

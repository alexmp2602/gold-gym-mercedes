# Puesta en marcha y aceptación

Este documento define los pasos que siguen a la demostración. Ninguno de los casilleros se considera aprobado por el solo hecho de que la aplicación esté publicada.

## 1. Cerrar la etapa web

- [ ] El club aprueba sedes, direcciones, teléfonos, servicios, horarios y contenido.
- [ ] Se reciben logo y fotos originales con autorización de uso.
- [ ] Se define titularidad y administración del dominio y alojamiento.
- [ ] Se separa la web pública de la gestión restringida y se revisan las reglas de acceso.
- [ ] Se validan móvil real, enlaces, formularios/contactos y recorrido de consulta.
- [ ] Se configura SEO con dominio definitivo y se habilita indexación únicamente de páginas comerciales.

## 2. Relevar operación

Registrar para cada sede: personas que trabajan, roles, planes, duración de cuotas, días de gracia, estados de socio, cambio de plan, excepciones, clases y cupos. Registrar para pádel: franjas, duración, precio, señas, cancelación, turnos fijos y devoluciones. Cualquier diferencia con la configuración actual se acuerda antes de importar.

Asignación de personal en la versión actual:

1. El propietario concede acceso al sitio privado desde su configuración de compartir.
2. La persona inicia sesión con su propia cuenta y abre `/equipo` para obtener su identificador.
3. Administración agrega ese identificador, nombre y rol en Equipo.
4. Se prueba una acción permitida y una prohibida; se desactiva y reactiva la cuenta para comprobar revocación.

Nunca usar la cuenta de administración en la terminal del molinete. Nunca habilitar el sitio entero públicamente sólo para evitar el alta de usuarios.

## 3. Migración

Solicitar exportación autorizada con socios, DNI, planes, estados, vencimientos, cuotas e historial. Para pádel, solicitar todas las reservas futuras, canchas, horarios, importes, señas y turnos fijos.

Crear una copia de ensayo. Mapear nombres de planes y estados. El importador CSV actual sirve para altas de socios; no importa historial del proveedor ni convierte formatos desconocidos. La agenda futura requiere un mapeo específico según el archivo recibido.

Comparar cantidades, duplicados, sumas, vencimientos y reservas con el proveedor. Elegir con el cliente casos vigentes, vencidos, pausados, con señas y turnos repetidos. Conservar el archivo original y registrar las transformaciones realizadas. No borrar el origen ni hacer un corte sin reconciliación.

## 4. Recuperación

La descarga JSON es privada y contiene datos personales. Definir quién puede descargarla, dónde se guarda cifrada, la frecuencia, retención y eliminación. Configurar además el mecanismo automático de recuperación que ofrezca el alojamiento definitivo.

Ensayo mínimo:

1. Exportar una copia de prueba desde Datos.
2. Comprobarla desde la pantalla de respaldos.
3. Restaurar en un espacio vacío de ensayo, con una cuenta autorizada.
4. Comparar número de socios, planes, pagos, reservas y sumas monetarias.
5. Probar una relación socio/plan, una cuota, una clase y una reserva restaurada.
6. Reasignar permisos y, si corresponde, vincular reservas a jugadores mediante un proceso supervisado. Los permisos no viajan en el archivo.
7. Registrar duración y resultado. Definir el objetivo de pérdida máxima aceptable y el tiempo de recuperación con el cliente.

La pantalla no sobrescribe un club activo. Una recuperación de producción requiere un procedimiento en la infraestructura final y un responsable, no editar directamente la base en horario de atención.

## 5. Molinete

Obtener fabricante, modelo, manual técnico, controlador, conexión, alimentación y documentación de integración. Confirmar propiedad y condiciones del proveedor. Acordar con un técnico la instalación y el mecanismo de emergencia propio del equipo.

El agente local futuro debe tener permiso exclusivo de terminal, identificar sede/dispositivo y reportar eventos. Separar tres estados: membresía autorizada, orden enviada y apertura confirmada. No confirmar físicamente una apertura porque una API respondió “vigente”.

Pruebas: cuota vigente/vencida/pausada, doble lectura, DNI desconocido, nueva cuota, pérdida de internet, corte de energía, reinicio, reintento y restauración de conectividad. Definir el procedimiento humano durante una caída. El comportamiento offline y de emergencia depende del hardware y de las políticas del establecimiento.

## 6. Piloto y corte

- [ ] Se definió quién recibe soporte y cómo se atienden incidencias.
- [ ] Se probaron carga esperada, permisos, dispositivos y recuperación.
- [ ] Se reconciliaron todos los datos y reservas futuras.
- [ ] El personal completó el recorrido del manual.
- [ ] Se ejecutó un período paralelo acordado con el club.
- [ ] Se acordaron fecha, responsable de corte y condiciones de reversión.
- [ ] El club aprobó por escrito la puesta en producción.

La reversión conserva el sistema anterior disponible y contempla cómo trasladar los movimientos ocurridos durante el piloto. La baja de proveedores es el último paso, después de verificar condiciones contractuales y aceptación.

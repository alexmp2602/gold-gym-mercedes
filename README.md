# Gold Gym Mercedes

Web institucional y prototipo funcional privado de gestión de gimnasio y pádel.

- [Entrega y recorrido](docs/ENTREGA.md)
- [Propuesta y guía comercial](docs/VENTA.md)
- [Puesta en marcha y aceptación](docs/PUESTA-EN-MARCHA.md)
- [Arquitectura y próximos pasos](docs/TECNICA.md)
- [Investigación y fuentes](docs/research/HALLAZGOS.md)

React / Next.js App Router con runtime Vinext, Cloudflare Workers y D1. No sustituir los sistemas operativos del club hasta completar integración, migración y aceptación. No ingresar datos reales en la demostración.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm exec tsc --noEmit
node --test tests/club.test.mjs
```

## Estado del proyecto

Incluye socios, cuotas, clases, control de ingreso simulado, agenda de pádel, portal de jugadores, roles, importación, respaldos e informes. Las señas y saldos de pádel cuentan con historial de cobros. Ver los documentos de entrega para límites y pruebas.

Este proyecto usa APIs de Next.js mediante **Vinext sobre Cloudflare Workers/D1**. La identidad de la versión alojada depende de Sites/ChatGPT; para otro alojamiento es necesario configurar identidad y base de datos. No es una exportación estática ni se despliega sin adaptación en un servidor Next.js convencional.

No se incluyen credenciales, bases locales ni datos reales del gimnasio. Las fotografías y marcas pertenecen a sus respectivos titulares; la publicación del código no concede derechos de reutilización sobre esos recursos.

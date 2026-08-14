# AgroDirecto

MVP web académico que conecta productores agrícolas con compradores locales. Permite descubrir productos, conocer su procedencia, preparar un pedido y coordinarlo directamente con el productor, sin pagos reales ni intermediación financiera.

Proyecto desarrollado para el **Avance 1 — Semana 8** del curso Desarrollo Full Stack de la Universidad Tecnológica del Perú.

![Página de inicio de AgroDirecto](docs/screenshots/01-inicio.png)

## Funcionalidades

- Doce pantallas navegables y adaptables a dispositivos móviles.
- Perfiles diferenciados de comprador, productor y administrador.
- Registro e inicio de sesión simulados para demostración.
- Catálogo con búsqueda, filtros y fichas de producto.
- Ubicación aproximada mediante Leaflet y OpenStreetMap.
- Carrito sujeto a la regla de un solo productor por pedido.
- Confirmación de pedidos sin cobros ni pasarela real.
- Seguimiento de pedidos y paneles de gestión por rol.
- Persistencia local de la demostración mediante `localStorage`.

## Alcance del Avance 1

Esta versión valida la experiencia, la navegación y las principales reglas del negocio. No incluye backend multiusuario, base de datos remota, pagos reales, inteligencia artificial ni hardware.

| Incluido | Planificado para el Avance 2 |
| --- | --- |
| Frontend navegable | API REST |
| Datos de demostración | PostgreSQL |
| Persistencia local | Autenticación y autorización por roles |
| Mapa gratuito | Persistencia multiusuario |
| Validación responsive | Pruebas de integración |

## Tecnologías

- React 19 y TypeScript.
- Vinext y Vite.
- Bootstrap 5 y CSS personalizado.
- Leaflet y OpenStreetMap.
- Node.js y pnpm.

## Evidencias

| Catálogo | Detalle y mapa |
| --- | --- |
| ![Catálogo de productos](docs/screenshots/04-catalogo.png) | ![Detalle del producto con mapa](docs/screenshots/05-detalle-producto.png) |

| Panel del productor | Vista móvil |
| --- | --- |
| ![Panel del productor](docs/screenshots/09-panel-productor.png) | ![Adaptación móvil](docs/screenshots/13-inicio-movil.png) |

Las trece capturas del prototipo están disponibles en [`docs/screenshots`](docs/screenshots).

## Instalación

Requisitos: Node.js 22.13 o superior y pnpm.

```bash
pnpm install
pnpm run dev
```

Abrir `http://localhost:3000/`.

## Verificación

```bash
pnpm test
pnpm lint
```

La compilación de producción y las pruebas de renderizado se encuentran validadas. El lint no presenta errores; conserva advertencias informativas por el uso deliberado de imágenes HTML locales en el prototipo.

## Equipo

- Jaime Israel Aramburu Condori.
- Leslie Liliana Cabrera Luley.
- Jose Antonio Morote Sanchez.

Curso: Desarrollo Full Stack — UTP, sección 45554, 2026.

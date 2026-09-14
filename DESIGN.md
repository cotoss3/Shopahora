# DESIGN.md - Sistema de Diseño ShopAhora (Anti-Slop Standard)

Este documento rige la identidad visual, sistema de tokens, pautas de diseño y reglas de componentes para **ShopAhora**, combinando las especificaciones de **Taste-Skill** e **Impeccable**.

---

## 1. Filosofía Estética: Minimalismo Editorial Cálido

- **Criterio de Anti-Diseño Genérico (Anti-Slop):** Prohibidos los degradados estándar morado-azul, el uso de Inter como fuente genérica sin criterio, tarjetas anidadas infinitas y el uso de negro puro (`#000000`) o texto gris sobre fondos de color sin contraste.
- **Tono Visual:** Elegancia táctil, espacios de respiración amplios, composiciones asimétricas intencionales y contraste tipográfico audaz.

---

## 2. Paleta de Colores

| Elemento | Token CSS | Valor HEX / HSL | Uso |
| :--- | :--- | :--- | :--- |
| **Fondo Principal** | `--bg-canvas` | `#FAF8F5` | Lienzo principal cálido y limpio |
| **Superficie Secundaria** | `--bg-surface` | `#FFFFFF` | Tarjetas y contenedores |
| **Texto Primario** | `--text-primary` | `#121212` | Encabezados y títulos (carbón profundo) |
| **Texto Secundario** | `--text-muted` | `#5C5852` | Cuerpo y metadatos |
| **Acento Primario** | `--accent-brand` | `#D9531E` | Botones de acción principal (Terracota vivo) |
| **Acento Secundario** | `--accent-amber` | `#2D4B3E` | Resaltados y badges (Verde Bosque profundo) |
| **Borde / Separador** | `--border-subtle` | `#E8E4DF` | Líneas finas y divisores |

---

## 3. Sistema Tipográfico

- **Títulos & Encabezados:** *Playfair Display* / *Syne* / *Plus Jakarta Sans* (Weight 600 - 800) - Carácter amplio, distinguido y editorial.
- **Cuerpo de Texto & UI:** *Plus Jakarta Sans* / *DM Sans* (Weight 400 - 500) - Lectura óptima a cualquier resolución.
- **Precios y Números:** *Space Grotesk* o tabular monospaced ajustado para alineación impecable.

---

## 4. Estructura de Componentes

### Componentes Clave
1. **Header Navigation:** Ultra-limpio, backdrop blur fino, contador dinámico de carrito con insignia terracota.
2. **Hero Banner:** Tipografía gigante con slogan cautivador, CTA asimétrico y galería integrada de productos destacados.
3. **Product Card:**
   - Sin bordes pesados ni sombras excesivas.
   - Hover zoom suave en la imagen (`scale-105` con transición de 500ms cubic-bezier).
   - Botón "+ Agregar" flotante o de acceso rápido al pasar el cursor.
4. **Slide-over Cart Drawer:**
   - Animación de entrada de derecha a izquierda con Framer Motion.
   - Resumen de ítems con controles (+ / - / eliminar).
   - Barra de progreso de "Envío Gratis disponible".
5. **Product Detail Modal:** Vista previa detallada en overlay con selección de variaciones (tamaño, color, cantidad).

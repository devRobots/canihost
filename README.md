# CanIHost.tech

<div align="center">
  <img src="https://via.placeholder.com/800x400/18160f/e87c2a?text=CanIHost.tech+Hero+Banner" alt="Hero Banner Preview" />
  <p><em>La página principal de CanIHost, mostrando el terminal estético, el selector de host y las recomendaciones de apps.</em></p>
</div>

**CanIHost.tech** es una herramienta especializada diseñada para entusiastas del self-hosting y administradores de *home-labs*. Su propósito es eliminar la incertidumbre antes de desplegar: ayudándote a calcular, simular y organizar eficientemente aplicaciones en contenedores basándose en los recursos reales que consume cada una. 

Ya no tendrás que adivinar si tu Mini PC o tu VPS resistirá un servidor de medios junto a un gestor de archivos y una base de datos. CanIHost te lo dice, y te genera el código para levantarlo.

---

## 🚀 Características Clave

### 1. Simulador de Recursos (Builder)
Planifica arquitecturas completas sin tocar la terminal. Selecciona múltiples aplicaciones como si fuera un carrito de compras y observa en tiempo real cómo impactan en el consumo de RAM y CPU de diferentes modelos de servidores (Hosts).

<div align="center">
  <img src="https://via.placeholder.com/800x400/18160f/7ec45a?text=Resource+Builder+Monitor" alt="Builder Monitor" />
  <p><em>El panel de construcción (Builder) donde se refleja visualmente la sumatoria del consumo de RAM y CPU frente al límite del Hardware elegido.</em></p>
</div>

### 2. Generador de Docker Compose Dinámico
Una vez tienes listo tu *Stack*, CanIHost no se limita a darte luz verde. Se conecta directamente a la **API oficial de Docker Registry V2** para leer la metadata real de las imágenes, resolviendo variables de entorno, mapeo de volúmenes y puertos para generar un archivo `docker-compose.yml` perfecto y estructurado, listo para ejecutar.

### 3. Modo Fácil / Experto
La aplicación se adapta a ti. Dependiendo de si activas el Modo Fácil o el Modo Experto, CanIHost cambiará:
- **Modo Fácil:** Focalizado en la simplicidad. Te oculta la configuración extrema.
- **Modo Experto:** Control total. Podrás visualizar especificaciones detalladas y métricas en vivo en el simulador.

### 4. Hardware Local vs Despliegue en la Nube
El catálogo incorpora una inmensa gama de opciones de infraestructura divididas en dos grandes mundos:
- **MINI PCs (Local):** Hemos reunido los perfiles de los de equipos *Mini PCs* más eficientes y recomendados del mercado del self-hosting para que simules exactamente cómo se comportaría tu servidor casero funcionando 24/7.
- **Cubepath (Nube):** Para aquellos que prefieren ahorrarse el mantenimiento físico y prefieren un *VPS*. Ofrecemos un nivel de integración profundo donde puedes tomar tu *stack* simulado e instanciarlo con un solo clic.

---

## 📦 El Ecosistema: Apps y Bundles

CanIHost mantiene una rigurosa base de datos impulsada por PostgreSQL que clasifica la información bajo dos grandes grupos:

- **Catálogo de Aplicaciones:** Desde clásicos como Nextcloud, Jellyfin y Pi-hole, hasta herramientas devOps o bases de datos como PostgreSQL y Redis. Cada una cuenta con una tabla de consumo base y picos recomendados para cálculos precisos.
- **Bundles (Combos):** Son grupos pre-establecidos creados por nosotros. Suelen ser recetas listas para escenarios específicos (Ejemplo: "El Kit del Desarrollador" o el "Media Server Total"). 

---

## 🛠️ Stack Tecnológico

CanIHost no solo es potente en lo que hace, sino en cómo está construido. Emplea un diseño inspirado en interfaces de terminal modernas combinadas con la robustez técnica actual:

*   **Framework Principal:** [Next.js (App Router)](https://nextjs.org/)
*   **Lenguaje:** TypeScript
*   **Base de Datos y ORM:** PostgreSQL a través de [Prisma](https://www.prisma.io/)
*   **Estilos y UI:** [Tailwind CSS v4](https://tailwindcss.com/) 
*   **Íconos:** [Lucide React](https://lucide.dev/)
*   **Estado Global:** [Zustand](https://github.com/pmndrs/zustand) (Para un flujo ágil e interconectado entre las simulaciones, el catálogo de apps y los hosts seleccionados).
*   **Linting & Calidad:** ESLint en conjunto con [SonarJS](https://github.com/SonarSource/eslint-plugin-sonarjs) para garantizar mantención de alto nivel y cero *code smells*.

---

## 🖼️ Flujo y Diseño UI

<div align="center">
  <img src="https://via.placeholder.com/800x400/18160f/e8b42a?text=Host+Picker+Section" alt="Selector de Host" />
  <p><em>El Host Picker, donde defines qué máquina simulará tus contenedores. Podrás ver etiquetas, recursos máximos y variaciones operativas.</em></p>
</div>

<div align="center">
  <img src="https://via.placeholder.com/800x400/18160f/5abec4?text=Docker+Compose+Terminal+View" alt="Vista Terminal de Docker Compose" />
  <p><em>Salida generada: El script de despliegue y el YAML generado estructuradamente, listo para ser copiado en tu servidor.</em></p>
</div>

---

<div align="center">
  <p>Construido con ❤️ por el equipo de <strong>devRobots</strong></p>
</div>

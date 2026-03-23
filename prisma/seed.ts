import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando DB...");
  await prisma.appSet.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.machine.deleteMany({});

  console.log("Insertando Máquinas (Mini PCs y VPS CubePath)...");
  
  // 15 Mini PCs
  const machinesData = [
    { name: 'Zimaboard 2 (832)', type: 'MINI_PC', brand: 'ZimaBoard', cpuCores: 4, memoryRamGb: 8 },
    { name: 'Zimaboard 2 (432)', type: 'MINI_PC', brand: 'ZimaBoard', cpuCores: 4, memoryRamGb: 4 },
    { name: 'Chuwi Larkbox X', type: 'MINI_PC', brand: 'Chuwi', cpuCores: 4, memoryRamGb: 12 },
    { name: 'Mac Mini M2', type: 'MINI_PC', brand: 'Apple', cpuCores: 8, memoryRamGb: 8 },
    { name: 'Mac Mini M2 Pro', type: 'MINI_PC', brand: 'Apple', cpuCores: 10, memoryRamGb: 16 },
    { name: 'Raspberry Pi 5 (8GB)', type: 'MINI_PC', brand: 'Raspberry Pi', cpuCores: 4, memoryRamGb: 8 },
    { name: 'Raspberry Pi 4 (4GB)', type: 'MINI_PC', brand: 'Raspberry Pi', cpuCores: 4, memoryRamGb: 4 },
    { name: 'Intel NUC 13 Pro', type: 'MINI_PC', brand: 'Intel', cpuCores: 12, memoryRamGb: 16 },
    { name: 'Intel NUC 12 Enthusiast', type: 'MINI_PC', brand: 'Intel', cpuCores: 14, memoryRamGb: 16 },
    { name: 'Beelink SER5 Pro', type: 'MINI_PC', brand: 'Beelink', cpuCores: 6, memoryRamGb: 16 },
    { name: 'Beelink SER6 Max', type: 'MINI_PC', brand: 'Beelink', cpuCores: 8, memoryRamGb: 32 },
    { name: 'Minisforum UM790 Pro', type: 'MINI_PC', brand: 'Minisforum', cpuCores: 8, memoryRamGb: 32 },
    { name: 'Minisforum Venus NPB7', type: 'MINI_PC', brand: 'Minisforum', cpuCores: 14, memoryRamGb: 32 },
    { name: 'Dell OptiPlex Micro Plus', type: 'MINI_PC', brand: 'Dell', cpuCores: 6, memoryRamGb: 16 },
    { name: 'Lenovo ThinkCentre M70q', type: 'MINI_PC', brand: 'Lenovo', cpuCores: 6, memoryRamGb: 8 },
    // CubePath VPS
    { name: 'CubePath VPS Starter', type: 'VPS', brand: 'CubePath', cpuCores: 1, memoryRamGb: 1 },
    { name: 'CubePath VPS Developer', type: 'VPS', brand: 'CubePath', cpuCores: 2, memoryRamGb: 4 },
    { name: 'CubePath VPS Dev Pro', type: 'VPS', brand: 'CubePath', cpuCores: 4, memoryRamGb: 8 },
    { name: 'CubePath VPS Enterprise', type: 'VPS', brand: 'CubePath', cpuCores: 8, memoryRamGb: 16 },
  ];

  await prisma.machine.createMany({ data: machinesData });

  console.log("Insertando Servicios (>50 aplicaciones)...");
  
  const servicesData = [
    // Databases
    { name: 'PostgreSQL', category: 'Database', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Potente base de datos relacional open source.' },
    { name: 'MySQL', category: 'Database', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'DB relacional estándar.' },
    { name: 'MongoDB', category: 'Database', cpuCost: 0.5, ramCostGb: 1.0, isCloudRecommended: true, description: 'Base de datos NoSQL líder.' },
    { name: 'Redis', category: 'Database', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Caché y almacén clave-valor en memoria.' },
    // Development & DevOps
    { name: 'Gitlab', category: 'DevOps', cpuCost: 2.0, ramCostGb: 4.0, isCloudRecommended: true, description: 'Plataforma DevOps integral.' },
    { name: 'Jenkins', category: 'DevOps', cpuCost: 1.0, ramCostGb: 1.5, isCloudRecommended: true, description: 'Servidor de automatización open source.' },
    { name: 'Gitea', category: 'DevOps', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Alternativa ligera a GitLab/GitHub.' },
    { name: 'Drone CI', category: 'DevOps', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Plataforma CI/CD nativa de contenedores.' },
    { name: 'Portainer', category: 'DevOps', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Gestión ligera de Docker/Kubernetes.' },
    { name: 'Dokploy', category: 'DevOps', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Alternativa a Vercel/Heroku self-hosted.' },
    { name: 'Coolify', category: 'DevOps', cpuCost: 0.8, ramCostGb: 1.0, isCloudRecommended: true, description: 'Plataforma PAAS autoalojada moderna.' },
    { name: 'Nginx Proxy Manager', category: 'Networking', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Panel visual para proxy inverso Nginx.' },
    { name: 'Traefik', category: 'Networking', cpuCost: 0.3, ramCostGb: 0.2, isCloudRecommended: true, description: 'Smart reverse proxy.' },
    { name: 'Cloudflared', category: 'Networking', cpuCost: 0.1, ramCostGb: 0.1, isCloudRecommended: true, description: 'Túneles Cloudflare Zero Trust.' },
    { name: 'Pi-Hole', category: 'Networking', cpuCost: 0.1, ramCostGb: 0.2, isCloudRecommended: false, description: 'Bloqueador de anuncios a nivel de red (DNS).' },
    { name: 'AdGuard Home', category: 'Networking', cpuCost: 0.1, ramCostGb: 0.2, isCloudRecommended: false, description: 'Alternativa a Pi-Hole para bloqueo de ads.' },
    { name: 'Wireguard (WG-Easy)', category: 'Networking', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'VPN rápida y moderna.' },
    { name: 'Tailscale', category: 'Networking', cpuCost: 0.1, ramCostGb: 0.1, isCloudRecommended: true, description: 'Zero config VPN Mesh.' },
    // CMS & Web
    { name: 'Strapi', category: 'CMS', cpuCost: 0.8, ramCostGb: 1.0, isCloudRecommended: true, description: 'Headless CMS Node.js.' },
    { name: 'Ghost', category: 'CMS', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Plataforma de publicación profesional.' },
    { name: 'WordPress', category: 'CMS', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'El CMS más popular del mundo.' },
    // Productivity & Storage
    { name: 'Nextcloud', category: 'Productivity', cpuCost: 1.0, ramCostGb: 1.5, isCloudRecommended: true, description: 'Suite completa de nube personal (archivos, contactos, etc.).' },
    { name: 'Syncthing', category: 'Productivity', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Sincronización P2P de archivos descentralizada.' },
    { name: 'Vaultwarden', category: 'Security', cpuCost: 0.1, ramCostGb: 0.1, isCloudRecommended: true, description: 'Bitwarden ligero en Rust.' },
    { name: 'Paperless-ngx', category: 'Productivity', cpuCost: 0.5, ramCostGb: 1.0, isCloudRecommended: true, description: 'Archivo digital de documentos con OCR.' },
    { name: 'Focalboard', category: 'Productivity', cpuCost: 0.3, ramCostGb: 0.5, isCloudRecommended: true, description: 'Alternativa open source a Trello.' },
    // Automation & IoT
    { name: 'n8n', category: 'Automation', cpuCost: 0.5, ramCostGb: 1.0, isCloudRecommended: true, description: 'Herramienta de automatización tipo Zapier.' },
    { name: 'Home Assistant', category: 'Smart Home', cpuCost: 1.0, ramCostGb: 1.0, isCloudRecommended: false, description: 'Control domótico total del hogar. (NO RECOMENDADO EN LA NUBE)' },
    { name: 'Zigbee2MQTT', category: 'Smart Home', cpuCost: 0.3, ramCostGb: 0.3, isCloudRecommended: false, description: 'Puente Zigbee a MQTT. Requiere hardware local.' },
    { name: 'Frigate NVR', category: 'Media', cpuCost: 2.0, ramCostGb: 2.0, isCloudRecommended: false, description: 'NVR con detección de IA. Requiere hardware Coral/GPU.' },
    { name: 'Node-RED', category: 'Automation', cpuCost: 0.3, ramCostGb: 0.5, isCloudRecommended: true, description: 'Programación visual para IoT.' },
    { name: 'Mosquitto MQTT', category: 'Smart Home', cpuCost: 0.1, ramCostGb: 0.1, isCloudRecommended: true, description: 'Broker MQTT ligero.' },
    // Media & Entertainment
    { name: 'Plex', category: 'Media', cpuCost: 1.5, ramCostGb: 2.0, isCloudRecommended: false, description: 'Centro multimedia (streaming). Mejor con GPU local.' },
    { name: 'Jellyfin', category: 'Media', cpuCost: 1.5, ramCostGb: 2.0, isCloudRecommended: false, description: 'Software de medios libre sin telemetría.' },
    { name: 'Immich', category: 'Media', cpuCost: 2.0, ramCostGb: 3.0, isCloudRecommended: true, description: 'Respaldo de fotos autoalojado de alto rendimiento.' },
    { name: 'PhotoPrism', category: 'Media', cpuCost: 1.5, ramCostGb: 4.0, isCloudRecommended: true, description: 'IA para gestionar fotos.' },
    { name: 'Audiobookshelf', category: 'Media', cpuCost: 0.3, ramCostGb: 0.5, isCloudRecommended: true, description: 'Servidor de audiolibros y podcasts.' },
    { name: 'Navidrome', category: 'Media', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Servidor de música ligero.' },
    { name: 'Minecraft Server', category: 'Gaming', cpuCost: 1.5, ramCostGb: 2.5, isCloudRecommended: true, description: 'Servidor del famoso juego (Java/Bedrock).' },
    { name: 'Palworld Server', category: 'Gaming', cpuCost: 4.0, ramCostGb: 8.0, isCloudRecommended: true, description: 'Servidor de Palworld (alto consumo RAM).' },
    // Monitoring
    { name: 'Grafana', category: 'Monitoring', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Dashboards y analíticas visuales.' },
    { name: 'Prometheus', category: 'Monitoring', cpuCost: 0.5, ramCostGb: 1.0, isCloudRecommended: true, description: 'Monitoreo y alertas métricas.' },
    { name: 'Uptime Kuma', category: 'Monitoring', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Herramienta de monitoreo de uptime visual.' },
    { name: 'Netdata', category: 'Monitoring', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Monitoreo de infraestructura en tiempo real.' },
    // Others
    { name: 'SearXNG', category: 'Utility', cpuCost: 0.5, ramCostGb: 1.0, isCloudRecommended: true, description: 'Motor de metabúsqueda que respeta tu privacidad.' },
    { name: 'Kasm Workspaces', category: 'Utility', cpuCost: 2.0, ramCostGb: 4.0, isCloudRecommended: true, description: 'Espacios de trabajo en streaming (Browser isolation).' },
    { name: 'Mealie', category: 'Productivity', cpuCost: 0.3, ramCostGb: 0.5, isCloudRecommended: true, description: 'Gestor de recetas y planificador de comidas.' },
    { name: 'Trilium Notes', category: 'Productivity', cpuCost: 0.2, ramCostGb: 0.5, isCloudRecommended: true, description: 'Base de conocimiento personal jerárquica.' },
    { name: 'Kavita', category: 'Media', cpuCost: 0.3, ramCostGb: 0.5, isCloudRecommended: true, description: 'Servidor de lectura Manga/Comics.' },
    { name: 'Prowlarr', category: 'Media', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Gestor de indexadores (Arr suite).' },
    { name: 'Radarr', category: 'Media', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Gestión de películas (Arr suite).' },
    { name: 'Sonarr', category: 'Media', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Gestión de series (Arr suite).' }
  ];

  await prisma.service.createMany({ data: servicesData });

  console.log("Insertando AppSets...");
  
  const allServices = await prisma.service.findMany();
  
  // Helpers para buscar servicios rápido
  const findSvc = (name: string) => allServices.find(s => s.name === name);

  const sets = [
    {
      name: 'Stack Desarrollo Básico',
      description: 'Herramientas esenciales para cualquier equipo de desarrollo.',
      services: ['PostgreSQL', 'Redis', 'Gitlab', 'Nginx Proxy Manager']
    },
    {
      name: 'Web Hosting Pro',
      description: 'Todo lo necesario para hospedar sitios web y blogs con analíticas.',
      services: ['WordPress', 'MySQL', 'Nginx Proxy Manager', 'Uptime Kuma', 'Grafana']
    },
    {
      name: 'Entretenimiento Doméstico',
      description: 'Centro multimedia autoalojado (restringido a equipos locales/GPU).',
      services: ['Jellyfin', 'Nextcloud', 'Radarr', 'Sonarr', 'Prowlarr']
    },
    {
       name: 'Mi Nube Personal (Segura)',
       description: 'Reemplaza a Google Drive / Fotos con privacidad absoluta.',
       services: ['Nextcloud', 'Immich', 'Vaultwarden', 'Nginx Proxy Manager']
    },
    {
      name: 'Smart Home Maestro',
      description: 'Control local total de tu casa inteligente sin depender de la nube.',
      services: ['Home Assistant', 'Zigbee2MQTT', 'Mosquitto MQTT', 'Node-RED', 'Frigate NVR']
    }
  ];

  for (const set of sets) {
    const svcs = set.services.map(findSvc).filter(Boolean);
    if(svcs.length > 0) {
      await prisma.appSet.create({
        data: {
          name: set.name,
          description: set.description,
          services: {
             connect: svcs.map(s => ({ id: s!.id }))
          }
        }
      });
    }
  }

  console.log("¡Base de datos populada con éxito!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

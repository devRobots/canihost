import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { HostType, PrismaClient } from '@prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Limpiando DB...');
  await prisma.appBundle.deleteMany({});
  await prisma.app.deleteMany({});
  await prisma.hostVariant.deleteMany({});
  await prisma.host.deleteMany({});

  console.log('Insertando Hosts y Variantes...');

  const hostsData = [
    {
      name: 'Zimaboard 2',
      type: HostType.MINI_PC,
      variants: [
        { name: '832', cpuCores: 4, memoryRamGb: 8 },
        { name: '1664', cpuCores: 4, memoryRamGb: 16 },
      ],
    },
    {
      name: 'Chuwi Larkbox X',
      type: HostType.MINI_PC,
      variants: [{ name: 'N100 12GB', cpuCores: 4, memoryRamGb: 12 }],
    },
    {
      name: 'Mac Mini M2',
      type: HostType.MINI_PC,
      variants: [
        { name: 'Base', cpuCores: 8, memoryRamGb: 8 },
        { name: 'Pro', cpuCores: 10, memoryRamGb: 16 },
      ],
    },
    {
      name: 'Raspberry Pi 5',
      type: HostType.MINI_PC,
      variants: [
        { name: '8GB', cpuCores: 4, memoryRamGb: 8 },
        { name: '4GB', cpuCores: 4, memoryRamGb: 4 },
      ],
    },
    {
      name: 'Intel NUC 13 Pro',
      type: HostType.MINI_PC,
      variants: [{ name: 'i7 16GB', cpuCores: 12, memoryRamGb: 16 }],
    },
    {
      name: 'CubePath VPS',
      type: HostType.VPS,
      variants: [
        { name: 'Starter (1vCPU/1GB)', cpuCores: 1, memoryRamGb: 1 },
        { name: 'Developer (2vCPU/4GB)', cpuCores: 2, memoryRamGb: 4 },
        { name: 'Enterprise (8vCPU/16GB)', cpuCores: 8, memoryRamGb: 16 },
      ],
    },
    {
      name: 'Custom Server',
      type: HostType.CUSTOM,
      variants: [{ name: 'Customized', cpuCores: 4, memoryRamGb: 8 }],
    },
  ];

  for (const hData of hostsData) {
    await prisma.host.create({
      data: {
        name: hData.name,
        type: hData.type,
        variants: {
          create: hData.variants,
        },
      },
    });
  }

  console.log('Insertando Apps (>40 aplicaciones)...');

  const servicesData = [
    // Databases
    {
      name: 'PostgreSQL',
      category: 'Databases',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 0.5,
      recommendedRAM: 2,
      isCloudRecommended: true,
      description: 'Powerful open source DB.',
      officialUrl: 'https://postgresql.org',
    },
    {
      name: 'MySQL',
      category: 'Databases',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 0.5,
      recommendedRAM: 2,
      isCloudRecommended: true,
      description: 'Standard relational DB.',
    },
    {
      name: 'MongoDB',
      category: 'Databases',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 1,
      recommendedRAM: 4,
      isCloudRecommended: true,
      description: 'Leading NoSQL database.',
    },
    {
      name: 'Redis',
      category: 'Databases',
      minCPU: 0.5,
      recommendedCPU: 1,
      minRAM: 0.1,
      recommendedRAM: 1,
      isCloudRecommended: true,
      description: 'In-memory key-value store cache.',
    },
    // DevOps
    {
      name: 'Gitlab',
      category: 'DevOps',
      minCPU: 4,
      recommendedCPU: 8,
      minRAM: 4,
      recommendedRAM: 8,
      isCloudRecommended: true,
      description: 'Comprehensive DevOps platform.',
    },
    {
      name: 'Jenkins',
      category: 'DevOps',
      minCPU: 1,
      recommendedCPU: 4,
      minRAM: 1,
      recommendedRAM: 4,
      isCloudRecommended: true,
      description: 'Automation server.',
    },
    {
      name: 'Gitea',
      category: 'DevOps',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 0.5,
      recommendedRAM: 1,
      isCloudRecommended: true,
      description: 'Lightweight GitLab alternative.',
    },
    {
      name: 'Portainer',
      category: 'DevOps',
      minCPU: 0.5,
      recommendedCPU: 1,
      minRAM: 0.25,
      recommendedRAM: 0.5,
      isCloudRecommended: true,
      description: 'Docker management.',
    },
    {
      name: 'Coolify',
      category: 'DevOps',
      minCPU: 2,
      recommendedCPU: 4,
      minRAM: 2,
      recommendedRAM: 4,
      isCloudRecommended: true,
      description: 'Modern self-hosted PAAS.',
    },
    // Networking
    {
      name: 'Nginx Proxy Manager',
      category: 'Networking',
      minCPU: 0.5,
      recommendedCPU: 1,
      minRAM: 0.25,
      recommendedRAM: 0.5,
      isCloudRecommended: true,
      description: 'Nginx reverse proxy UI.',
    },
    {
      name: 'Traefik',
      category: 'Networking',
      minCPU: 0.5,
      recommendedCPU: 2,
      minRAM: 0.25,
      recommendedRAM: 1,
      isCloudRecommended: true,
      description: 'Smart reverse proxy.',
    },
    {
      name: 'Pi-Hole',
      category: 'Networking',
      minCPU: 0.5,
      recommendedCPU: 1,
      minRAM: 0.5,
      recommendedRAM: 1,
      isCloudRecommended: false,
      description: 'DNS Ad blocker.',
    },
    {
      name: 'Wireguard (WG-Easy)',
      category: 'Networking',
      minCPU: 0.5,
      recommendedCPU: 1,
      minRAM: 0.25,
      recommendedRAM: 0.5,
      isCloudRecommended: true,
      description: 'Modern VPN.',
    },
    // CMS
    {
      name: 'Strapi',
      category: 'CMS',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 1,
      recommendedRAM: 2,
      isCloudRecommended: true,
      description: 'NodeJS Headless CMS.',
    },
    {
      name: 'WordPress',
      category: 'CMS',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 0.5,
      recommendedRAM: 1,
      isCloudRecommended: true,
      description: 'The worlds most popular CMS.',
      officialUrl: 'https://wordpress.org',
    },
    // Productivity
    {
      name: 'Nextcloud',
      category: 'Productivity',
      minCPU: 1,
      recommendedCPU: 4,
      minRAM: 1,
      recommendedRAM: 4,
      isCloudRecommended: true,
      description: 'Personal cloud suite.',
    },
    {
      name: 'Vaultwarden',
      category: 'Security',
      minCPU: 0.5,
      recommendedCPU: 1,
      minRAM: 0.2,
      recommendedRAM: 0.5,
      isCloudRecommended: true,
      description: 'Lightweight Bitwarden password manager.',
    },
    {
      name: 'Paperless-ngx',
      category: 'Productivity',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 1,
      recommendedRAM: 2,
      isCloudRecommended: true,
      description: 'Digital document OCR.',
    },
    // Smart Home
    {
      name: 'n8n',
      category: 'Automation',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 1,
      recommendedRAM: 2,
      isCloudRecommended: true,
      description: 'Workflow automation.',
    },
    {
      name: 'Home Assistant',
      category: 'Smart Home',
      minCPU: 2,
      recommendedCPU: 4,
      minRAM: 2,
      recommendedRAM: 4,
      isCloudRecommended: false,
      description: 'Total home automation control.',
      longDescription:
        'Local-only execution is highly recommended for security and hardware integration.',
    },
    {
      name: 'Frigate NVR',
      category: 'Media',
      minCPU: 2,
      recommendedCPU: 4,
      minRAM: 2,
      recommendedRAM: 4,
      isCloudRecommended: false,
      description: 'NVR with AI detection. Needs GPU/Coral.',
    },
    // Media
    {
      name: 'Plex',
      category: 'Media',
      minCPU: 2,
      recommendedCPU: 4,
      minRAM: 2,
      recommendedRAM: 4,
      isCloudRecommended: false,
      description: 'Media streaming center.',
    },
    {
      name: 'Jellyfin',
      category: 'Media',
      minCPU: 2,
      recommendedCPU: 4,
      minRAM: 1,
      recommendedRAM: 4,
      isCloudRecommended: false,
      description: 'Telemetry-free open media.',
    },
    {
      name: 'Immich',
      category: 'Media',
      minCPU: 2,
      recommendedCPU: 4,
      minRAM: 4,
      recommendedRAM: 8,
      isCloudRecommended: true,
      description: 'High performance photo backup.',
    },
    {
      name: 'Minecraft Server',
      category: 'Gaming',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 2,
      recommendedRAM: 4,
      isCloudRecommended: true,
      description: 'Famous sandbox game.',
    },
    // Monitoring
    {
      name: 'Grafana',
      category: 'Monitoring',
      minCPU: 1,
      recommendedCPU: 2,
      minRAM: 0.5,
      recommendedRAM: 1,
      isCloudRecommended: true,
      description: 'Analytics dashboards.',
    },
    {
      name: 'Prometheus',
      category: 'Monitoring',
      minCPU: 1,
      recommendedCPU: 4,
      minRAM: 1,
      recommendedRAM: 4,
      isCloudRecommended: true,
      description: 'Metrics aggregator.',
    },
    {
      name: 'Uptime Kuma',
      category: 'Monitoring',
      minCPU: 0.5,
      recommendedCPU: 1,
      minRAM: 0.25,
      recommendedRAM: 1,
      isCloudRecommended: true,
      description: 'Status tracking tool.',
    },
  ];

  await prisma.app.createMany({ data: servicesData });

  console.log('Insertando AppBundles...');

  const allServices = await prisma.app.findMany();
  const findSvc = (name: string) => allServices.find((s) => s.name === name);

  const sets = [
    {
      name: 'Starter Homelab',
      description: 'The standard entry point to self hosting.',
      services: ['Portainer', 'Nginx Proxy Manager', 'Pi-Hole'],
    },
    {
      name: 'Media Server Elite',
      description: 'Your own Netflix and Google Photos replacement.',
      services: ['Plex', 'Jellyfin', 'Immich'],
    },
    {
      name: 'DevOps Cloud',
      description: 'Full code hosting and CI/CD pipeline.',
      services: ['Gitlab', 'Jenkins', 'PostgreSQL', 'Redis'],
    },
  ];

  for (const s of sets) {
    const svcs = s.services.map((name) => findSvc(name)).filter(Boolean);
    if (svcs.length > 0) {
      await prisma.appBundle.create({
        data: {
          name: s.name,
          description: s.description,
          apps: {
            connect: svcs.map((svc) => ({ id: svc!.id })),
          },
        },
      });
    }
  }

  console.log('¡Base de datos populada con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

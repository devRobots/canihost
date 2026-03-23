import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando DB...");
  await prisma.appSet.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.machine.deleteMany({});

  console.log("Insertando Máquinas (Mini PCs y VPS CubePath)...");
  
  const machinesData = [
    { 
      name: 'Zimaboard 2 (832)', type: 'MINI_PC', brand: 'ZimaBoard', cpuCores: 4, memoryRamGb: 8,
      targetAudience: 'Home Labbers, Makers, and Self-Hosters',
      useCases: 'Personal Cloud, Media Server, Smart Home Automation',
      specialTech: 'Dual PCIe, Intel Celeron N3450',
      technicalSpecs: '4-Core 1.1-2.2GHz, 8GB LPDDR4, 32GB eMMC, 2x Gigabit LAN'
    },
    { 
      name: 'Zimaboard 2 (432)', type: 'MINI_PC', brand: 'ZimaBoard', cpuCores: 4, memoryRamGb: 4,
      targetAudience: 'Home Labbers, Makers',
      useCases: 'Lightweight Automation, DNS Ad-Blocking, File Server',
      specialTech: 'PCIe expansion slot',
      technicalSpecs: '4-Core 1.1-2.2GHz, 4GB LPDDR4, 32GB eMMC'
    },
    { 
      name: 'Chuwi Larkbox X', type: 'MINI_PC', brand: 'Chuwi', cpuCores: 4, memoryRamGb: 12,
      targetAudience: 'Budget Home Server Enthusiasts',
      useCases: 'Basic Media Streaming, Docker Containers',
      specialTech: 'Intel N100 Alder Lake-N',
      technicalSpecs: '4-Core up to 3.4GHz, 12GB LPDDR5, 512GB SSD, Wi-Fi 6'
    },
    { 
      name: 'Mac Mini M2', type: 'MINI_PC', brand: 'Apple', cpuCores: 8, memoryRamGb: 8,
      targetAudience: 'Apple Ecosystem Users, Developers',
      useCases: 'CI/CD runner, Xcode Server, Plex Media Server',
      specialTech: 'Apple Silicon M2, Hardware Video Encoding',
      technicalSpecs: '8-Core CPU, 10-Core GPU, 8GB Unified Memory, ProRes Engine'
    },
    { 
      name: 'Mac Mini M2 Pro', type: 'MINI_PC', brand: 'Apple', cpuCores: 10, memoryRamGb: 16,
      targetAudience: 'Pro Developers, Video Editors',
      useCases: 'Heavy Virtualization, High-end CI/CD, 4K Media Transcoding',
      specialTech: 'Apple Silicon M2 Pro, Advanced Media Engine',
      technicalSpecs: '10-Core CPU, 16-Core GPU, 16GB Unified Memory, Thunderbolt 4'
    },
    { 
      name: 'Raspberry Pi 5 (8GB)', type: 'MINI_PC', brand: 'Raspberry Pi', cpuCores: 4, memoryRamGb: 8,
      targetAudience: 'Tinkerers, IoT Enthusiasts',
      useCases: 'Home Assistant, Ad-Blocking, Retro Gaming, Edge Computing',
      specialTech: 'PCIe 2.0 interface, Custom Silicon RP1',
      technicalSpecs: 'Quad-core ARM Cortex-A76 @ 2.4GHz, 8GB LPDDR4X, Dual Micro-HDMI'
    },
    { 
      name: 'Raspberry Pi 4 (4GB)', type: 'MINI_PC', brand: 'Raspberry Pi', cpuCores: 4, memoryRamGb: 4,
      targetAudience: 'Beginner Self-Hosters',
      useCases: 'Pi-Hole, VPN Server, Simple Web Host',
      specialTech: 'GPIO Pins',
      technicalSpecs: 'Quad-core ARM Cortex-A72 @ 1.5GHz, 4GB LPDDR4'
    },
    { 
      name: 'Intel NUC 13 Pro', type: 'MINI_PC', brand: 'Intel', cpuCores: 12, memoryRamGb: 16,
      targetAudience: 'Business & Prosumers',
      useCases: 'Proxmox Virtualization, Database Hosting, Edge AI',
      specialTech: 'Intel vPro, Thunderbolt 4',
      technicalSpecs: 'Intel Core i5/i7 13th Gen, 16GB DDR4, NVMe SSD'
    },
    { 
      name: 'Intel NUC 12 Enthusiast', type: 'MINI_PC', brand: 'Intel', cpuCores: 14, memoryRamGb: 16,
      targetAudience: 'Gamers, Content Creators',
      useCases: 'Game Servers, Heavy Media Transcoding (Jellyfin)',
      specialTech: 'Dedicated Intel Arc GPU',
      technicalSpecs: 'Intel Core i7 12th Gen, 16GB RAM, Arc A770M 16GB'
    },
    { 
      name: 'Beelink SER5 Pro', type: 'MINI_PC', brand: 'Beelink', cpuCores: 6, memoryRamGb: 16,
      targetAudience: 'Value Seekers',
      useCases: 'Homelab Starter, Docker Swarm node',
      specialTech: 'AMD Ryzen 5800H',
      technicalSpecs: '6-Core AMD Ryzen, 16GB DDR4, 500GB NVMe'
    },
    { 
      name: 'Beelink SER6 Max', type: 'MINI_PC', brand: 'Beelink', cpuCores: 8, memoryRamGb: 32,
      targetAudience: 'Prosumers',
      useCases: 'Virtualization Node, Heavy Databases',
      specialTech: 'Magnetic Power Supply, Vapor Chamber',
      technicalSpecs: '8-Core AMD Ryzen 7735HS, 32GB DDR5, PCIe 4.0 SSD'
    },
    { 
      name: 'Minisforum UM790 Pro', type: 'MINI_PC', brand: 'Minisforum', cpuCores: 8, memoryRamGb: 32,
      targetAudience: 'Power Users',
      useCases: 'High-Performance Proxmox, Enterprise App Testing',
      specialTech: 'Cold Wave 2.0 Cooling',
      technicalSpecs: 'AMD Ryzen 9 7940HS, 32GB DDR5 5600MHz, Dual PCIe 4.0 SSDs'
    },
    { 
      name: 'Minisforum Venus NPB7', type: 'MINI_PC', brand: 'Minisforum', cpuCores: 14, memoryRamGb: 32,
      targetAudience: 'Power Users',
      useCases: 'Software Compilation, Massive Docker Stacks',
      specialTech: 'Intel Core i7 13th Gen (Raptor Lake)',
      technicalSpecs: '14-Core (6P+8E) up to 5.0GHz, 32GB DDR5, Dual 2.5G LAN'
    },
    { 
      name: 'Dell OptiPlex Micro Plus', type: 'MINI_PC', brand: 'Dell', cpuCores: 6, memoryRamGb: 16,
      targetAudience: 'Enterprise / Homelab Upgraders',
      useCases: 'Reliable 24/7 Hosting, pfSense Firewall',
      specialTech: 'Enterprise Management Features',
      technicalSpecs: 'Intel Core 13th Gen T-series, 16GB DDR5'
    },
    { 
      name: 'Lenovo ThinkCentre M70q', type: 'MINI_PC', brand: 'Lenovo', cpuCores: 6, memoryRamGb: 8,
      targetAudience: 'Budget Homelabbers',
      useCases: 'Kubernetes Nodes, Cluster Computing',
      specialTech: 'Military-spec tested durability',
      technicalSpecs: 'Intel Core i5, 8GB DDR4, Modular Expansion'
    },
    // CubePath VPS
    { 
      name: 'CubePath VPS Starter', type: 'VPS', brand: 'CubePath', cpuCores: 1, memoryRamGb: 1,
      targetAudience: 'Beginners, Students',
      useCases: 'Personal Blog, Static Websites, VPN Endpoint',
      specialTech: 'KVM Virtualization, 1Gbps Network',
      technicalSpecs: '1 vCPU, 1GB RAM, 25GB NVMe SSD, 1TB Bandwidth'
    },
    { 
      name: 'CubePath VPS Developer', type: 'VPS', brand: 'CubePath', cpuCores: 2, memoryRamGb: 4,
      targetAudience: 'Developers, Freelancers',
      useCases: 'Docker Host, CI/CD Runner, Small E-commerce',
      specialTech: 'DDoS Protection, Automated Backups',
      technicalSpecs: '2 vCPU, 4GB RAM, 80GB NVMe SSD, 4TB Bandwidth'
    },
    { 
      name: 'CubePath VPS Dev Pro', type: 'VPS', brand: 'CubePath', cpuCores: 4, memoryRamGb: 8,
      targetAudience: 'Startups, Agencies',
      useCases: 'High-Traffic Sites, SaaS Backend, Medium Database',
      specialTech: 'Dedicated Resources, Custom ISO Support',
      technicalSpecs: '4 vCPU, 8GB RAM, 160GB NVMe SSD, 8TB Bandwidth'
    },
    { 
      name: 'CubePath VPS Enterprise', type: 'VPS', brand: 'CubePath', cpuCores: 8, memoryRamGb: 16,
      targetAudience: 'Enterprises, Established SaaS',
      useCases: 'Big Data Processing, Enterprise ERP, Game Servers',
      specialTech: 'Premium Routing, SLA 99.99%',
      technicalSpecs: '8 vCPU, 16GB RAM, 320GB NVMe SSD, Unmetered Bandwidth'
    },
  ];

  await prisma.machine.createMany({ data: machinesData });

  console.log("Insertando Servicios (>40 aplicaciones)...");
  
  const servicesData = [
    // Databases
    { name: 'PostgreSQL', category: 'Databases', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Powerful open source relational database.', minRequirements: '1 Core, 512MB RAM', recRequirements: '2 Cores, 2GB+ RAM' },
    { name: 'MySQL', category: 'Databases', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Standard relational DB.', minRequirements: '1 Core, 512MB RAM', recRequirements: '2 Cores, 2GB+ RAM' },
    { name: 'MongoDB', category: 'Databases', cpuCost: 0.5, ramCostGb: 1.0, isCloudRecommended: true, description: 'Leading NoSQL database.', minRequirements: '1 Core, 1GB RAM', recRequirements: '2 Cores, 4GB RAM' },
    { name: 'Redis', category: 'Databases', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'In-memory key-value store and cache.', minRequirements: '1 Core, 64MB RAM', recRequirements: '1 Core, 1GB RAM' },
    // Development & DevOps
    { name: 'Gitlab', category: 'DevOps', cpuCost: 2.0, ramCostGb: 4.0, isCloudRecommended: true, description: 'Comprehensive DevOps platform.', minRequirements: '4 Cores, 4GB RAM', recRequirements: '8 Cores, 8GB RAM' },
    { name: 'Jenkins', category: 'DevOps', cpuCost: 1.0, ramCostGb: 1.5, isCloudRecommended: true, description: 'Open source automation server.', minRequirements: '1 Core, 1GB RAM', recRequirements: '4 Cores, 4GB RAM' },
    { name: 'Gitea', category: 'DevOps', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Lightweight GitLab/GitHub alternative.', minRequirements: '1 Core, 512MB RAM', recRequirements: '2 Cores, 1GB RAM' },
    { name: 'Portainer', category: 'DevOps', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Lightweight Docker/Kubernetes management.', minRequirements: '1 Core, 256MB RAM', recRequirements: '1 Core, 512MB RAM' },
    { name: 'Coolify', category: 'DevOps', cpuCost: 0.8, ramCostGb: 1.0, isCloudRecommended: true, description: 'Modern self-hosted PAAS platform.', minRequirements: '2 Cores, 2GB RAM', recRequirements: '4 Cores, 4GB RAM' },
    // Networking
    { name: 'Nginx Proxy Manager', category: 'Networking', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Visual panel for Nginx reverse proxy.', minRequirements: '1 Core, 256MB RAM', recRequirements: '1 Core, 512MB RAM' },
    { name: 'Traefik', category: 'Networking', cpuCost: 0.3, ramCostGb: 0.2, isCloudRecommended: true, description: 'Smart reverse proxy.', minRequirements: '1 Core, 256MB RAM', recRequirements: '2 Cores, 1GB RAM' },
    { name: 'Pi-Hole', category: 'Networking', cpuCost: 0.1, ramCostGb: 0.2, isCloudRecommended: false, description: 'Network-level ad blocker (DNS).', minRequirements: '1 Core, 512MB RAM', recRequirements: '1 Core, 1GB RAM' },
    { name: 'Wireguard (WG-Easy)', category: 'Networking', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Fast and modern VPN.', minRequirements: '1 Core, 256MB RAM', recRequirements: '1 Core, 512MB RAM' },
    // CMS
    { name: 'Strapi', category: 'CMS', cpuCost: 0.8, ramCostGb: 1.0, isCloudRecommended: true, description: 'Node.js Headless CMS.', minRequirements: '1 Core, 1GB RAM', recRequirements: '2 Cores, 2GB RAM' },
    { name: 'WordPress', category: 'CMS', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: "The world's most popular CMS.", minRequirements: '1 Core, 512MB RAM', recRequirements: '2 Cores, 1GB RAM' },
    // Productivity
    { name: 'Nextcloud', category: 'Productivity', cpuCost: 1.0, ramCostGb: 1.5, isCloudRecommended: true, description: 'Full personal cloud suite (files, contacts, etc).', minRequirements: '1 Core, 1GB RAM', recRequirements: '4 Cores, 4GB RAM' },
    { name: 'Vaultwarden', category: 'Security', cpuCost: 0.1, ramCostGb: 0.1, isCloudRecommended: true, description: 'Lightweight Bitwarden in Rust.', minRequirements: '1 Core, 128MB RAM', recRequirements: '1 Core, 512MB RAM' },
    { name: 'Paperless-ngx', category: 'Productivity', cpuCost: 0.5, ramCostGb: 1.0, isCloudRecommended: true, description: 'Digital document archive with OCR.', minRequirements: '1 Core, 1GB RAM', recRequirements: '2 Cores, 2GB RAM' },
    // Smart Home & IoT
    { name: 'n8n', category: 'Automation', cpuCost: 0.5, ramCostGb: 1.0, isCloudRecommended: true, description: 'Zapier-like automation tool.', minRequirements: '1 Core, 1GB RAM', recRequirements: '2 Cores, 2GB RAM' },
    { name: 'Home Assistant', category: 'Smart Home', cpuCost: 1.0, ramCostGb: 1.0, isCloudRecommended: false, description: 'Total home automation control. (NOT RECOMMENDED IN CLOUD)', minRequirements: '2 Cores, 2GB RAM', recRequirements: '4 Cores, 4GB RAM' },
    { name: 'Frigate NVR', category: 'Media', cpuCost: 2.0, ramCostGb: 2.0, isCloudRecommended: false, description: 'NVR with AI detection. Requires Coral/GPU hardware.', minRequirements: '2 Cores, 2GB RAM (Hardware Acceleration needed)', recRequirements: '4 Cores, 4GB RAM + Google Coral TPU' },
    // Media & Entertainment
    { name: 'Plex', category: 'Media', cpuCost: 1.5, ramCostGb: 2.0, isCloudRecommended: false, description: 'Media center (streaming). Best with local GPU.', minRequirements: '2 Cores, 2GB RAM', recRequirements: '4 Cores, 4GB RAM + Intel QuickSync/Nvidia GPU' },
    { name: 'Jellyfin', category: 'Media', cpuCost: 1.5, ramCostGb: 2.0, isCloudRecommended: false, description: 'Telemetry-free open media software.', minRequirements: '2 Cores, 1GB RAM', recRequirements: '4 Cores, 4GB RAM + Hardware Transcoding' },
    { name: 'Immich', category: 'Media', cpuCost: 2.0, ramCostGb: 3.0, isCloudRecommended: true, description: 'High performance self-hosted photo backup.', minRequirements: '2 Cores, 4GB RAM', recRequirements: '4 Cores, 8GB RAM + Redis/PostgreSQL' },
    { name: 'Minecraft Server', category: 'Gaming', cpuCost: 1.5, ramCostGb: 2.5, isCloudRecommended: true, description: 'Famous game server (Java/Bedrock).', minRequirements: '1 Core, 2GB RAM', recRequirements: '2 Cores, 4GB+ RAM (High Clock Speed)' },
    // Monitoring
    { name: 'Grafana', category: 'Monitoring', cpuCost: 0.5, ramCostGb: 0.5, isCloudRecommended: true, description: 'Dashboards and visual analytics.', minRequirements: '1 Core, 512MB RAM', recRequirements: '2 Cores, 1GB RAM' },
    { name: 'Prometheus', category: 'Monitoring', cpuCost: 0.5, ramCostGb: 1.0, isCloudRecommended: true, description: 'Metric monitoring and alerting.', minRequirements: '1 Core, 1GB RAM', recRequirements: '4 Cores, 4GB RAM' },
    { name: 'Uptime Kuma', category: 'Monitoring', cpuCost: 0.2, ramCostGb: 0.2, isCloudRecommended: true, description: 'Visual uptime monitoring tool.', minRequirements: '1 Core, 256MB RAM', recRequirements: '1 Core, 1GB RAM' },
  ];

  await prisma.service.createMany({ data: servicesData });

  console.log("Insertando AppSets...");
  
  const allServices = await prisma.service.findMany();
  const findSvc = (name: string) => allServices.find(s => s.name === name);

  const sets = [
    {
      name: 'Basic Dev Stack',
      description: 'Essential tools for any development team.',
      services: ['PostgreSQL', 'Redis', 'Gitlab', 'Nginx Proxy Manager']
    },
    {
      name: 'Web Hosting Pro',
      description: 'Everything needed to host websites and blogs with analytics.',
      services: ['WordPress', 'MySQL', 'Nginx Proxy Manager', 'Uptime Kuma', 'Grafana']
    },
    {
      name: 'Home Entertainment',
      description: 'Self-hosted media center (restricted to local hardware/GPUs).',
      services: ['Jellyfin', 'Nextcloud']
    },
    {
       name: 'My Personal Cloud (Secure)',
       description: 'Replace Google Drive/Photos with absolute privacy.',
       services: ['Nextcloud', 'Immich', 'Vaultwarden', 'Nginx Proxy Manager']
    },
    {
      name: 'Smart Home Master',
      description: 'Total local control of your smart home without cloud reliance.',
      services: ['Home Assistant', 'Frigate NVR']
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

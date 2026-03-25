import 'dotenv/config';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { HostType, PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

function parseCSV(filePath: string): Record<string, string>[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

async function main() {
  console.log('Limpiando DB...');
  await prisma.appBundle.deleteMany({});
  await prisma.app.deleteMany({});
  await prisma.hostVariant.deleteMany({});
  await prisma.host.deleteMany({});

  console.log('Insertando Hosts y Variantes...');
  const hostsData = parseCSV(path.join(__dirname, 'data', 'hosts.csv')).map(row => ({
    id: row.id,
    name: row.name,
    type: row.type as HostType,
  }));

  const variantsData = parseCSV(path.join(__dirname, 'data', 'variants.csv')).map(row => ({
    id: row.id,
    hostId: row.hostId,
    name: row.name,
    cpuCores: parseInt(row.cpuCores, 10),
    memoryRamGb: parseInt(row.memoryRamGb, 10),
  }));

  await prisma.host.createMany({ data: hostsData });
  await prisma.hostVariant.createMany({ data: variantsData });

  console.log('Insertando Apps...');

  const appsData = parseCSV(path.join(__dirname, 'data', 'apps.csv')).map(row => ({
    id: row.id,
    name: row.name,
    category: row.category,
    minCPU: parseInt(row.minCPU, 10),
    recommendedCPU: parseInt(row.recommendedCPU, 10),
    minRAM: parseFloat(row.minRAM),
    recommendedRAM: parseFloat(row.recommendedRAM),
    isCloudRecommended: row.isCloudRecommended === 'true',
    description: row.description,
    longDescription: row.longDescription,
    officialUrl: row.officialUrl || undefined,
    dockerRegistryUrl: row.dockerRegistryUrl || undefined,
    cubepathUrl: row.cubepathUrl || undefined,
    logoUrl: row.logoUrl,
  }));

  await prisma.app.createMany({ data: appsData });

  console.log('Insertando AppBundles...');

  const sets = parseCSV(path.join(__dirname, 'data', 'bundles.csv')).map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    appIds: row.appIds.split('|'),
  }));

  for (const s of sets) {
    if (s.appIds.length > 0) {
      await prisma.appBundle.create({
        data: {
          id: s.id,
          name: s.name,
          description: s.description,
          apps: {
            connect: s.appIds.map((id) => ({ id })),
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

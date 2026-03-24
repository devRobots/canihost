import { notFound } from 'next/navigation';

import ServerBuilder from '@/components/ServerBuilder';
import StoreInitializer from '@/components/StoreInitializer';
import prisma from '@/lib/prisma';
import { type Host } from '@/types';

export default async function BuilderPage() {
  const [hosts, allBundles, allApps] = await Promise.all([
    prisma.host.findMany({
      orderBy: { name: 'asc' },
      include: { variants: true },
    }),
    prisma.appBundle.findMany({ include: { apps: true } }),
    prisma.app.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const targetId = hosts[0]?.id;
  const host = hosts.find((m: Host) => m.id === targetId);
  if (!host) return notFound();

  return (
    <>
      <StoreInitializer
        hosts={hosts}
        allBundles={allBundles}
        allApps={allApps}
      />
      <ServerBuilder />
    </>
  );
}

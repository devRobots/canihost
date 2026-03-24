import Hero from '@/components/Hero';
import HostPicker from '@/components/HostPicker';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import StoreInitializer from '@/components/StoreInitializer';
import prisma from '@/lib/prisma';

export default async function Home() {
  const [hosts, allBundles, allApps] = await Promise.all([
    prisma.host.findMany({
      orderBy: { name: 'asc' },
      include: { variants: true },
    }),
    prisma.appBundle.findMany({ include: { apps: true } }),
    prisma.app.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <>
      <StoreInitializer
        hosts={hosts}
        allBundles={allBundles}
        allApps={allApps}
      />
      <div className="bg-page flex min-h-screen flex-col font-mono">
        <Hero />
        <div className="container mx-auto flex flex-col gap-10 px-4 py-8 sm:px-8">
          <HostPicker />
          <RecommendationsPanel />
        </div>
      </div>
    </>
  );
}

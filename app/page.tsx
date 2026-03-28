import Hero from '@/components/core/Hero';
import StoreInitializer from '@/components/core/StoreInitializer';
import RecommendationsPanel from '@/components/home/AppsAndBundles';
import HostPicker from '@/components/hostpicker/HostPicker';
import prisma from '@/lib/prisma';

export default async function Home() {
  const [hosts, bundles, apps] = await Promise.all([
    prisma.host.findMany({
      orderBy: { name: 'asc' },
      include: { variants: true },
    }),
    prisma.appBundle.findMany({ include: { apps: true } }),
    prisma.app.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <>
      <StoreInitializer hosts={hosts} bundles={bundles} apps={apps} />
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

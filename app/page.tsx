import Hero from "@/components/Hero";
import MachinePicker from "@/components/MachinePicker";
import RecommendationsPanel from "@/components/RecommendationsPanel";
import StoreInitializer from "@/components/StoreInitializer";
import prisma from "@/lib/prisma";

export default async function Home() {
  const [machines, allBundles, allServices] = await Promise.all([
    prisma.machine.findMany({ orderBy: { name: 'asc' }, include: { variants: true } }),
    prisma.appBundle.findMany({ include: { services: true } }),
    prisma.service.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <>
      <StoreInitializer machines={machines} allBundles={allBundles} allServices={allServices} />
      <div className="min-h-screen flex flex-col font-mono bg-page">
        <Hero />
        <div className="container mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">
          <MachinePicker />
          <RecommendationsPanel />
        </div>
      </div>
    </>
  );
}

import prisma from "@/lib/prisma";
import StoreInitializer from "@/components/StoreInitializer";
import Hero from "@/components/Hero";
import MachinePicker from "@/components/MachinePicker";
import RecommendationsPanel from "@/components/RecommendationsPanel";

export default async function Home() {
  const [machines, allSets, allServices] = await Promise.all([
    prisma.machine.findMany({ orderBy: { name: 'asc' } }),
    prisma.appSet.findMany({ include: { services: true } }),
    prisma.service.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <>
      <StoreInitializer machines={machines} allSets={allSets} allServices={allServices} />
      <div className="min-h-screen flex flex-col font-mono bg-page">
        <Hero />
        <div className="container mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">
          <section>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mb-4 text-fg-muted">
              <span className="text-accent">{'//'}</span>
              Select your hardware
            </div>
            <MachinePicker />
          </section>
          <RecommendationsPanel />
        </div>
      </div>
    </>
  );
}

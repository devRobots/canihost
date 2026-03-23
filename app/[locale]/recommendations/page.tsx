import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";

export default async function Recommendations({
  searchParams,
}: {
  searchParams: Promise<{ machineId: string }>;
}) {
  const { machineId } = await searchParams;
  
  if (!machineId) return notFound();

  const machine = await prisma.machine.findUnique({
    where: { id: machineId }
  });

  if (!machine) return notFound();

  const allSets = await prisma.appSet.findMany({
    include: { services: true }
  });

  const recommendedSets = allSets.filter((set: any) => {
    let totalCpu = 0;
    let totalRam = 0;
    let isCloudSafe = true;

    for (const svc of set.services) {
      totalCpu += svc.cpuCost;
      totalRam += svc.ramCostGb;
      if (!svc.isCloudRecommended && machine.type === 'VPS') {
        isCloudSafe = false;
      }
    }

    return totalCpu <= machine.cpuCores && totalRam <= (machine.memoryRamGb * 0.9) && isCloudSafe;
  });

  return (
    <div className="flex flex-col items-center flex-1 p-8 gap-8 w-full max-w-5xl mx-auto">
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {machine.name}
          </h2>
          <p className="text-zinc-400 flex flex-wrap gap-4 mt-2 font-medium">
            <span className="bg-zinc-800 px-3 py-1 rounded-md">💻 {machine.cpuCores} Cores</span>
            <span className="bg-zinc-800 px-3 py-1 rounded-md">📱 {machine.memoryRamGb} GB RAM</span>
            <span className="bg-zinc-800 px-3 py-1 rounded-md">{machine.type === 'VPS' ? '☁️ Cloud VPS' : '🏠 Local Mini PC'}</span>
          </p>
        </div>
        <Link 
          href={`/builder?machineId=${machine.id}`} 
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg active:scale-95 text-center w-full md:w-auto"
        >
          Ir al Constructor Manual ⚡
        </Link>
      </div>

      <h3 className="text-3xl font-extrabold w-full text-left tracking-tight">AppSets Recomendados</h3>
      <p className="text-zinc-500 w-full text-left -mt-6">Paquetes precargados listos para tu equipo y entorno.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
        {recommendedSets.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-400 text-lg">Esta máquina no tiene recursos suficientes para nuestros sets predeterminados, o es un VPS y los sets contienen apps exclusivas locales (como Home Assistant).<br/><br/>Intenta usar el Constructor Manual.</p>
          </div>
        ) : (
          recommendedSets.map((set: any) => {
            const totalCpu = set.services.reduce((acc: number, s: any) => acc + s.cpuCost, 0);
            const totalRam = set.services.reduce((acc: number, s: any) => acc + s.ramCostGb, 0);
            const cpuPercent = Math.round((totalCpu / machine.cpuCores) * 100);
            const ramPercent = Math.round((totalRam / machine.memoryRamGb) * 100);

            return (
              <div key={set.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl hover:-translate-y-1 transition-transform group">
                <h4 className="text-xl font-bold">{set.name}</h4>
                <p className="text-zinc-400 text-sm flex-1">{set.description}</p>
                
                <div className="flex flex-col gap-2 mt-2">
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className={`h-2 rounded-full ${cpuPercent > 85 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(cpuPercent, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 font-medium">
                    <span>CPU: {totalCpu} cores</span>
                    <span>{cpuPercent}%</span>
                  </div>

                  <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                    <div className={`h-2 rounded-full ${ramPercent > 85 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${Math.min(ramPercent, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 font-medium">
                    <span>RAM: {totalRam} GB</span>
                    <span>{ramPercent}%</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {set.services.map((s: any) => (
                    <span key={s.id} className="bg-zinc-800 px-2 py-1 rounded-md text-zinc-300 border border-zinc-700 whitespace-nowrap">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}

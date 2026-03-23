import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import MachineSelector from "@/components/MachineSelector";

export default async function Home() {
  const t = await getTranslations("Index");
  
  const machines = await prisma.machine.findMany({
    orderBy: { cpuCores: 'asc' }
  });

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center gap-8">
      <main className="flex flex-col gap-8 items-center max-w-2xl w-full">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-tr from-indigo-500 to-purple-600 bg-clip-text text-transparent pb-2 drop-shadow-sm">
          {t("title")}
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-lg leading-relaxed">
          {t("subtitle")}
        </p>
        
        <div className="flex flex-col gap-4 mt-8 w-full max-w-sm">
          <label className="text-sm font-semibold uppercase tracking-wider text-zinc-500 text-left ml-2">
            {t("selectMachine")}
          </label>
          <MachineSelector machines={machines} />
        </div>
      </main>
    </div>
  );
}

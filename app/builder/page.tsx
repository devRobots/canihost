import { notFound } from "next/navigation";

import ServerBuilder from "@/components/ServerBuilder";
import StoreInitializer from "@/components/StoreInitializer";
import prisma from "@/lib/prisma";
import { type Machine } from "@/types";

export default async function BuilderPage() {
  const [machines, allBundles, allServices] = await Promise.all([
    prisma.machine.findMany({ orderBy: { name: 'asc' }, include: { variants: true } }),
    prisma.appBundle.findMany({ include: { services: true } }),
    prisma.service.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const targetId = machines[0]?.id;
  const machine = machines.find((m: Machine) => m.id === targetId);
  if (!machine) return notFound();

  return (
    <>
      <StoreInitializer machines={machines} allBundles={allBundles} allServices={allServices} />
      <ServerBuilder />
    </>
  );
}

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ServerBuilder from "@/components/ServerBuilder";

export default async function BuilderPage({
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

  const services = await prisma.service.findMany({
    orderBy: { category: 'asc' }
  });

  return (
    <ServerBuilder machine={machine} allServices={services} />
  );
}

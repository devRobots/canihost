import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

import StoreInitializer from "@/components/StoreInitializer";

export default async function Home() {
  const t = await getTranslations("Index");

  const [machines, allSets, allServices] = await Promise.all([
    prisma.machine.findMany({ orderBy: { name: 'asc' } }),
    prisma.appSet.findMany({ include: { services: true } }),
    prisma.service.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const translations = {
    title: t("title"),
    subtitle: t("subtitle"),
    selectMachine: t("selectMachine"),
    recommendations: t("recommendations"),
    builder: t("builder"),
    noRecommendations: t("noRecommendations"),
    cpuLabel: "CPU",
    ramLabel: "RAM",
    cloudWarning: t("cloudWarning"),
  };

  return (
    <>
      <StoreInitializer machines={machines} allSets={allSets} allServices={allServices} />
      <HomeClient t={translations} />
    </>
  );
}

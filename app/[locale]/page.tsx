import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const t = await getTranslations("Index");

  const [machines, allSets] = await Promise.all([
    prisma.machine.findMany({ orderBy: { name: 'asc' } }),
    prisma.appSet.findMany({ include: { services: true } }),
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

  return <HomeClient machines={machines} allSets={allSets} t={translations} />;
}

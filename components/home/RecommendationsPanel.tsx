'use client';

import { App } from '@prisma/client';
import { useMemo, useState } from 'react';

import AppBundlesPanel from '@/components/home/AppBundlesPanel';
import BarelyUsableAppsPanel from '@/components/home/BarelyUsableAppsPanel';
import RecommendationsSidebar from '@/components/home/RecommendationsSidebar';
import RecommendedAppsPanel from '@/components/home/RecommendedAppsPanel';
import UnsupportedAppsPanel from '@/components/home/UnsupportedAppsPanel';
import AppBundleModal from '@/components/modals/AppBundleModal';
import AppModal from '@/components/modals/AppModal';
import { useDbStore, useHostStore } from '@/lib/store';
import { type AppBundle } from '@/types';

export default function RecommendationsPanel() {
  const { apps } = useDbStore();
  const { core, ram, selectedHostId } = useHostStore();
  const [appModalData, setAppModalData] = useState<App | null>(null);
  const [appBundleModalData, setAppBundleModalData] =
    useState<AppBundle | null>(null);

  const { recommendedApps, barelyUsableApps, unsupportedApps } = useMemo(() => {
    const isCloudComp = (a: App) =>
      a.isCloudRecommended !== false;
    const meetsMin = (a: App) =>
      a.minCPU <= core && a.minRAM <= ram;
    const meetsRec = (a: App) =>
      a.recommendedCPU <= core &&
      a.recommendedRAM <= ram;

    return {
      recommendedApps: apps
        .filter((a) => isCloudComp(a) && meetsMin(a) && meetsRec(a))
        .sort((a, b) => b.recommendedRAM - a.recommendedRAM),

      barelyUsableApps: apps
        .filter((a) => isCloudComp(a) && meetsMin(a) && !meetsRec(a))
        .sort((a, b) => b.minRAM - a.minRAM),

      unsupportedApps: apps
        .filter((a) => !isCloudComp(a) || !meetsMin(a))
        .sort((a, b) => b.minRAM - a.minRAM),
    };
  }, [apps, core, ram]);

  if (!selectedHostId) {
    return (
      <div className="text-fg-dim py-16 text-center text-sm">
        <div className="mb-4 text-4xl">_</div>
        <span className="prompt">
          Select a host above to see recommendations
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col items-start gap-8 lg:flex-row">
      {/* MAIN CONTENT */}
      <section
        id="recommendations-section"
        className="flex w-full min-w-0 flex-1 flex-col gap-10"
      >
        {/* 1. App Bundles Panel */}
        <div id="section-bundles" className="scroll-mt-24">
          <AppBundlesPanel
            onBundleClick={setAppBundleModalData}
            onAppClick={setAppModalData}
          />
        </div>

        {/* 2. Recommended Individual Apps */}
        <div id="section-recommended" className="scroll-mt-24">
          <RecommendedAppsPanel
            apps={recommendedApps}
            onAppClick={setAppModalData}
          />
        </div>

        {/* 3. Barely Usable Individual Apps */}
        <div id="section-barely-usable" className="scroll-mt-24">
          <BarelyUsableAppsPanel apps={barelyUsableApps} onAppClick={setAppModalData} />
        </div>

        {/* 4. Unsupported Individual Apps */}
        <div id="section-unsupported" className="scroll-mt-24">
          <UnsupportedAppsPanel
            apps={unsupportedApps}
            onAppClick={setAppModalData}
          />
        </div>
      </section>

      {/* INDEX SIDEBAR */}
      <RecommendationsSidebar
        showBarelyUsable={barelyUsableApps.length > 0}
        showUnsupported={unsupportedApps.length > 0}
      />

      {/* Modals */}
      <AppModal app={appModalData} onClose={() => setAppModalData(null)} />
      <AppBundleModal
        bundle={appBundleModalData}
        onClose={() => setAppBundleModalData(null)}
      />
    </div>
  );
}

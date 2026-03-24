'use client';

import { App } from '@prisma/client';
import { HostType } from '@prisma/enums';
import { useMemo, useState } from 'react';

import AppBundleModal from '@/components/AppBundleModal';
import AppBundlesPanel from '@/components/AppBundlesPanel';
import AppModal from '@/components/AppModal';
import BarelyUsableAppsPanel from '@/components/BarelyUsableAppsPanel';
import RecommendedAppsPanel from '@/components/RecommendedAppsPanel';
import UnsupportedAppsPanel from '@/components/UnsupportedAppsPanel';
import { useDbStore, useHostStore, useModeStore } from '@/lib/store';
import { type ActiveHost, type AppBundle } from '@/types';

export default function RecommendationsPanel() {
  const { hosts, bundles: allBundles, apps: allApps } = useDbStore();
  const {
    selectedHostId,
    selectedVariantId,
    core,
    ram,
  } = useHostStore();
  const { mode } = useModeStore();
  const [appModalData, setAppModalData] = useState<App | null>(null);
  const [appBundleModalData, setAppBundleModalData] =
    useState<AppBundle | null>(null);

  const isExpert = mode === 'expert';

  const {
    recommendedBundles,
    recommendedApps,
    barelyUsableApps,
    unsupportedApps,
    activeHost,
  } = useMemo(() => {
    const host = selectedHostId
      ? (hosts.find((h) => h.id === selectedHostId) ?? null)
      : null;
    if (!host)
      return {
        recommendedBundles: [],
        recommendedApps: [],
        barelyUsableApps: [],
        unsupportedApps: [],
        activeHost: null,
      };

    const selectedVariant =
      host.variants.find((v) => v.id === selectedVariantId) ||
      host.variants[0];
    const isCustom = host.type === HostType.CUSTOM;

    const activeHost: ActiveHost = {
      ...host,
      cpuCores: isCustom ? core : selectedVariant?.cpuCores || 0,
      memoryRamGb: isCustom
        ? ram
        : selectedVariant?.memoryRamGb || 0,
    };

    // 1. Evaluate Bundles
    const maxBundles = 6;
    const recommendedBundles = allBundles
      .filter((bundle) => {
        let totalMinCpu = 0;
        let totalMinRam = 0;
        let cloudSafe = true;
        for (const svc of bundle.apps) {
          totalMinCpu += svc.minCPU;
          totalMinRam += svc.minRAM;
          if (!svc.isCloudRecommended && activeHost.type === HostType.VPS)
            cloudSafe = false;
        }
        return (
          totalMinCpu <= activeHost.cpuCores &&
          totalMinRam <= activeHost.memoryRamGb &&
          cloudSafe
        );
      })
      .slice(0, maxBundles);

    // 2. Evaluate Individual Apps
    const recApps: App[] = [];
    const barelyApps: App[] = [];
    const unsuppApps: App[] = [];

    for (const svc of allApps) {
      const isVpsIncompatible =
        svc.isCloudRecommended === false &&
        activeHost.type === HostType.VPS;
      const meetsMinimums =
        svc.minCPU <= activeHost.cpuCores &&
        svc.minRAM <= activeHost.memoryRamGb;

      if (isVpsIncompatible || !meetsMinimums) {
        unsuppApps.push(svc);
      } else {
        const meetsRecommended =
          svc.recommendedCPU <= activeHost.cpuCores &&
          svc.recommendedRAM <= activeHost.memoryRamGb;

        if (meetsRecommended) {
          recApps.push(svc);
        } else {
          barelyApps.push(svc);
        }
      }
    }

    // Sort apps by RAM Cost descending
    recApps.sort((a, b) => b.recommendedRAM - a.recommendedRAM);
    barelyApps.sort((a, b) => b.minRAM - a.minRAM);
    unsuppApps.sort((a, b) => b.minRAM - a.minRAM);

    return {
      recommendedBundles,
      recommendedApps: recApps.slice(0, 12),
      barelyUsableApps: barelyApps.slice(0, 12),
      unsupportedApps: unsuppApps.slice(0, 12),
      activeHost,
    };
  }, [
    allBundles,
    allApps,
    selectedHostId,
    selectedVariantId,
    core,
    ram,
    hosts,
  ]);

  if (!activeHost) {
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
            bundles={recommendedBundles}
            host={activeHost}
            isExpert={isExpert}
            onBundleClick={setAppBundleModalData}
            onAppClick={setAppModalData}
          />
        </div>

        {/* 2. Recommended Individual Apps */}
        <div id="section-recommended" className="scroll-mt-24">
          <RecommendedAppsPanel
            apps={recommendedApps}
            isExpert={isExpert}
            onAppClick={setAppModalData}
          />
        </div>

        {/* 3. Barely Usable Individual Apps */}
        <div id="section-barely-usable" className="scroll-mt-24">
          <BarelyUsableAppsPanel
            apps={barelyUsableApps}
            isExpert={isExpert}
            onAppClick={setAppModalData}
          />
        </div>

        {/* 4. Unsupported Individual Apps */}
        <div id="section-unsupported" className="scroll-mt-24">
          <UnsupportedAppsPanel
            apps={unsupportedApps}
            isExpert={isExpert}
            onAppClick={setAppModalData}
          />
        </div>
      </section>

      {/* INDEX SIDEBAR */}
      <aside className="border-border/50 sticky top-24 hidden w-56 shrink-0 flex-col gap-4 border-l pl-6 xl:flex">
        <span className="text-fg-dim text-[10px] font-bold tracking-widest uppercase">
          <span className="text-accent mr-2">{'//'}</span>
          Quick Navigation
        </span>
        <div className="mt-2 flex flex-col gap-3">
          <a
            href="#section-bundles"
            className="text-fg-muted hover:text-accent flex items-center gap-3 text-sm font-bold transition-colors"
          >
            <span className="bg-accent h-1.5 w-1.5 rounded-full opacity-50"></span>{' '}
            App Bundles
          </a>
          <a
            href="#section-recommended"
            className="text-fg-muted hover:text-accent flex items-center gap-3 text-sm font-bold transition-colors"
          >
            <span className="bg-accent h-1.5 w-1.5 rounded-full opacity-50"></span>{' '}
            Recommended
          </a>
          {barelyUsableApps.length > 0 && (
            <a
              href="#section-barely-usable"
              className="text-fg-muted hover:text-accent flex items-center gap-3 text-sm font-bold transition-colors"
            >
              <span className="bg-accent h-1.5 w-1.5 rounded-full opacity-50"></span>{' '}
              Barely Usable
            </a>
          )}
          {unsupportedApps.length > 0 && (
            <a
              href="#section-unsupported"
              className="text-fg-muted hover:text-accent flex items-center gap-3 text-sm font-bold transition-colors"
            >
              <span className="bg-accent h-1.5 w-1.5 rounded-full opacity-50"></span>{' '}
              Unsupported
            </a>
          )}
        </div>
      </aside>

      {/* Modals */}
      <AppModal
        app={appModalData}
        onClose={() => setAppModalData(null)}
      />
      <AppBundleModal
        bundle={appBundleModalData}
        onClose={() => setAppBundleModalData(null)}
      />
    </div>
  );
}

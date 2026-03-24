'use client';

import { Service } from '@prisma/client';
import { MachineType } from '@prisma/enums';
import { useMemo, useState } from 'react';

import AppBundleModal from '@/components/AppBundleModal';
import AppBundlesPanel from '@/components/AppBundlesPanel';
import BarelyUsableAppsPanel from '@/components/BarelyUsableAppsPanel';
import RecommendedAppsPanel from '@/components/RecommendedAppsPanel';
import ServiceModal from '@/components/ServiceModal';
import UnsupportedAppsPanel from '@/components/UnsupportedAppsPanel';
import { useAppStore } from '@/lib/store';
import { type ActiveMachine, type AppBundle } from '@/types';

export default function RecommendationsPanel() {
  const {
    machines,
    allBundles,
    allServices,
    selectedMachineId,
    selectedVariantId,
    customVariantCores,
    customVariantRam,
    mode,
  } = useAppStore();
  const [serviceModalData, setServiceModalData] = useState<Service | null>(
    null,
  );
  const [appBundleModalData, setAppBundleModalData] =
    useState<AppBundle | null>(null);

  const isExpert = mode === 'expert';

  const {
    recommendedBundles,
    recommendedApps,
    barelyUsableApps,
    unsupportedApps,
    activeMachine,
  } = useMemo(() => {
    const machine = selectedMachineId
      ? (machines.find((m) => m.id === selectedMachineId) ?? null)
      : null;
    if (!machine)
      return {
        recommendedBundles: [],
        recommendedApps: [],
        barelyUsableApps: [],
        unsupportedApps: [],
        activeMachine: null,
      };

    const selectedVariant =
      machine.variants.find((v) => v.id === selectedVariantId) ||
      machine.variants[0];
    const isCustom = machine.type === MachineType.CUSTOM;

    const activeMachine: ActiveMachine = {
      ...machine,
      cpuCores: isCustom ? customVariantCores : selectedVariant?.cpuCores || 0,
      memoryRamGb: isCustom
        ? customVariantRam
        : selectedVariant?.memoryRamGb || 0,
    };

    // 1. Evaluate Bundles
    const maxBundles = 6;
    const recommendedBundles = allBundles
      .filter((bundle) => {
        let totalMinCpu = 0;
        let totalMinRam = 0;
        let cloudSafe = true;
        for (const svc of bundle.services) {
          totalMinCpu += svc.minCPU;
          totalMinRam += svc.minRAM;
          if (!svc.isCloudRecommended && activeMachine.type === MachineType.VPS)
            cloudSafe = false;
        }
        return (
          totalMinCpu <= activeMachine.cpuCores &&
          totalMinRam <= activeMachine.memoryRamGb &&
          cloudSafe
        );
      })
      .slice(0, maxBundles);

    // 2. Evaluate Individual Apps
    const recApps: Service[] = [];
    const barelyApps: Service[] = [];
    const unsuppApps: Service[] = [];

    for (const svc of allServices) {
      const isVpsIncompatible =
        svc.isCloudRecommended === false &&
        activeMachine.type === MachineType.VPS;
      const meetsMinimums =
        svc.minCPU <= activeMachine.cpuCores &&
        svc.minRAM <= activeMachine.memoryRamGb;

      if (isVpsIncompatible || !meetsMinimums) {
        unsuppApps.push(svc);
      } else {
        const meetsRecommended =
          svc.recommendedCPU <= activeMachine.cpuCores &&
          svc.recommendedRAM <= activeMachine.memoryRamGb;

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
      activeMachine,
    };
  }, [
    allBundles,
    allServices,
    selectedMachineId,
    selectedVariantId,
    customVariantCores,
    customVariantRam,
    machines,
  ]);

  if (!activeMachine) {
    return (
      <div className="text-fg-dim py-16 text-center text-sm">
        <div className="mb-4 text-4xl">_</div>
        <span className="prompt">
          Select a machine above to see recommendations
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
            machine={activeMachine}
            isExpert={isExpert}
            onBundleClick={setAppBundleModalData}
            onServiceClick={setServiceModalData}
          />
        </div>

        {/* 2. Recommended Individual Apps */}
        <div id="section-recommended" className="scroll-mt-24">
          <RecommendedAppsPanel
            apps={recommendedApps}
            isExpert={isExpert}
            onServiceClick={setServiceModalData}
          />
        </div>

        {/* 3. Barely Usable Individual Apps */}
        <div id="section-barely-usable" className="scroll-mt-24">
          <BarelyUsableAppsPanel
            apps={barelyUsableApps}
            isExpert={isExpert}
            onServiceClick={setServiceModalData}
          />
        </div>

        {/* 4. Unsupported Individual Apps */}
        <div id="section-unsupported" className="scroll-mt-24">
          <UnsupportedAppsPanel
            apps={unsupportedApps}
            isExpert={isExpert}
            onServiceClick={setServiceModalData}
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
      <ServiceModal
        service={serviceModalData}
        onClose={() => setServiceModalData(null)}
      />
      <AppBundleModal
        bundle={appBundleModalData}
        onClose={() => setAppBundleModalData(null)}
      />
    </div>
  );
}

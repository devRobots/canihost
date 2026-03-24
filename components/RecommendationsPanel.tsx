'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import ServiceModal from '@/components/ServiceModal';
import AppBundleModal from '@/components/AppBundleModal';
import AppBundlesPanel from '@/components/AppBundlesPanel';
import RecommendedAppsPanel from '@/components/RecommendedAppsPanel';
import BarelyUsableAppsPanel from '@/components/BarelyUsableAppsPanel';
import UnsupportedAppsPanel from '@/components/UnsupportedAppsPanel';
import { type Service, type AppBundle } from '@/types';

export default function RecommendationsPanel() {
  const { machines, allBundles, allServices, selectedMachineId, mode } = useAppStore();
  const [serviceModalData, setServiceModalData] = useState<Service | null>(null);
  const [appBundleModalData, setAppBundleModalData] = useState<AppBundle | null>(null);

  const isExpert = mode === 'expert';
  const machine = selectedMachineId ? machines.find(m => m.id === selectedMachineId) ?? null : null;

  const { recommendedBundles, recommendedApps, barelyUsableApps, unsupportedApps } = useMemo(() => {
    if (!machine) return { recommendedBundles: [], recommendedApps: [], barelyUsableApps: [], unsupportedApps: [] };

    // 1. Evaluate Bundles
    const maxBundles = 3;
    const recommendedBundles = allBundles.filter((bundle) => {
      let totalCpu = 0;
      let totalRam = 0;
      let cloudSafe = true;
      for (const svc of bundle.services) {
        totalCpu += svc.cpuCost;
        totalRam += svc.ramCostGb;
        if (!svc.isCloudRecommended && machine.type === 'VPS') cloudSafe = false;
      }
      return totalCpu <= machine.cpuCores && totalRam <= machine.memoryRamGb * 0.9 && cloudSafe;
    }).slice(0, maxBundles);

    // 2. Evaluate Individual Apps
    const recApps: Service[] = [];
    const barelyApps: Service[] = [];
    const unsuppApps: Service[] = [];

    for (const svc of allServices) {
      const isVpsIncompatible = (svc.isCloudRecommended === false && machine.type === 'VPS');
      const cpuFitsAtAll = svc.cpuCost <= machine.cpuCores;
      const ramFitsAtAll = svc.ramCostGb <= machine.memoryRamGb;

      if (isVpsIncompatible || !cpuFitsAtAll || !ramFitsAtAll) {
        unsuppApps.push(svc);
      } else {
        const cpuComfortable = svc.cpuCost <= (machine.cpuCores * 0.8);
        const ramComfortable = svc.ramCostGb <= (machine.memoryRamGb * 0.8);

        if (cpuComfortable && ramComfortable) {
          recApps.push(svc);
        } else {
          barelyApps.push(svc);
        }
      }
    }

    // Sort apps by RAM Cost descending
    recApps.sort((a, b) => b.ramCostGb - a.ramCostGb);
    barelyApps.sort((a, b) => b.ramCostGb - a.ramCostGb);
    unsuppApps.sort((a, b) => b.ramCostGb - a.ramCostGb);

    return { 
      recommendedBundles, 
      recommendedApps: recApps.slice(0, 12),
      barelyUsableApps: barelyApps.slice(0, 12),
      unsupportedApps: unsuppApps.slice(0, 12)
    };
  }, [allBundles, allServices, machine]);

  if (!machine) {
    return (
      <div className="text-center py-16 text-sm text-fg-dim">
        <div className="text-4xl mb-4">_</div>
        <span className="prompt">Select a machine above to see recommendations</span>
      </div>
    );
  }

  return (
    <section id="recommendations-section" className="flex flex-col gap-10">
      
      {/* 1. App Bundles Panel */}
      <AppBundlesPanel
        bundles={recommendedBundles}
        machine={machine}
        isExpert={isExpert}
        onBundleClick={setAppBundleModalData}
        onServiceClick={setServiceModalData}
      />

      {/* 2. Recommended Individual Apps */}
      <RecommendedAppsPanel
        apps={recommendedApps}
        machine={machine}
        isExpert={isExpert}
        onServiceClick={setServiceModalData}
      />

      {/* 3. Barely Usable Individual Apps */}
      <BarelyUsableAppsPanel
        apps={barelyUsableApps}
        machine={machine}
        isExpert={isExpert}
        onServiceClick={setServiceModalData}
      />

      {/* 4. Unsupported Individual Apps */}
      <UnsupportedAppsPanel
        apps={unsupportedApps}
        machine={machine}
        isExpert={isExpert}
        onServiceClick={setServiceModalData}
      />

      {/* Modals */}
      <ServiceModal service={serviceModalData} onClose={() => setServiceModalData(null)} />
      <AppBundleModal bundle={appBundleModalData} onClose={() => setAppBundleModalData(null)} />
    </section>
  );
}

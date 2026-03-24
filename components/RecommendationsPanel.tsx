'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import ServiceModal from '@/components/ServiceModal';
import AppBundleModal from '@/components/AppBundleModal';
import AppBundlesPanel from '@/components/AppBundlesPanel';
import RecommendedAppsPanel from '@/components/RecommendedAppsPanel';
import BarelyUsableAppsPanel from '@/components/BarelyUsableAppsPanel';
import UnsupportedAppsPanel from '@/components/UnsupportedAppsPanel';
import { type Service, type AppBundle, type ActiveMachine } from '@/types';

export default function RecommendationsPanel() {
  const { machines, allBundles, allServices, selectedMachineId, selectedVariantId, customVariantCores, customVariantRam, mode } = useAppStore();
  const [serviceModalData, setServiceModalData] = useState<Service | null>(null);
  const [appBundleModalData, setAppBundleModalData] = useState<AppBundle | null>(null);

  const isExpert = mode === 'expert';

  const { recommendedBundles, recommendedApps, barelyUsableApps, unsupportedApps, activeMachine } = useMemo(() => {
    const machine = selectedMachineId ? machines.find(m => m.id === selectedMachineId) ?? null : null;
    if (!machine) return { recommendedBundles: [], recommendedApps: [], barelyUsableApps: [], unsupportedApps: [], activeMachine: null };

    const selectedVariant = machine.variants.find(v => v.id === selectedVariantId) || machine.variants[0];
    const isCustom = machine.type === 'CUSTOM';
    
    const activeMachine: ActiveMachine = {
      ...machine,
      cpuCores: isCustom ? customVariantCores : (selectedVariant?.cpuCores || 0),
      memoryRamGb: isCustom ? customVariantRam : (selectedVariant?.memoryRamGb || 0),
    };

    // 1. Evaluate Bundles
    const maxBundles = 6;
    const recommendedBundles = allBundles.filter((bundle) => {
      let totalMinCpu = 0;
      let totalMinRam = 0;
      let cloudSafe = true;
      for (const svc of bundle.services) {
        totalMinCpu += svc.minCPU;
        totalMinRam += svc.minRAM;
        if (!svc.isCloudRecommended && activeMachine.type === 'VPS') cloudSafe = false;
      }
      return totalMinCpu <= activeMachine.cpuCores && totalMinRam <= activeMachine.memoryRamGb && cloudSafe;
    }).slice(0, maxBundles);

    // 2. Evaluate Individual Apps
    const recApps: Service[] = [];
    const barelyApps: Service[] = [];
    const unsuppApps: Service[] = [];

    for (const svc of allServices) {
      const isVpsIncompatible = (svc.isCloudRecommended === false && activeMachine.type === 'VPS');
      const meetsMinimums = svc.minCPU <= activeMachine.cpuCores && svc.minRAM <= activeMachine.memoryRamGb;

      if (isVpsIncompatible || !meetsMinimums) {
        unsuppApps.push(svc);
      } else {
        const meetsRecommended = svc.recommendedCPU <= activeMachine.cpuCores && svc.recommendedRAM <= activeMachine.memoryRamGb;

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
      activeMachine
    };
  }, [allBundles, allServices, selectedMachineId, selectedVariantId, customVariantCores, customVariantRam, machines]);

  if (!activeMachine) {
    return (
      <div className="text-center py-16 text-sm text-fg-dim">
        <div className="text-4xl mb-4">_</div>
        <span className="prompt">Select a machine above to see recommendations</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative w-full">
      
      {/* MAIN CONTENT */}
      <section id="recommendations-section" className="flex-1 flex flex-col gap-10 min-w-0 w-full">
        
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
            machine={activeMachine}
            isExpert={isExpert}
            onServiceClick={setServiceModalData}
          />
        </div>

        {/* 3. Barely Usable Individual Apps */}
        <div id="section-barely-usable" className="scroll-mt-24">
          <BarelyUsableAppsPanel
            apps={barelyUsableApps}
            machine={activeMachine}
            isExpert={isExpert}
            onServiceClick={setServiceModalData}
          />
        </div>

        {/* 4. Unsupported Individual Apps */}
        <div id="section-unsupported" className="scroll-mt-24">
          <UnsupportedAppsPanel
            apps={unsupportedApps}
            machine={activeMachine}
            isExpert={isExpert}
            onServiceClick={setServiceModalData}
          />
        </div>
      </section>

      {/* INDEX SIDEBAR */}
      <aside className="hidden xl:flex sticky top-24 flex-col gap-4 w-56 shrink-0 pl-6 border-l border-border/50">
        <span className="text-[10px] uppercase font-bold tracking-widest text-fg-dim">
          <span className="text-accent mr-2">{'//'}</span>
          Quick Navigation
        </span>
        <div className="flex flex-col gap-3 mt-2">
          <a href="#section-bundles" className="text-sm font-bold text-fg-muted hover:text-accent transition-colors flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-50"></span> App Bundles
          </a>
          <a href="#section-recommended" className="text-sm font-bold text-fg-muted hover:text-accent transition-colors flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-50"></span> Recommended
          </a>
          {barelyUsableApps.length > 0 && (
            <a href="#section-barely-usable" className="text-sm font-bold text-fg-muted hover:text-accent transition-colors flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-50"></span> Barely Usable
            </a>
          )}
          {unsupportedApps.length > 0 && (
            <a href="#section-unsupported" className="text-sm font-bold text-fg-muted hover:text-accent transition-colors flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-50"></span> Unsupported
            </a>
          )}
        </div>
      </aside>

      {/* Modals */}
      <ServiceModal service={serviceModalData} onClose={() => setServiceModalData(null)} />
      <AppBundleModal bundle={appBundleModalData} onClose={() => setAppBundleModalData(null)} />
    </div>
  );
}

import { Service } from '@prisma/client';
import { create } from 'zustand';
import { createJSONStorage,persist } from 'zustand/middleware';

import { type AppBundle,type Machine } from '@/types';

// ─── Types ─────────────────────────────────────────────────────────────────

type Mode = 'normal' | 'expert';

interface AppState {
  /** Global Data */
  machines: Machine[];
  allBundles: AppBundle[];
  allServices: Service[];
  setInitialData: (data: { machines: Machine[], allBundles: AppBundle[], allServices: Service[] }) => void;

  /** Custom resources overrides exclusively for the CUSTOM machine */
  customVariantCores: number;
  customVariantRam: number;
  setCustomResources: (cores: number, ram: number) => void;

  /** UI mode: normal hides technical specs, expert shows full details */
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;

  /** Currently selected machine and its specific variant */
  selectedMachineId: string | null;
  selectedVariantId: string | null;
  setSelectedMachineId: (id: string | null) => void;
  setSelectedVariantId: (id: string | null) => void;

  /** Services selected in the manual builder */
  selectedServiceIds: Set<string>;
  toggleServiceId: (id: string) => void;
  clearServices: () => void;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Global Data
      machines: [],
      allBundles: [],
      allServices: [],
      setInitialData: (data) => set((state) => {
        let machineId = state.selectedMachineId;
        let variantId = state.selectedVariantId;
        
        // Ensure machine exists
        const machineExists = data.machines.find(m => m.id === machineId);
        if (!machineExists) {
          machineId = data.machines[0]?.id || null;
          variantId = data.machines[0]?.variants[0]?.id || null;
        } else {
          // Check if variant exists in that machine
          const variantExists = machineExists.variants.find(v => v.id === variantId);
          if (!variantExists) {
            variantId = machineExists.variants[0]?.id || null;
          }
        }
        
        return {
          ...data,
          machines: data.machines,
          selectedMachineId: machineId,
          selectedVariantId: variantId,
        };
      }),

      // Custom Overrides
      customVariantCores: 4,
      customVariantRam: 8,
      setCustomResources: (cores, ram) => set({ customVariantCores: cores, customVariantRam: ram }),

      // Mode
      mode: 'normal',
      setMode: (m) => set({ mode: m }),
      toggleMode: () => set({ mode: get().mode === 'expert' ? 'normal' : 'expert' }),

      // Machine selection
      selectedMachineId: null,
      selectedVariantId: null,
      setSelectedMachineId: (id) => set((state) => {
        const machine = state.machines.find(m => m.id === id);
        return { 
          selectedMachineId: id,
          selectedVariantId: machine?.variants[0]?.id || null
        };
      }),
      setSelectedVariantId: (id) => set({ selectedVariantId: id }),

      // Service builder
      selectedServiceIds: new Set<string>(),
      toggleServiceId: (id) =>
        set((s) => {
          const next = new Set(s.selectedServiceIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { selectedServiceIds: next };
        }),
      clearServices: () => set({ selectedServiceIds: new Set<string>() }),
    }),
    {
      name: 'canihost-store',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? window.localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }),
      partialize: (state) => ({
        mode: state.mode,
        selectedMachineId: state.selectedMachineId,
        selectedVariantId: state.selectedVariantId,
        customVariantCores: state.customVariantCores,
        customVariantRam: state.customVariantRam,
        selectedServiceIds: Array.from(state.selectedServiceIds),
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<AppState>),
        selectedServiceIds: new Set(
          (persisted as { selectedServiceIds?: string[] }).selectedServiceIds ?? []
        ),
      }),
    }
  )
);

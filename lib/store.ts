import { App } from '@prisma/client';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type AppBundle, type Host } from '@/types';

// ─── Types ─────────────────────────────────────────────────────────────────

type Mode = 'normal' | 'expert';

interface AppState {
  /** Global Data */
  hosts: Host[];
  allBundles: AppBundle[];
  allApps: App[];
  setInitialData: (data: {
    hosts: Host[];
    allBundles: AppBundle[];
    allApps: App[];
  }) => void;

  /** Custom resources overrides exclusively for the CUSTOM machine */
  customVariantCores: number;
  customVariantRam: number;
  setCustomResources: (cores: number, ram: number) => void;

  /** UI mode: normal hides technical specs, expert shows full details */
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;

  /** Currently selected machine and its specific variant */
  selectedHostId: string | null;
  selectedVariantId: string | null;
  setSelectedHostId: (id: string | null) => void;
  setSelectedVariantId: (id: string | null) => void;

  /** Services selected in the manual builder */
  selectedAppIds: Set<string>;
  toggleAppId: (id: string) => void;
  clearApps: () => void;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Global Data
      hosts: [],
      allBundles: [],
      allApps: [],
      setInitialData: (data) =>
        set((state) => {
          let hostId = state.selectedHostId;
          let variantId = state.selectedVariantId;

          // Ensure machine exists
          const machineExists = data.hosts.find((m) => m.id === hostId);
          if (!machineExists) {
            hostId = data.hosts[0]?.id || null;
            variantId = data.hosts[0]?.variants[0]?.id || null;
          } else {
            // Check if variant exists in that machine
            const variantExists = machineExists.variants.find(
              (v) => v.id === variantId,
            );
            if (!variantExists) {
              variantId = machineExists.variants[0]?.id || null;
            }
          }

          return {
            ...data,
            hosts: data.hosts,
            selectedHostId: hostId,
            selectedVariantId: variantId,
          };
        }),

      // Custom Overrides
      customVariantCores: 4,
      customVariantRam: 8,
      setCustomResources: (cores, ram) =>
        set({ customVariantCores: cores, customVariantRam: ram }),

      // Mode
      mode: 'normal',
      setMode: (m) => set({ mode: m }),
      toggleMode: () =>
        set({ mode: get().mode === 'expert' ? 'normal' : 'expert' }),

      // Machine selection
      selectedHostId: null,
      selectedVariantId: null,
      setSelectedHostId: (id) =>
        set((state) => {
          const machine = state.hosts.find((m) => m.id === id);
          return {
            selectedMachineId: id,
            selectedVariantId: machine?.variants[0]?.id || null,
          };
        }),
      setSelectedVariantId: (id) => set({ selectedVariantId: id }),

      // Service builder
      selectedAppIds: new Set<string>(),
      toggleAppId: (id) =>
        set((s) => {
          const next = new Set(s.selectedAppIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { selectedAppIds: next };
        }),
      clearApps: () => set({ selectedAppIds: new Set<string>() }),
    }),
    {
      name: 'canihost-store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({
        mode: state.mode,
        selectedHostId: state.selectedHostId,
        selectedVariantId: state.selectedVariantId,
        customVariantCores: state.customVariantCores,
        customVariantRam: state.customVariantRam,
        selectedAppIds: Array.from(state.selectedAppIds),
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<AppState>),
        selectedAppIds: new Set(
          (persisted as { selectedAppIds?: string[] }).selectedAppIds ?? [],
        ),
      }),
    },
  ),
);

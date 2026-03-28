import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type ActiveHost, type Host } from '@/types';

export interface HostState {
  activeHost: ActiveHost | null;
  setActiveHost: (host: Host) => void;
  setVariant: (variantId: string | null) => void;
  setCustomResources: (cores: number, ram: number) => void;
}

export const useHostStore = create<HostState>()(
  persist(
    (set) => ({
      activeHost: null,
      setActiveHost: (host) =>
        set(() => ({
          activeHost: {
            ...host,
            cores: host.variants[0]?.cpuCores || 4,
            ram: host.variants[0]?.memoryRamGb || 8,
            selectedVariantId: host.variants[0]?.id || null,
          },
        })),
      setVariant: (id) =>
        set((state) => {
          if (!state.activeHost) return state;
          const v = state.activeHost.variants.find((v) => v.id === id);
          return {
            activeHost: {
              ...state.activeHost,
              selectedVariantId: id,
              cores: v?.cpuCores ?? state.activeHost.cores,
              ram: v?.memoryRamGb ?? state.activeHost.ram,
            },
          };
        }),
      setCustomResources: (cores, ram) =>
        set((state) => {
          if (!state.activeHost) return state;
          return {
            activeHost: {
              ...state.activeHost,
              cores,
              ram,
            },
          };
        }),
    }),
    {
      name: 'host-store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? window.localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      ),
    },
  ),
);

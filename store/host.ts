import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type Host } from '@/types';

interface HostState {
  core: number;
  ram: number;
  selectedHostId: string | null;
  selectedVariantId: string | null;
  setCustomResources: (core: number, ram: number) => void;
  setSelectedHostId: (id: string | null, hosts: Host[]) => void;
  setSelectedVariantId: (id: string | null) => void;
}

export const useHostStore = create<HostState>()(
  persist(
    (set) => ({
      core: 4,
      ram: 8,
      selectedHostId: null,
      selectedVariantId: null,
      setCustomResources: (core, ram) => set({ core, ram }),
      setSelectedHostId: (id, hosts) =>
        set(() => {
          const host = hosts.find((h) => h.id === id);
          return {
            selectedHostId: id,
            selectedVariantId: host?.variants[0]?.id || null,
          };
        }),
      setSelectedVariantId: (id) => set({ selectedVariantId: id }),
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

import { App } from '@prisma/client';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type AppBundle, type Host } from '@/types';

type Mode = 'normal' | 'expert';

// ─── DB Store ─────────────────────────────────────────────────────────────────

interface DbState {
  hosts: Host[];
  bundles: AppBundle[];
  apps: App[];
  setInitialData: (data: { hosts: Host[]; bundles: AppBundle[]; apps: App[] }) => void;
}

export const useDbStore = create<DbState>((set) => ({
  hosts: [],
  bundles: [],
  apps: [],
  setInitialData: (data) => set(data),
}));

// ─── Host Store ───────────────────────────────────────────────────────────────

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
        typeof window !== 'undefined' ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);

// ─── Mode Store ───────────────────────────────────────────────────────────────

interface ModeState {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
}

export const useModeStore = create<ModeState>()(
  persist(
    (set, get) => ({
      mode: 'normal',
      setMode: (m) => set({ mode: m }),
      toggleMode: () => set({ mode: get().mode === 'expert' ? 'normal' : 'expert' }),
    }),
    {
      name: 'mode-store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);

// ─── Builder Store ────────────────────────────────────────────────────────────

interface BuilderState {
  selectedAppIds: Set<string>;
  toggleAppId: (id: string) => void;
  clearApps: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
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
      name: 'builder-store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        selectedAppIds: Array.from(state.selectedAppIds),
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<BuilderState>),
        selectedAppIds: new Set((persisted as { selectedAppIds?: string[] })?.selectedAppIds ?? []),
      }),
    }
  )
);

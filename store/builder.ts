import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
        typeof window !== 'undefined'
          ? window.localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      ),
      partialize: (state) => ({
        selectedAppIds: Array.from(state.selectedAppIds),
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<BuilderState>),
        selectedAppIds: new Set(
          (persisted as { selectedAppIds?: string[] })?.selectedAppIds ?? [],
        ),
      }),
    },
  ),
);

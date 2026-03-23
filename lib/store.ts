import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Machine, type AppSet, type Service } from '@/types';

// ─── Types ─────────────────────────────────────────────────────────────────

type Mode = 'normal' | 'expert';

interface AppState {
  /** Global Data */
  machines: Machine[];
  allSets: AppSet[];
  allServices: Service[];
  setInitialData: (data: { machines: Machine[], allSets: AppSet[], allServices: Service[] }) => void;

  /** UI mode: normal hides technical specs, expert shows full details */
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;

  /** Currently selected machine on the home/recommendations view */
  selectedMachineId: string | null;
  setSelectedMachineId: (id: string | null) => void;

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
      allSets: [],
      allServices: [],
      setInitialData: (data) => set(data),

      // Mode
      mode: 'normal',
      setMode: (m) => set({ mode: m }),
      toggleMode: () => set({ mode: get().mode === 'expert' ? 'normal' : 'expert' }),

      // Machine selection
      selectedMachineId: null,
      setSelectedMachineId: (id) => set({ selectedMachineId: id }),

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
      // Set is not JSON-serialisable by default — convert to/from array
      partialize: (state) => ({
        mode: state.mode,
        selectedMachineId: state.selectedMachineId,
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

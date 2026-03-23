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

  /** Custom resources overrides per machine ID */
  customResources: Record<string, { cpuCores?: number; memoryRamGb?: number }>;
  updateMachineResources: (id: string, overrides: { cpuCores?: number; memoryRamGb?: number }) => void;

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
      setInitialData: (data) => set((state) => {
        const custMachines = data.machines.map(m => state.customResources[m.id] ? { ...m, ...state.customResources[m.id] } : m);
        let id = state.selectedMachineId;
        // Verify if previous ID still exists (in case of DB re-seeds)
        if (id && !custMachines.find(m => m.id === id)) {
          id = null;
        }
        
        const defaultId = id || custMachines.find(m => !['Beelink SER5', 'Intel NUC 12', 'Dell', 'Venus', 'Raspberry Pi 4', '432'].some(ex => m.name.toLowerCase().includes(ex.toLowerCase())))?.id || custMachines[0]?.id || null;
        
        return {
          ...data,
          machines: custMachines,
          selectedMachineId: defaultId,
        };
      }),

      // Custom Overrides
      customResources: {},
      updateMachineResources: (id, overrides) => set(state => {
        const newCustom = { ...state.customResources, [id]: { ...(state.customResources[id] || {}), ...overrides } };
        const newMachines = state.machines.map(m => m.id === id ? { ...m, ...overrides } : m);
        return { customResources: newCustom, machines: newMachines };
      }),

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
        customResources: state.customResources,
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

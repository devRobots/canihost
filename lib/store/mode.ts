import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Mode = 'normal' | 'expert';

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
      toggleMode: () =>
        set({ mode: get().mode === 'expert' ? 'normal' : 'expert' }),
    }),
    {
      name: 'mode-store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? window.localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      ),
    },
  ),
);

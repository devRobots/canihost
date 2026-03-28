import { App } from '@prisma/client';
import { create } from 'zustand';

import { type AppBundle, type Host } from '@/types';

interface DbState {
  hosts: Host[];
  bundles: AppBundle[];
  apps: App[];
  setInitialData: (data: {
    hosts: Host[];
    bundles: AppBundle[];
    apps: App[];
  }) => void;
}

export const useDbStore = create<DbState>((set) => ({
  hosts: [],
  bundles: [],
  apps: [],
  setInitialData: (data) => set(data),
}));

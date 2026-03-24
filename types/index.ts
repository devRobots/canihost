export type MachineVariant = {
  id: string;
  name: string;
  cpuCores: number;
  memoryRamGb: number;
  machineId: string;
};

export type Machine = {
  id: string;
  name: string;
  type: string;
  variants: MachineVariant[];
};

export type Service = {
  id: string;
  name: string;
  category: string;
  minCPU: number;
  recommendedCPU: number;
  minRAM: number;
  recommendedRAM: number;
  isCloudRecommended: boolean;
  description: string | null;
  longDescription: string | null;
  officialUrl: string | null;
  cubepathUrl: string | null;
  dockerRegistryUrl: string | null;
};

export type ActiveMachine = Machine & {
  cpuCores: number;
  memoryRamGb: number;
};

export type AppBundle = {
  id: string;
  name: string;
  description: string | null;
  services: Service[];
};

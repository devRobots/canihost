export type Machine = {
  id: string;
  name: string;
  type: string;
  brand: string | null;
  cpuCores: number;
  memoryRamGb: number;
  targetAudience: string | null;
  useCases: string | null;
  specialTech: string | null;
  technicalSpecs: string | null;
};

export type Service = {
  id: string;
  name: string;
  category: string;
  cpuCost: number;
  ramCostGb: number;
  isCloudRecommended: boolean;
  description: string | null;
  minRequirements: string | null;
  recRequirements: string | null;
};

export type AppSet = {
  id: string;
  name: string;
  description: string | null;
  services: Service[];
};

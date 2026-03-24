import { Prisma } from "@/prisma/generated/prisma/client";

export type ActiveMachine = Machine & {
  cpuCores: number;
  memoryRamGb: number;
};

export type Machine = Prisma.MachineGetPayload<{
  include: {
    variants: true;
  };
}>;

export type Service = Prisma.ServiceGetPayload<{
  include: {
    appBundles: true;
  };
}>;

export type AppBundle = Prisma.AppBundleGetPayload<{
  include: {
    services: true;
  };
}>;
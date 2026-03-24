import { Prisma } from "@prisma/client";

export type ActiveMachine = Machine & {
  cpuCores: number;
  memoryRamGb: number;
};

export type Machine = Prisma.MachineGetPayload<{
  include: {
    variants: true;
  };
}>;

export type AppBundle = Prisma.AppBundleGetPayload<{
  include: {
    services: true;
  };
}>;
import { Prisma } from '@prisma/client';

export type ActiveHost = Host & {
  cpuCores: number;
  memoryRamGb: number;
};

export type Host = Prisma.HostGetPayload<{
  include: {
    variants: true;
  };
}>;

export type AppBundle = Prisma.AppBundleGetPayload<{
  include: {
    apps: true;
  };
}>;

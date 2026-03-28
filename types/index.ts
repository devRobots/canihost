import { Prisma } from '@prisma/client';

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

export type ActiveHost = Host & {
  cores: number;
  ram: number;
  selectedVariantId: string | null;
};

export enum HostType {
  VPS = 'VPS',
  MINI_PC = 'MINI_PC',
  CUSTOM = 'CUSTOM',
}
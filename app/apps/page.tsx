import AppsGrid from '@/components/AppsGrid';
import prisma from '@/lib/prisma';

export default async function AppsPage() {
  const apps = (await prisma.app.findMany({
    orderBy: { name: 'asc' },
  })).map(app => ({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  }));

  return (
    <div className="bg-page flex min-h-screen flex-col font-mono">
      <div className="container mx-auto px-4 py-12 sm:px-8">
        <AppsGrid initialApps={apps} />
      </div>
    </div>
  );
}

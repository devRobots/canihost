const fs = require('fs');

const files = [
  'types/index.ts',
  'lib/store.ts',
  'components/StoreInitializer.tsx',
  'components/RecommendationsPanel.tsx',
  'components/AppBundleModal.tsx',
  'app/page.tsx',
  'app/builder/page.tsx',
  'prisma/seed.ts',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/AppSet/g, 'AppBundle');
  content = content.replace(/appSet/g, 'appBundle');
  content = content.replace(/AppSets/g, 'AppBundles');
  content = content.replace(/appSets/g, 'appBundles');
  content = content.replace(/allSets/g, 'allBundles');
  content = content.replace(/recommendedSets/g, 'recommendedBundles');
  content = content.replace(/maxSets/g, 'maxBundles');
  content = content.replace(/setAppSetModalData/g, 'setAppBundleModalData');
  content = content.replace(/appSetModalData/g, 'appBundleModalData');
  
  // Replace variable 'set' with 'bundle' for safe known cases
  content = content.replace(/set\.id/g, 'bundle.id');
  content = content.replace(/set\.name/g, 'bundle.name');
  content = content.replace(/set\.description/g, 'bundle.description');
  content = content.replace(/set\.services/g, 'bundle.services');
  content = content.replace(/\(set\)/g, '(bundle)');
  content = content.replace(/setAppBundleModalData\(set\)/g, 'setAppBundleModalData(bundle)');
  content = content.replace(/\{ set /g, '{ bundle ');
  content = content.replace(/set \?/g, 'bundle ?');
  content = content.replace(/set:/g, 'bundle:');
  content = content.replace(/isOpen=\{!!set\}/g, 'isOpen={!!bundle}');
  content = content.replace(/\{set && \(/g, '{bundle && (');

  fs.writeFileSync(file, content);
}
console.log('Refactoring complete.');

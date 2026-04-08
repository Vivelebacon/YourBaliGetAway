const fs = require('fs');
const content = fs.readFileSync('src/lib/villas.ts', 'utf-8');

// After parsing, add computed images property
const fixed = content.replace(
  /export const villas: Villa\[\] = \[([\s\S]*?)\]/,
  (match) => {
    // For now, just make images an empty array in the interface since it's computed from rooms
    return match;
  }
);

// Actually, let's compute images from rooms for each villa
let updated = fixed.replace(/reviewCount: (\d+),/g, (match, count) => {
  return match + '\n    images: [] as VillaImage[],';
});

fs.writeFileSync('src/lib/villas.ts', updated);
console.log('Added images arrays');

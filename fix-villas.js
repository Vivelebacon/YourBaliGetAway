const fs = require('fs');
const content = fs.readFileSync('src/lib/villas.ts', 'utf-8');

// Find each villa object and add computed images array
let fixed = content.replace(/({[\s\S]*?rooms: \[[\s\S]*?\],[\s\S]*?})/g, (match) => {
  if (!match.includes('images:') && match.includes('reviews:')) {
    // Find the position to insert images
    const insertPos = match.lastIndexOf('rooms:');
    return match.slice(0, insertPos) + 'images: [] as VillaImage[],\n    ' + match.slice(insertPos);
  }
  return match;
});

fs.writeFileSync('src/lib/villas.ts', fixed);
console.log('Fixed villas.ts');

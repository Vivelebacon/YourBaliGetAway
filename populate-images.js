const fs = require('fs');
const content = fs.readFileSync('src/lib/villas.ts', 'utf-8');

// Match each villa and compute images from its rooms
let fixed = content.replace(
  /(\{[\s\S]*?id: (\d+),[\s\S]*?)images: \[\] as VillaImage\[\],/g,
  (match, villaStart, id) => {
    // Extract rooms from this villa
    const roomsMatch = match.match(/rooms: \[([\s\S]*?)\],/);
    if (roomsMatch) {
      // Extract all image references from the rooms
      const roomsStr = roomsMatch[1];
      const imgMatches = roomsStr.match(/'\(bedroom-[^']+\.\jpg'/g) || [];
      const images = imgMatches.map(m => `'${m.slice(1, -1)}'`).join(', ');
      return villaStart + `images: [${images}],`;
    }
    return match;
  }
);

fs.writeFileSync('src/lib/villas.ts', fixed);
console.log('Populated images arrays');

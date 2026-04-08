const fs = require('fs');
let content = fs.readFileSync('src/lib/villas.ts', 'utf-8');

// Add name: author to all reviews
content = content.replace(
  /\{ author: '([^']+)', rating: (\d), text: '([^']+)' \}/g,
  "{ author: '$1', name: '$1', rating: $2, text: '$3' }"
);

fs.writeFileSync('src/lib/villas.ts', content);
console.log('Fixed reviews');

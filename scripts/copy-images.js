/**
 * copy-images.js
 * Run once before first `npm run dev`:  node scripts/copy-images.js
 *
 * Copies villa photos from the parent folder into public/images/{slug}/
 * so Next.js can serve them as static assets.
 */

const fs = require('fs')
const path = require('path')

const SOURCE_ROOT = path.resolve(__dirname, '../../')   // projects/joel-villa/
const DEST_ROOT   = path.resolve(__dirname, '../public/images')

const VILLA_MAP = {
  'bali-bliss':   'bali-bliss - Elevated Private Pool Villa',
  'bali-blue-1':  'baliblue1 - Peaceful Elevated Pool Villa',
  'bali-blue-2':  'baliblue2 - Elevated Garden Pool Villa',
  'bali-green':   'baligreen - 4-Bed Elevated Pool Villa',
  'bali-sol':     'balisol - Elevated Pool Villa w Cinema',
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath)
      }
    }
  }
}

// Ensure public/ exists
fs.mkdirSync(path.resolve(__dirname, '../public'), { recursive: true })

// Copy logo
const logoSrc  = path.join(SOURCE_ROOT, 'Logo YBG.jpeg')
const logoDest = path.resolve(__dirname, '../public/logo.jpeg')
if (fs.existsSync(logoSrc) && !fs.existsSync(logoDest)) {
  fs.copyFileSync(logoSrc, logoDest)
  console.log('✓ Copied logo')
} else if (!fs.existsSync(logoSrc)) {
  console.warn('⚠ Logo not found at:', logoSrc)
}

// Copy villa photos
for (const [slug, folderName] of Object.entries(VILLA_MAP)) {
  const src  = path.join(SOURCE_ROOT, folderName)
  const dest = path.join(DEST_ROOT, slug)
  if (!fs.existsSync(src)) {
    console.warn(`⚠ Folder not found: ${src}`)
    continue
  }
  copyDir(src, dest)
  console.log(`✓ Copied ${folderName} → public/images/${slug}/`)
}

console.log('\nDone. Run `npm run dev` to start the site.')

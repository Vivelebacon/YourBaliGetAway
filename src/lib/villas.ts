// ─────────────────────────────────────────────
// Smoobu config
// ─────────────────────────────────────────────
export const SMOOBU_ALL_ID = '1690897'

// Individual villa widget IDs — get from Smoobu:
// Booking Engine > pick villa in dropdown > "Embed in website" tab > copy ID from URL
const SMOOBU_IDS: Record<string, string | null> = {
  'bali-bliss': null,
  'bali-blue-1': null,
  'bali-blue-2': null,
  'bali-green': null,
  'bali-sol': null,
}

export function getSmoobuId(slug: string): string {
  return SMOOBU_IDS[slug] ?? SMOOBU_ALL_ID
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface VillaImage {
  // Path relative to /images/{slug}/ — exact filename with real extension
  path: string
  category: string
  label: string
}

export interface Villa {
  slug: string
  name: string
  subtitle: string
  description: string
  bedrooms: number
  bathrooms: number
  guests: number
  highlights: string[]
  // First pool/exterior image shown on homepage card
  coverImage: string
  // All gallery images in display order
  images: VillaImage[]
}

// ─────────────────────────────────────────────
// Helper — build image list from exact filenames
// ─────────────────────────────────────────────
function imgs(category: string, files: string[]): VillaImage[] {
  return files.map((f) => ({
    path: `${category}/${f}`,
    category,
    label: category,
  }))
}

// ─────────────────────────────────────────────
// Villa data — image paths match exact files in public/images/{slug}/
// ─────────────────────────────────────────────
export const villas: Villa[] = [
  {
    slug: 'bali-bliss',
    name: 'Bali Bliss',
    subtitle: 'Elevated Private Pool Villa',
    description:
      'Nestled above the Bali landscape, Bali Bliss offers a serene retreat with a private infinity pool, two elegantly appointed bedrooms, and sweeping views across the tropical gardens. Perfect for couples or small families seeking privacy and luxury.',
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    highlights: ['Private Pool', 'Jungle View', 'Full Kitchen', 'Dining Area'],
    coverImage: 'Pool/Pool_01.jpg',
    images: [
      ...imgs('Exterior', ['Exterior_01.jpg']),
      ...imgs('Pool', ['Pool_01.jpg','Pool_02.jpg','Pool_03.jpeg','Pool_04.jpeg','Pool_05.jpeg','Pool_06.jpeg','Pool_07.jpeg','Pool_08.jpeg','Pool_09.jpeg']),
      ...imgs('Bedroom 1', ['Bedroom 1_01.jpeg','Bedroom 1_02.jpg','Bedroom 1_03.jpeg','Bedroom 1_04.jpg','Bedroom 1_05.jpeg','Bedroom 1_06.jpeg','Bedroom 1_07.jpeg']),
      ...imgs('Bedroom 2', ['Bedroom 2_01.jpeg','Bedroom 2_02.jpeg','Bedroom 2_03.jpeg']),
      ...imgs('Living Room', ['Living Room_01.jpeg','Living Room_02.jpg','Living Room_03.jpeg','Living Room_04.jpeg','Living Room_05.jpeg','Living Room_06.jpeg']),
      ...imgs('Kitchen', ['Kitchen_01.jpeg','Kitchen_02.jpeg']),
      ...imgs('Dining Area', ['Dining Area_01.jpg','Dining Area_02.jpeg','Dining Area_03.jpg']),
      ...imgs('Bathroom 1', ['Bathroom 1_01.jpg','Bathroom 1_02.jpeg','Bathroom 1_03.jpg']),
      ...imgs('Bathroom 2', ['Bathroom 2_01.jpeg','Bathroom 2_02.jpeg','Bathroom 2_03.jpeg']),
    ],
  },
  {
    slug: 'bali-blue-1',
    name: 'Bali Blue 1',
    subtitle: 'Peaceful Elevated Pool Villa',
    description:
      'Bali Blue 1 is a peaceful sanctuary elevated among the trees, featuring a stunning private pool, a generous master bedroom, and a relaxed open-plan living area. Ideal for couples or small groups looking for a tranquil Bali escape.',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    highlights: ['Private Pool', 'Master Suite', 'Open Living', 'Dining Area'],
    coverImage: 'Pool/Pool_01.jpeg',
    images: [
      ...imgs('Exterior', ['Exterior_02.jpeg','Exterior_03.jpeg','Exterior_04.jpeg']),
      ...imgs('Pool', ['Pool_01.jpeg','Pool_02.jpeg','Pool_03.jpeg','Pool_04.jpeg','Pool_05.jpeg','Pool_06.jpeg','Pool_07.jpeg','Pool_08.jpeg','Pool_09.jpeg','Pool_10.jpeg','Pool_11.jpeg','Pool_12.jpeg']),
      ...imgs('Bedroom 1 (Master)', ['Bedroom 1 (Master)_01.jpeg','Bedroom 1 (Master)_02.jpeg','Bedroom 1 (Master)_03.jpeg']),
      ...imgs('Bedroom', ['Bedroom_01.jpeg','Bedroom_02.jpeg','Bedroom_03.jpeg','Bedroom_04.jpeg']),
      ...imgs('Living Room', ['Living Room_01.jpeg','Living Room_02.jpeg','Living Room_03.jpeg','Living Room_04.jpeg']),
      ...imgs('Kitchen', ['Kitchen_01.jpeg','Kitchen_02.jpeg','Kitchen_03.jpeg','Kitchen_04.jpeg','Kitchen_05.jpeg','Kitchen_06.jpeg','Kitchen_07.jpeg']),
      ...imgs('Dining Area', ['Dining Area_01.jpeg','Dining Area_02.jpeg']),
      ...imgs('Bathroom', ['Bathroom_01.jpeg','Bathroom_02.jpeg','Bathroom_03.jpeg','Bathroom_04.jpeg','Bathroom_05.jpeg','Bathroom_06.jpeg','Bathroom_07.jpeg']),
    ],
  },
  {
    slug: 'bali-blue-2',
    name: 'Bali Blue 2',
    subtitle: 'Elevated Garden Pool Villa',
    description:
      'Intimate and charming, Bali Blue 2 is a garden retreat with a private pool surrounded by lush tropical greenery. A cozy haven for couples wanting a quiet Bali getaway with a personal touch.',
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    highlights: ['Private Pool', 'Garden View', 'Cozy & Intimate'],
    coverImage: 'Pool/Pool_01.jpeg',
    images: [
      ...imgs('Exterior', ['Exterior_01.jpeg','Exterior_02.png']),
      ...imgs('Pool', ['Pool_01.jpeg']),
      ...imgs('Bedroom', ['Bedroom_01.jpeg','Bedroom_02.jpeg']),
      ...imgs('Living Room', ['Living Room_01.jpg']),
    ],
  },
  {
    slug: 'bali-green',
    name: 'Bali Green',
    subtitle: '4-Bedroom Elevated Pool Villa',
    description:
      'Spacious and lush, Bali Green is the ideal choice for larger groups and families. Four beautifully designed bedrooms, a sweeping private pool, manicured garden, and a full kitchen — everything you need for the perfect Bali family holiday.',
    bedrooms: 4,
    bathrooms: 2,
    guests: 8,
    highlights: ['4 Bedrooms', 'Private Pool', 'Large Garden', 'Full Kitchen'],
    coverImage: 'Pool/Pool_01.jpeg',
    images: [
      ...imgs('Exterior', ['Exterior_01.jpeg','Exterior_02.jpeg']),
      ...imgs('Pool', ['Pool_01.jpeg']),
      ...imgs('Garden', ['Garden_01.jpeg','Garden_02.jpeg']),
      ...imgs('Bedroom', ['Bedroom_01.jpeg','Bedroom_02.jpeg','Bedroom_03.jpeg','Bedroom_04.jpeg','Bedroom_05.jpeg','Bedroom_06.jpeg','Bedroom_07.jpeg','Bedroom_08.jpeg','Bedroom_09.jpeg','Bedroom_10.jpeg','Bedroom_11.jpeg','Bedroom_12.jpeg','Bedroom_13.jpeg']),
      ...imgs('Living Room', ['Living Room_01.jpeg','Living Room_02.jpeg','Living Room_03.jpeg','Living Room_04.jpeg']),
      ...imgs('Kitchen', ['Kitchen_01.jpeg','Kitchen_02.jpeg','Kitchen_03.jpeg','Kitchen_04.jpeg','Kitchen_05.jpeg']),
      ...imgs('Bathroom', ['Bathroom_01.jpeg','Bathroom_02.jpeg','Bathroom_03.jpeg','Bathroom_04.jpeg','Bathroom_05.jpeg','Bathroom_06.jpeg','Bathroom_07.jpeg','Bathroom_08.jpeg']),
    ],
  },
  {
    slug: 'bali-sol',
    name: 'Bali Sol',
    subtitle: 'Elevated Pool Villa with Cinema',
    description:
      'Bali Sol is the crown jewel of the collection — a luxury villa with a private cinema, games room, bar, lush garden, and an expansive pool. Two opulent bedrooms, two bathrooms, and a full entertainment suite make this the ultimate villa experience in Bali.',
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    highlights: ['Private Cinema', 'Games Room', 'Private Bar', 'Infinity Pool', 'Garden'],
    coverImage: 'Pool/Pool_01.jpeg',
    images: [
      ...imgs('Exterior', ['Exterior_01.png','Exterior_02.jpeg','Exterior_03.jpeg','Exterior_04.jpeg','Exterior_05.jpeg','Exterior_06.jpeg']),
      ...imgs('Pool', ['Pool_01.jpeg','Pool_02.jpeg','Pool_03.jpeg','Pool_04.jpeg','Pool_05.jpeg','Pool_06.jpeg']),
      ...imgs('Cinema', ['Cinema_01.jpeg','Cinema_02.jpeg','Cinema_03.png','Cinema_04.jpeg']),
      ...imgs('Bar', ['Bar_01.jpeg']),
      ...imgs('Games', ['Games_01.jpeg','Games_02.jpeg','Games_03.jpeg']),
      ...imgs('Bedroom 1', ['Bedroom 1_01.jpeg','Bedroom 1_02.jpeg','Bedroom 1_03.jpeg','Bedroom 1_04.jpeg','Bedroom 1_05.jpeg','Bedroom 1_06.jpeg','Bedroom 1_07.jpeg']),
      ...imgs('Bedroom 2', ['Bedroom 2_01.jpeg','Bedroom 2_02.jpeg','Bedroom 2_03.jpeg','Bedroom 2_04.jpeg','Bedroom 2_05.jpeg','Bedroom 2_06.jpeg','Bedroom 2_07.jpeg','Bedroom 2_08.jpeg','Bedroom 2_09.jpeg','Bedroom 2_10.jpeg','Bedroom 2_11.jpeg','Bedroom 2_12.jpeg']),
      ...imgs('Living Room', ['Living Room_01.jpeg','Living Room_02.jpeg','Living Room_03.jpeg','Living Room_04.jpeg']),
      ...imgs('Kitchen', ['Kitchen_01.jpeg','Kitchen_02.jpeg','Kitchen_03.jpeg','Kitchen_04.jpeg','Kitchen_05.jpeg']),
      ...imgs('Dining Area', ['Dining Area_01.jpeg','Dining Area_02.jpeg','Dining Area_03.jpeg','Dining Area_04.jpeg','Dining Area_05.jpeg','Dining Area_06.jpeg']),
      ...imgs('Bathroom 1', ['Bathroom 1_01.jpeg','Bathroom 1_02.jpeg']),
      ...imgs('Bathroom 2', ['Bathroom 2_01.jpeg','Bathroom 2_02.jpeg','Bathroom 2_03.jpeg','Bathroom 2_04.jpeg']),
      ...imgs('Garden', ['Garden_01.jpeg']),
    ],
  },
]

export function getVilla(slug: string): Villa | undefined {
  return villas.find((v) => v.slug === slug)
}

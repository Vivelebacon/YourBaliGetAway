// Auto-generated from build-villas-from-downloads.js
// Generated: 2026-04-07T11:22:55.415Z

export interface Villa {
  id: number
  name: string
  slug: string
  subtitle: string
  rating: number
  reviewCount: number
  bedrooms: number
  bathrooms: number
  guests: number
  highlights: string[]
  description: string
  coverImage: string
  amenities: string[]
  reviews: VillaReview[]
  rooms: VillaRoom[]
  images?: string[]
}

export interface VillaReview {
  author: string
  rating: number
  text: string
}

export interface VillaRoom {
  name: string
  images: VillaImage[]
}

export interface VillaImage {
  url: string
  caption: string
}

function imgs(name: string, images: string[], captions: string[]): VillaRoom {
  return {
    name,
    images: images.map((url, i) => ({
      url,
      caption: captions[i] || '',
    })),
  }
}

export const villas: Villa[] = [
  {
    id: 1,
    name: 'Bali Bliss',
    slug: 'bali-bliss',
    subtitle: 'Serenity and Paradise',
    rating: 4.95,
    reviewCount: 128,
    bedrooms: 2,
    bathrooms: 2,
    guests: 6,
    highlights: ['Pool', 'WiFi', 'Garden'],
    description: 'Experience pure luxury with our serene 2-bedroom villa featuring private pool, lush gardens, and modern amenities.',
    coverImage: 'bedroom-1_01.jpg',
    amenities: ['Private Pool', 'WiFi', 'Air Conditioning', 'Smart TV', 'Kitchen', 'Garden'],
    reviews: [
      { author: 'Sarah M.', rating: 5, text: 'Absolutely breathtaking villa with impeccable service!' },
      { author: 'John D.', rating: 5, text: 'Best vacation we could have asked for.' },
    ],
    rooms: [
      imgs('Bedroom 1', ['bedroom-1_01.jpg'], ['This serene bedroom features a king-sized bed, a 43" smart TV with streaming and cable, blackout curtains for restful sleep, and an ensuite bathroom. Floor-to-ceiling glass doors open to the lush garden and private pool.']),
      imgs('Bedroom 2', ['bedroom-2_01.jpg'], ['After a long day enjoying Bali\'s beaches or relaxing by our pool, this room is your perfect retreat for a restful night\'s sleep. It features a king-size bed, TV, luggage space, air conditioning, and windows opening to the pool and garden.']),
    ],
  },
  {
    id: 2,
    name: 'Bali Blue 1',
    slug: 'bali-blue-1',
    subtitle: 'Tropical Elegance',
    rating: 4.92,
    reviewCount: 156,
    bedrooms: 2,
    bathrooms: 2,
    guests: 6,
    highlights: ['Pool', 'WiFi', 'Lounge'],
    description: 'Stunning 2-bedroom villa with direct pool access, spacious design, and elegant décor.',
    coverImage: 'bedroom-1_01.jpg',
    amenities: ['Private Pool', 'WiFi', 'Air Conditioning', 'Smart TV', 'Safe', 'Pool Lounge'],
    reviews: [
      { author: 'Emma L.', rating: 5, text: 'Beautiful property with direct pool access!' },
      { author: 'Mark T.', rating: 5, text: 'Exceeded all expectations.' },
    ],
    rooms: [
      imgs('Bedroom 1', ['bedroom-1_01.jpg', 'bedroom-1_02.jpg', 'bedroom-1_03.jpg', 'bedroom-1_04.jpg', 'bedroom-1_05.jpg', 'bedroom-1_06.jpg'], ['Relax in this beautifully designed bedroom featuring a king-size bed, air conditioning, and a spacious wardrobe with a safe for your valuables. You\'ll also have direct access to the pool lounge. The en-suite bathroom offers added comfort and privacy.', 'Relax in this beautifully designed bedroom featuring a king-size bed, air conditioning, and a spacious wardrobe with a safe for your valuables. You\'ll also have direct access to the pool lounge. The en-suite bathroom offers added comfort and privacy.', 'Relax in this beautifully designed bedroom featuring a king-size bed, air conditioning, and a spacious wardrobe with a safe for your valuables. You\'ll also have direct access to the pool lounge. The en-suite bathroom offers added comfort and privacy.', 'Relax in this beautifully designed bedroom featuring a king-size bed, air conditioning, and a spacious wardrobe with a safe for your valuables. You\'ll also have direct access to the pool lounge. The en-suite bathroom offers added comfort and privacy.', 'Relax in this beautifully designed bedroom featuring a king-size bed, air conditioning, and a spacious wardrobe with a safe for your valuables. You\'ll also have direct access to the pool lounge. The en-suite bathroom offers added comfort and privacy.', 'Relax in this beautifully designed bedroom featuring a king-size bed, air conditioning, and a spacious wardrobe with a safe for your valuables. You\'ll also have direct access to the pool lounge. The en-suite bathroom offers added comfort and privacy.']),
      imgs('Bedroom 2', ['bedroom-2_01.jpg'], ['This inviting bedroom features air conditioning, a TV, and a wardrobe. Enjoy decorative mood lighting, while direct access to the en-suite bathroom ensures convenience.']),
    ],
  },
  {
    id: 3,
    name: 'Bali Blue 2',
    slug: 'bali-blue-2',
    subtitle: 'Modern Luxury',
    rating: 4.88,
    reviewCount: 112,
    bedrooms: 2,
    bathrooms: 2,
    guests: 6,
    highlights: ['Pool', 'WiFi', 'Smart TV'],
    description: 'Contemporary 2-bedroom villa with smart amenities, stunning pool views, and premium finishes.',
    coverImage: 'bedroom-1_01.jpg',
    amenities: ['Private Pool', 'WiFi', 'Smart TV', 'Workspace', 'Air Conditioning', 'Rain Shower'],
    reviews: [
      { author: 'Lisa K.', rating: 5, text: 'Modern, clean, and wonderfully appointed!' },
      { author: 'David R.', rating: 4, text: 'Great location and beautiful views.' },
    ],
    rooms: [
      imgs('Bedroom 1', ['bedroom-1_01.jpg'], ['Beautifully appointed bedroom with a king-size bed, state-of-the-art air conditioning, 43" Smart TV, direct pool access, and an ensuite bathroom featuring a luxurious rain shower. Includes a wardrobe with safe for your peace of mind.']),
      imgs('Bedroom 2', ['bedroom-2_01.jpg'], ['Spacious bedroom featuring a king-size bed, Smart TV with Netflix and cable, blackout curtains for restful sleep, dedicated workspace with desk, full-length mirror, and doors that open to the pool and garden. The ensuite bathroom provides complete privacy and comfort.']),
    ],
  },
  {
    id: 4,
    name: 'Bali Green',
    slug: 'bali-green',
    subtitle: 'Spacious Paradise',
    rating: 4.96,
    reviewCount: 203,
    bedrooms: 4,
    bathrooms: 4,
    guests: 10,
    highlights: ['Pool', 'WiFi', 'Master Suite'],
    description: 'Grand 4-bedroom villa perfect for families or groups, with multiple living spaces and pool.',
    coverImage: 'bedroom-1_01.jpg',
    amenities: ['Large Pool', 'WiFi', 'Master Suite', '4 Bathrooms', 'Kitchen', 'Multiple Living Areas'],
    reviews: [
      { author: 'Patricia M.', rating: 5, text: 'Perfect for our family gathering!' },
      { author: 'Robert B.', rating: 5, text: 'Spacious and well-equipped.' },
    ],
    rooms: [
      imgs('Bedroom 1', ['bedroom-1_01.jpg'], ['Master bedroom with queen-size bed, 43" smart TV with cable and streaming, air conditioning, pool view, and ensuite bathroom featuring a luxurious Terasso stone bathtub for the ultimate relaxation.']),
      imgs('Bedroom 2', ['bedroom-2_01.jpg'], ['Queen-size bedroom with air conditioning, 43" smart TV, direct access to private patio, and ensuite bathroom for convenience and privacy.']),
      imgs('Bedroom 3', ['bedroom-3_01.jpg'], ['Queen-size bedroom with air conditioning, 43" smart TV, and ensuite bathroom. Perfect for additional guests.']),
      imgs('Bedroom 4', ['bedroom-4_01.jpg'], ['Queen-size bedroom with air conditioning, 43" smart TV, and ensuite bathroom. Ideal for families or groups.']),
    ],
  },
  {
    id: 5,
    name: 'Bali Sol',
    slug: 'bali-sol',
    subtitle: 'Sunny Getaway',
    rating: 4.91,
    reviewCount: 89,
    bedrooms: 2,
    bathrooms: 2,
    guests: 5,
    highlights: ['Pool', 'WiFi', 'Sofa Bed'],
    description: 'Bright and welcoming 2-bedroom villa with sofa bed option and excellent natural light.',
    coverImage: 'bedroom-1_01.jpg',
    amenities: ['Private Pool', 'WiFi', 'Smart TV', 'Sofa Bed', 'Air Conditioning', 'Workspace'],
    reviews: [
      { author: 'Nicole H.', rating: 5, text: 'Lovely bright villa with perfect poolside atmosphere!' },
      { author: 'James W.', rating: 4, text: 'Great value and wonderful hosts.' },
    ],
    rooms: [
      imgs('Bedroom 1', ['bedroom-1_01.jpg'], ['Spacious 35 m² bedroom with 1.5 AC, king-size bed, blackout curtains, Smart TV with streaming, safe, iron and board, and dedicated workspace. Sliding doors open to the pool and garden, with access to the ensuite bathroom for comfort and convenience']),
      imgs('Bedroom 2', ['bedroom-2_01.jpg'], ['Bedroom 2 in a 1–2 person setup, featuring a king-size bed, smart TV, blackout curtains, and direct access to the poolside terrace—ideal for couples or solo travelers who enjoy extra space and comfort']),
    ],
  },
]

export function getVilla(slug: string): Villa | undefined {
  return villas.find((v) => v.slug === slug)
}

export function getSmoobuId(slug: string): string | null {
  const smoobuIds: { [key: string]: string } = {
    'bali-bliss': process.env.NEXT_PUBLIC_SMOOBU_PROPERTY_BALI_BLISS || '',
    'bali-blue-1': process.env.NEXT_PUBLIC_SMOOBU_PROPERTY_BALI_BLUE_1 || '',
    'bali-blue-2': process.env.NEXT_PUBLIC_SMOOBU_PROPERTY_BALI_BLUE_2 || '',
    'bali-green': process.env.NEXT_PUBLIC_SMOOBU_PROPERTY_BALI_GREEN || '',
    'bali-sol': process.env.NEXT_PUBLIC_SMOOBU_PROPERTY_BALI_SOL || '',
  }
  return smoobuIds[slug] || null
}

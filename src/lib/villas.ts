// ─────────────────────────────────────────────
// Smoobu config
// ─────────────────────────────────────────────
export const SMOOBU_GROUP_ID = '1690897'

const SMOOBU_IDS: Record<string, string> = {
  'bali-bliss': '3241317',
  'bali-blue-1': '3241322',
  'bali-blue-2': '3241327',
  'bali-green': '3241332',
  'bali-sol': '3241337',
}

// Returns the per-villa apartment ID (used to build the widget URL)
export function getSmoobuId(slug: string): string {
  return SMOOBU_IDS[slug] ?? ''
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface VillaImage {
  path: string
  category: string
  label: string
}

export interface VillaReview {
  name: string
  text: string
}

export interface Villa {
  slug: string
  name: string
  subtitle: string
  description: string
  bedrooms: number
  bathrooms: number
  guests: number
  rating: number
  reviewCount: number
  highlights: string[]
  amenities: string[]
  reviews: VillaReview[]
  coverImage: string
  images: VillaImage[]
}

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────
function imgs(category: string, files: string[]): VillaImage[] {
  return files.map((f) => ({ path: `${category}/${f}`, category, label: category }))
}

// ─────────────────────────────────────────────
// Villa data — sourced from Airbnb listings
// ─────────────────────────────────────────────
export const villas: Villa[] = [
  {
    slug: 'bali-bliss',
    name: 'Bali Bliss',
    subtitle: 'Elevated Private Pool Villa',
    rating: 4.96,
    reviewCount: 68,
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    highlights: ['Private Pool', 'Swing Chair', 'Smart TV', 'Seminyak'],
    amenities: ['Private Pool (2.7×7m)', 'High-speed WiFi (150 Mbps)', 'Air Conditioning', 'Smart TV (50")', 'Bluetooth Speaker', 'Fully Equipped Kitchen', 'Sun Deck & Loungers', 'Hanging Swing Chair', 'Free Parking', 'Laundry Service', 'Daily Housekeeping', 'Airport Transfer'],
    description: `Welcome to Bali Bliss, a charming two-bedroom luxury villa nestled in the prime location of Seminyak. Just a short stroll from the vibrant Kayu Ayu ('Eat Street') and the bustling nightlife hotspots like La Favela, Mexicola and Ku De Ta, this villa also offers proximity to restaurants, spas, shopping, and the beautiful beach.

The villa features two poolside bedrooms, each with a 43-inch Smart TV, king-size beds, ensuite bathrooms, and full air conditioning. The lounge overlooks the pool with a 50-inch Smart TV and Bluetooth speaker. Outside, a sun deck with loungers and a large hanging swing chair surround the 2.7×7m garden pool.

The fully equipped kitchen includes a 4-person island bar, stove, fridge-freezer, microwave, coffee maker, and blender. Staff assist with errands, dining reservations, transport, and tours. Located 5 minutes walk from Kayu Aya, 10 minutes from Seminyak Beach, and 20 minutes from the airport.`,
    reviews: [
      { name: 'Lily', text: 'Oasis! This villa makes me want to stay and not leave. The temperature of the pool is perfect, clean and private. Love the swing and day bed to read and nap. Everything was spotless and well stocked. The host, Dewa, was highly responsive and communicative.' },
      { name: 'Stacie', text: 'Absolutely loved our stay at this beautiful villa. Amazing location, walking distance to lots of nice restaurants and bars. The hosts were incredible, so helpful and kind. The villa felt like home soon as we walked in, very private, clean and tidy.' },
      { name: 'David', text: 'It exceeded expectations. The location is close to the Main Street, there\'s a Circle K around the corner and the pictures look great but when you get to the villa it is even more impressive. Dewa is a friendly and helpful man who made everything easy.' },
      { name: 'Since', text: 'Everything was clean, comfortable, and exactly as described. The villa had such a relaxing vibe and felt like the perfect getaway. Joel was a great host, and special thanks to his co-host, Dewa.' },
      { name: 'Ericka', text: 'Very amazing place, very clean, very friendly and very helpful hosts. We regretted checking in late because the villa was very comfortable.' },
    ],
    coverImage: 'Pool/Pool_06.jpeg',
    images: [
      ...imgs('Pool', ['Pool_06.jpeg','Pool_05.jpeg','Pool_01.jpg','Pool_02.jpg','Pool_07.jpeg','Pool_08.jpeg','Pool_03.jpeg','Pool_04.jpeg','Pool_09.jpeg']),
      ...imgs('Exterior', ['Exterior_01.jpg']),
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
    rating: 4.95,
    reviewCount: 145,
    bedrooms: 2,
    bathrooms: 2,
    guests: 5,
    highlights: ['Private Pool', 'Master Suite', 'Eat Street', 'Seminyak'],
    amenities: ['Private Outdoor Pool (all year)', 'WiFi', 'Air Conditioning', 'TV', 'Fully Equipped Kitchen', 'Bathtub', 'Beach Access', 'Free Parking', 'Daily Housekeeping'],
    description: `Welcome to Bali Blue, a spacious two-bedroom luxury villa providing a serene atmosphere in Seminyak's prime location. Situated just a short stroll away from Kayu Ayu, popularly known as 'Eat Street,' and vibrant nightlife spots like La Favela, Mexicola, and Ku De Ta, as well as an array of restaurants, spas, shopping options, and the beautiful beach.

Conveniently located near Sunset Road, the villa offers easy access to the airport and the rest of the island. Bali Blue features a generous master bedroom suite, a private pool available year-round, and a warm, welcoming atmosphere managed by villa manager Dewa — consistently praised by guests for his attentiveness and care.

This well-appointed villa will undoubtedly leave you wanting more.`,
    reviews: [
      { name: 'Peita', text: 'From the moment we arrived, we felt completely looked after. Dewa was an absolute standout as villa manager, his communication was exceptional throughout our stay.' },
      { name: 'Char', text: 'This was my second stay at the villa, and it was just as amazing as the first! The villa is spotless, spacious, and beautifully maintained.' },
      { name: 'Ruby', text: 'Wonderful villa in a top spot with quite a large pool. Very clean and well presented.' },
      { name: 'Mohamed', text: 'My wife and I stayed for 5 days in Villa Bali Blue. Villa was as described in photos, clean, private and close to restaurants and beaches.' },
      { name: 'Nur Syahira', text: 'Thank you to Pak Dewa who waited for me until 2am to show me the villa because my flight was delayed. Very responsive and friendly host.' },
    ],
    coverImage: 'Pool/Pool_05.jpeg',
    images: [
      ...imgs('Pool', ['Pool_05.jpeg','Pool_02.jpeg','Pool_01.jpeg','Pool_04.jpeg','Pool_09.jpeg','Pool_07.jpeg','Pool_06.jpeg','Pool_10.jpeg','Pool_11.jpeg','Pool_12.jpeg','Pool_08.jpeg','Pool_03.jpeg']),
      ...imgs('Exterior', ['Exterior_02.jpeg','Exterior_03.jpeg','Exterior_04.jpeg']),
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
    rating: 4.95,
    reviewCount: 152,
    bedrooms: 2,
    bathrooms: 2,
    guests: 5,
    highlights: ['Private Pool', 'Tropical Garden', 'High-speed WiFi', 'Seminyak'],
    amenities: ['Private Pool', 'High-speed WiFi (150 Mbps)', 'Air Conditioning', 'Smart TV', 'Bluetooth Sound System', 'Fully Equipped Kitchen', 'Lush Tropical Garden', 'Outdoor Shower', 'Free Parking', 'Free Airport Pickup (14+ nights)'],
    description: `Bali Blue II is a spacious two-bedroom luxury villa offering privacy, comfort, and an unbeatable location in Seminyak. Nestled on Gang Kahyangan, it's a short walk to Kayu Aya ('Eat Street'), famous for its restaurants, bars, and shopping, and just minutes from Seminyak Beach, Ku De Ta, and top beach clubs like Potato Head.

With modern amenities, stylish decor, and thoughtful details — including a lush tropical garden, outdoor shower, and Bluetooth sound system — this villa is perfect for couples, families, or small groups looking for a private retreat in the heart of Bali's best area.`,
    reviews: [
      { name: 'Mimi', text: 'This is my second visit to this beautiful Villa. I love that everything is in walking distance and the host couldn\'t be more helpful arranging things for me and picking me up from the airport. Always attentive and happy.' },
      { name: 'Trevor', text: 'A lovely comfortable villa in a very private location but a few minutes walk from bustling Seminyak. A special mention for Dewa who was delightful and very helpful and arranged a driver for us for a great day out.' },
      { name: 'Sally', text: 'We loved the location, perfect next to the Circle K, Coffee shop and Laundry! Dewa was also so great as a host, and arranged a pool fence and cot for our infant.' },
      { name: 'Vikram', text: 'The host was very responsive and supportive throughout our stay. Any minor issues were resolved promptly.' },
      { name: 'Pratheesh', text: 'Our stay was excellent thanks to the proactive and responsive host whose communication and empathy was top notch.' },
    ],
    coverImage: 'Exterior/Exterior_01.jpeg',
    images: [
      ...imgs('Exterior', ['Exterior_01.jpeg']),
      ...imgs('Pool', ['Pool_01.jpeg']),
      ...imgs('Bedroom', ['Bedroom_01.jpeg','Bedroom_02.jpeg']),
      ...imgs('Living Room', ['Living Room_01.jpg']),
      ...imgs('Exterior', ['Exterior_02.png']),
    ],
  },
  {
    slug: 'bali-green',
    name: 'Bali Green',
    subtitle: '4-Bedroom Elevated Pool Villa',
    rating: 4.94,
    reviewCount: 148,
    bedrooms: 4,
    bathrooms: 4,
    guests: 8,
    highlights: ['4 Bedrooms', '4×8m Pool', 'Pets Welcome', 'Near Double Six Beach'],
    amenities: ['Private Pool (4×8m green stone)', 'WiFi', 'Air Conditioning (5 units)', '65-inch Smart TV', 'Smart TVs in all bedrooms', 'Fully Equipped Kitchen', 'Dedicated Workspace', 'Pets Allowed', 'Free Parking (2 spaces)', 'Beach Access', 'Daily Housekeeping'],
    description: `Bali Green features a stunning 4×8 meter green-stone pool surrounded by lush Balinese flora, providing a peaceful escape in the heart of Seminyak. With four spacious air-conditioned bedrooms each equipped with Smart TVs, this villa is the ideal choice for larger groups and families.

Two bedrooms have ensuite bathrooms, with additional shared bathrooms available. The grand living area overlooks the garden and pool, featuring a 65-inch Smart TV. A fully equipped kitchen and dedicated workspace complete the home. Pets are welcome.

Located near Double Six Beach and Seminyak's best dining and nightlife, Bali Green combines space, comfort, and prime location for an unforgettable Bali stay.`,
    reviews: [
      { name: 'Thomas', text: 'We stayed for the second time in this villa, once again amazed by the level of care and responsiveness from both Joel and Mr Dewa.' },
      { name: 'Mitchell', text: 'Joel is a lovely host and Dewa is an extremely friendly villa manager, helpful, knowledgeable and all requests were granted with no fuss.' },
      { name: 'Madeline', text: 'Joel, Dewa and house keepers, pool boy (ketut) and breakfast chefs at this villa were amazing!!' },
      { name: 'Yvonne', text: 'Joel\'s Villa was nice and quiet with beautiful gardens and in a great location, very easy to get around.' },
      { name: 'Jasmin', text: 'We had a great stay! Bali Green was clean, comfortable, and exactly as described.' },
    ],
    coverImage: 'Pool/Pool_01.jpeg',
    images: [
      ...imgs('Pool', ['Pool_01.jpeg']),
      ...imgs('Garden', ['Garden_01.jpeg','Garden_02.jpeg']),
      ...imgs('Exterior', ['Exterior_01.jpeg','Exterior_02.jpeg']),
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
    rating: 5.0,
    reviewCount: 16,
    bedrooms: 2,
    bathrooms: 2,
    guests: 6,
    highlights: ['Private Cinema', 'Games Room', 'Private Bar', 'Infinity Pool'],
    amenities: ['Private Pool', 'Home Cinema (projector + 83" screen)', 'High-speed WiFi (450 Mbps)', '43-inch Smart TVs', 'Air Conditioning', 'Washer', 'Fully Equipped Kitchen', 'Private Bar', 'Games Room', 'Private Backyard (fully fenced)', 'Dedicated Workspace', 'Optional Breakfast', 'Car & Motorbike Rentals', 'Private Tours on Request'],
    description: `Bali Sol is a spacious pool villa in the heart of Seminyak, bigger than most 2-bedroom villas in the area. It was initially our own home, designed and furnished with comfort, relaxation, and quality time in mind — making it suitable for short and long stays, for rain or shine, for couples, friends, and family.

One of the standout features is its private home cinema with a projector and 83-inch screen, perfect for cozy movie nights after a day out. The villa also features a private bar, games room, and a fully fenced backyard with a private pool. High-speed WiFi up to 450 Mbps, all leading OTT platforms, and optional breakfast service make this a true home away from home.

The villa combines modern design with thoughtful extras, creating the perfect getaway for those who want luxury without compromise.`,
    reviews: [
      { name: 'Pranjal', text: 'Never saw an Airbnb as well maintained as Joel\'s. Exceptionally well equipped kitchen. The home theatre is an added advantage with availability of all leading OTT platforms.' },
      { name: 'Hedwig', text: 'Loved our stay!! Bali Sol, right in the center of Seminyak, felt like a true home away from home. Bigger than expected, beautifully kept.' },
      { name: 'Christopher', text: 'Joel\'s villa was a fantastic place for my little family to stay. In the heart of Seminyak but far enough to feel away from the hustle and bustle. His villa manager, Dewa, was super helpful, friendly and offered great advice. Highly recommend.' },
      { name: 'Monica', text: 'We had a wonderful stay at this villa. The place is beautiful, spacious, and very well maintained. The design is lovely and comfortable. Overall, it was such a relaxing and pleasant experience.' },
      { name: 'Umesh', text: 'Joel and his team are great. Lots of food joints at walking distance. Overall great place, great host.' },
    ],
    coverImage: 'Living Room/Living Room_02.jpeg',
    images: [
      ...imgs('Living Room', ['Living Room_02.jpeg','Living Room_01.jpeg','Living Room_03.jpeg']),
      ...imgs('Pool', ['Pool_01.jpeg','Pool_05.jpeg','Pool_06.jpeg','Pool_02.jpeg','Pool_03.jpeg','Pool_04.jpeg']),
      ...imgs('Exterior', ['Exterior_01.png','Exterior_02.jpeg','Exterior_03.jpeg','Exterior_04.jpeg','Exterior_06.jpeg']),
      ...imgs('Cinema', ['Cinema_01.jpeg','Cinema_02.jpeg','Cinema_03.png','Cinema_04.jpeg']),
      ...imgs('Bar', ['Bar_02.jpeg']),
      ...imgs('Games', ['Games_03.jpeg']),
      ...imgs('Bedroom 1', ['Bedroom 1_01.jpeg','Bedroom 1_02.jpeg','Bedroom 1_03.jpeg','Bedroom 1_05.jpeg','Bedroom 1_06.jpeg','Bedroom 1_07.jpeg','Bedroom 1_08.jpeg']),
      ...imgs('Bedroom 2', ['Bedroom 2_01.jpeg','Bedroom 2_02.jpeg','Bedroom 2_03.jpeg','Bedroom 2_05.jpeg','Bedroom 2_07.jpeg','Bedroom 2_09.jpeg','Bedroom 2_10.jpeg','Bedroom 2_11.jpeg','Bedroom 2_12.jpeg']),
      ...imgs('Kitchen', ['Kitchen_01.jpeg','Kitchen_02.jpeg','Kitchen_03.jpeg','Kitchen_04.jpeg','Kitchen_05.jpeg']),
      ...imgs('Dining Area', ['Dining Area_01.jpeg','Dining Area_02.jpeg','Dining Area_03.jpeg','Dining Area_04.jpeg','Dining Area_05.jpeg','Dining Area_06.jpeg']),
      ...imgs('Bathroom 1', ['Bathroom 1_01.jpeg','Bathroom 1_02.jpeg']),
      ...imgs('Bathroom 2', ['Bathroom 2_01.jpeg','Bathroom 2_02.jpeg','Bathroom 2_03.jpeg','Bathroom 2_04.jpeg']),
    ],
  },
]

export function getVilla(slug: string): Villa | undefined {
  return villas.find((v) => v.slug === slug)
}

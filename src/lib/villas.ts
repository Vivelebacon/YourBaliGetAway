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
  caption?: string
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
function imgs(category: string, files: string[], captions: string[] = []): VillaImage[] {
  return files.map((f, i) => ({
    path: `${category}/${f}`,
    category,
    label: category,
    ...(captions[i] ? { caption: captions[i] } : {}),
  }))
}

// ─────────────────────────────────────────────
// Villa data — sourced from Airbnb listings
// Generated: 2026-04-08T12:03:22.934Z
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
      { name: 'Lily', text: `Oasis! This villa makes me want to stay and not leave. The temperature of the pool is perfect, clean and private. Love the swing and day bed to read and nap. Everything was spotless and well stocked. The host, Dewa, was highly responsive and communicative.` },
      { name: 'Stacie', text: `Absolutely loved our stay at this beautiful villa. Amazing location, walking distance to lots of nice restaurants and bars. The hosts were incredible, so helpful and kind. The villa felt like home soon as we walked in, very private, clean and tidy.` },
      { name: 'David', text: `It exceeded expectations. The location is close to the Main Street, there's a Circle K around the corner and the pictures look great but when you get to the villa it is even more impressive. Dewa is a friendly and helpful man who made everything easy.` },
      { name: 'Since', text: `Everything was clean, comfortable, and exactly as described. The villa had such a relaxing vibe and felt like the perfect getaway. Joel was a great host, and special thanks to his co-host, Dewa.` },
      { name: 'Ericka', text: `Very amazing place, very clean, very friendly and very helpful hosts. We regretted checking in late because the villa was very comfortable.` }
    ],
    coverImage: 'Living Room/Living Room_01.jpg',
    images: [
      ...imgs('Overview', ['Overview_01.jpg','Overview_02.jpg','Overview_03.jpg','Overview_04.jpg','Overview_05.jpg']),
      ...imgs('Living Room', ['Living Room_01.jpg','Living Room_02.jpg','Living Room_03.jpg','Living Room_04.jpg','Living Room_05.jpg','Living Room_06.jpg','Living Room_07.jpg','Living Room_08.jpg','Living Room_09.jpg','Living Room_10.jpg','Living Room_11.jpg','Living Room_12.jpg','Living Room_13.jpg','Living Room_14.jpg'], [
        'Bright open-plan living and dining area by the pool, with sofa and new bright blue cushions, wooden dining table and stools, compact kitchen, ceiling fan, and Smart TV. Large curtains bring in natural light and provide shade and privacy.',
        'Kitchen island bar with 4 tall chairs for shared meals',
        'Spacious and fully-equipped kitchen, with island bar (seats 4) and direct views of living room and pool area',
        'This serene bedroom features a king-sized bed, a 43" smart TV with streaming and cable, blackout curtains for restful sleep, and an ensuite bathroom. Floor-to-ceiling glass doors open to the lush garden and private pool.',
        'After a long day enjoying Bali’s beaches or relaxing by our pool, this room is your perfect retreat for a restful night’s sleep. It features a king-size bed, TV, luggage space, air conditioning, and windows opening to the pool and garden.',
        'This ensuite bathroom to Bedroom 1 combines lighting and practicality, featuring a rain shower, toilet with rinse hose, and modern sink with mirror. Natural light streams through the ceiling window and glass wall.',
        'Attached to Bedroom 2, this ensuite offers a sleek shower, rinse-hose toilet, and modern sink with a large mirror. Light streams in from the ceiling and side window, creating an airy feel, while plants add a refreshing touch to this functional space.',
        'The villa is in a quiet alleyway of which a large page is accessible only to residents and guests, ensuring privacy and security. The entrance features a sturdy Balinese-style wooden door, while lush greenery lines the peaceful, well-paved path.',
        'Enjoy a stunning view of the pool area right from the exterior front door, with the convenience of a private garage and parking space just to the left, offering easy access and a seamless arrival experience.',
        'Dive into your private pool, accessible from the living room and bedrooms. Unwind on the outdoor daybed, perfect for relaxing under the Balinese sky, or lounge in the comfortable chairs. A serene space to recharge and create unforgettable memories.',
        'Convenient parking for one vehicle and multiple motorbikes right in front of the villa, ensuring easy access and a hassle-free stay.',
        'Full view of the open living and kitchen area from the pool, with wide sliding curtains that can be closed for privacy or opened to connect indoor and outdoor spaces. A seamless flow between poolside and living area for a comfortable, easy stay',
        'Open living/kitchen area with direct pool access, featuring a comfortable sofa, Smart TV, and fully equipped kitchen with bar seating. A practical, well designed space to relax, dine, or spend time indoors while staying connected to the villa outside',
        'Open living and kitchen area with direct pool access, allowing you to relax on the sofa, dine at the bar, or watch TV while enjoying views of the pool and lush garden. A bright, comfortable space that keeps you connected to the outdoors at all times',
      ]),
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
      { name: 'Peita', text: `From the moment we arrived, we felt completely looked after. Dewa was an absolute standout as villa manager, his communication was exceptional throughout our stay.` },
      { name: 'Char', text: `This was my second stay at the villa, and it was just as amazing as the first! The villa is spotless, spacious, and beautifully maintained.` },
      { name: 'Ruby', text: `Wonderful villa in a top spot with quite a large pool. Very clean and well presented.` },
      { name: 'Mohamed', text: `My wife and I stayed for 5 days in Villa Bali Blue. Villa was as described in photos, clean, private and close to restaurants and beaches.` },
      { name: 'Nur Syahira', text: `Thank you to Pak Dewa who waited for me until 2am to show me the villa because my flight was delayed. Very responsive and friendly host.` }
    ],
    coverImage: 'Where You’Ll Sleep/Where You’Ll Sleep_01.jpg',
    images: [
      ...imgs('Overview', ['Overview_01.jpg','Overview_02.jpg','Overview_03.jpg','Overview_04.jpg','Overview_05.jpg']),
      ...imgs('Where You’Ll Sleep', ['Where You’Ll Sleep_01.jpg'], [
        'Relax in this beautifully designed bedroom featuring a king-size bed, air conditioning, and a spacious wardrobe with a safe for your valuables. You’ll also have direct access to the pool lounge. The en-suite bathroom offers added comfort and privacy.',
      ]),
      ...imgs('Living Room', ['Living Room_01.jpg','Living Room_02.jpg','Living Room_03.jpg','Living Room_04.jpg','Living Room_05.jpg','Living Room_06.jpg','Living Room_07.jpg','Living Room_08.jpg','Living Room_09.jpg','Living Room_10.jpg','Living Room_11.jpg'], [
        'Our kitchen is a bright, open space.\nPerfect for preparing fresh breakfasts or delicious meals while enjoying quality time with family, friends, or your partner.',
        'Our dining area is an open-concept space seamlessly connected to the kitchen and living room, creating a natural flow that encourages connection and shared moments.',
        'Enjoy a practical and comfortable shower experience, perfect for freshening up quickly so you can keep exploring Bali and relaxing in our beautiful spaces.',
        'Entrance: Welcome to Bali Blue!',
        'Welcome to Bali Blue! A private villa in the heart of Seminyak where you can relax by the paradise-like pool and soak up Bali’s vibrant energy while enjoying comfort, privacy, and everything this magical island has to offer.',
        'Additional photos image 1',
        'This spacious living room has cozy sofas, cushions, and a coffee table. Enjoy pool views, a smart TV, and a Bluetooth speaker. Floor-to-ceiling curtains offer privacy and keep the space peaceful and bug-free.',
        'Lounge and kitchen: two comfortable couches with cushions and footrests, a glass-top table with four comfortable chairs, a TV with Bluetooth speaker system, a 150 Mbps Wi-Fi connection, and floor-to-ceiling curtains to keep bugs out at night.',
        'The lounge and kitchen feature cozy sofas with cushions and footrests, a glass dining table with four chairs, a smart TV with Bluetooth speaker, 150 Mbps Wi-Fi, and floor-to-ceiling curtains for privacy and protection from bugs.',
        'Our living room is designed to make you feel at home while enjoying the beauty of Bali in a fresh and private atmosphere. Whether sipping coffee or unwinding after a day exploring the island, you’ll find the perfect spot to recharge and feel at ease',
        'Our living room is designed to make you feel at home while enjoying the beauty of Bali in a fresh, and private atmosphere. Whether sipping coffee or unwinding after a day exploring the island, you’ll find the perfect spot to recharge and feel at ease',
      ]),
      ...imgs('Full Kitchen', ['Full Kitchen_01.jpg','Full Kitchen_02.jpg'], [
        'Fully equipped kitchen with island bar, large fridge-freezer, electric kettle, water dispenser (hot and cold), microwave, cutlery, dishes, cups, pots, pans, etc.',
        'Feels like home! Kitchen featuring a sleek island bar and all the essentials for cooking, including a large fridge-freezer, electric kettle, water dispenser (hot & cold), and microwave. Complete with cutlery, dishes, cups, and pots.',
      ]),
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
      { name: 'Mimi', text: `This is my second visit to this beautiful Villa. I love that everything is in walking distance and the host couldn't be more helpful arranging things for me and picking me up from the airport. Always attentive and happy.` },
      { name: 'Trevor', text: `A lovely comfortable villa in a very private location but a few minutes walk from bustling Seminyak. A special mention for Dewa who was delightful and very helpful and arranged a driver for us for a great day out.` },
      { name: 'Sally', text: `We loved the location, perfect next to the Circle K, Coffee shop and Laundry! Dewa was also so great as a host, and arranged a pool fence and cot for our infant.` },
      { name: 'Vikram', text: `The host was very responsive and supportive throughout our stay. Any minor issues were resolved promptly.` },
      { name: 'Pratheesh', text: `Our stay was excellent thanks to the proactive and responsive host whose communication and empathy was top notch.` }
    ],
    coverImage: 'Where You’Ll Sleep/Where You’Ll Sleep_01.jpg',
    images: [
      ...imgs('Overview', ['Overview_01.jpg','Overview_02.jpg','Overview_03.jpg','Overview_04.jpg','Overview_05.jpg']),
      ...imgs('Where You’Ll Sleep', ['Where You’Ll Sleep_01.jpg','Where You’Ll Sleep_02.jpg'], [
        'Relax in this beautiful bedroom featuring a king-size bed, air conditioning, and a  43-inch Smart TV. Also, you\'ll have direct access to the pool lounge, which is perfect for unwinding by the water. The en-suite bathroom offers comfort and privacy.',
        'This serene bedroom opens to the pool and lush garden, featuring a Smart TV with Netflix, blackout curtains, a workspace with a desk, and a full-length mirror. The king bed ensures comfort, making it perfect for both relaxation and entertainment.',
      ]),
      ...imgs('Living Room', ['Living Room_01.jpg','Living Room_02.jpg','Living Room_03.jpg','Living Room_04.jpg','Living Room_05.jpg','Living Room_06.jpg','Living Room_07.jpg','Living Room_08.jpg','Living Room_09.jpg'], [
        'This kitchen has everything you need, including an island bar for dining or socializing. It features a large fridge-freezer, microwave, electric kettle, hot and cold water dispenser, and all essentials like cutlery, dishes, cups, pots, and pans.',
        'This spacious dining area seamlessly connects with the kitchen, creating an open, airy atmosphere. The generous layout offers a sense of freshness and freedom, making it the perfect space to share meals and enjoy quality time together.',
        'This en-suite bathroom to Bedroom 1 features a refreshing shower with a ceiling window, allowing natural light to fill the space. It includes a sleek sink with a large mirror and a practical ladder-shaped drying rack for added convenience.',
        'This en-suite bathroom to Bedroom 2 features an integrated shower, a sleek sink with a large mirror enhances the space, while a ladder-shaped towel-drying rack adds comfort and functionality.',
        'Welcome to Bali Blue II, a serene villa in Seminyak where every detail matters. Enjoy a unique experience, whether relaxing by the pool surrounded by greenery or sharing music with loved ones in the cozy living room.',
        'This villa blends indoor and outdoor living with lush greenery, cascading vines, and a sparkling pool. Floor-to-ceiling curtains connect the open-plan kitchen and lounge to the deck, creating a seamless, airy retreat surrounded by tropical beauty.',
        'Our cable TV lineup brings worldwide entertainment to your screen, with international news, movies, and kids\' programming from across the globe. Whether you’re catching up on world events or unwinding with a film, there’s something for everyone.',
        'This bright and airy living space is filled with natural light throughout the day, creating a warm and inviting atmosphere. Enjoy the magnificent pool view and lush green surroundings, offering a peaceful and relaxing ambiance perfect for unwinding.',
        'This vibrant living space blends comfort and personality with bold artwork, cozy seating, and natural wood accents. A spacious lounge area invites you to relax, while colorful decor adds a modern, artistic touch to your tropical retreat.',
      ]),
      ...imgs('Full Kitchen', ['Full Kitchen_01.jpg'], [
        'This fully equipped kitchen features a gas stove, range hood, coffee maker, and sink, all set against warm wooden cabinetry. With ample storage and counter space, it\'s perfect for preparing meals or enjoying a fresh cup of coffee in a cozy setting.',
      ]),
      ...imgs('Dining Area', ['Dining Area_01.jpg','Dining Area_02.jpg','Dining Area_03.jpg','Dining Area_04.jpg'], [
        'This dining space features a sleek glass-top table with 4 plush chairs, offering a cozy and stylish spot for your meals. With a stunning pool view and the added smart TV and Bluetooth speaker, it’s the ideal setting for dining or relaxing.',
        'Relax in this vibrant and cozy poolside kitchen, dining, and living area, offering lovely garden views. Enjoy music and entertainment on the smart TV with a Bluetooth speaker, or unwind in the dining area while taking in the serene pool view.',
        'This open-plan dining area blends seamlessly with the lush outdoors, offering a fresh and airy ambiance. Surrounded by greenery, warm wood tones, and natural light, it’s a bright, welcoming space where meals feel connected to nature.',
        'This bright and stylish poolside dining area features a glass-top table and rich wooden chairs, accented by vibrant decor and lush greenery.',
      ]),
      ...imgs('Bedroom 1', ['Bedroom 1_01.jpg'], [
        'This stylish bedroom at Bali Blue II balances modern comfort with a touch of vibrant character. Featuring a plush king bed, air conditioning, ample storage, and a bright pop of color from the sofa, it’s a cozy retreat for a restful night',
      ]),
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
      { name: 'Thomas', text: `We stayed for the second time in this villa, once again amazed by the level of care and responsiveness from both Joel and Mr Dewa.` },
      { name: 'Mitchell', text: `Joel is a lovely host and Dewa is an extremely friendly villa manager, helpful, knowledgeable and all requests were granted with no fuss.` },
      { name: 'Madeline', text: `Joel, Dewa and house keepers, pool boy (ketut) and breakfast chefs at this villa were amazing!!` },
      { name: 'Yvonne', text: `Joel's Villa was nice and quiet with beautiful gardens and in a great location, very easy to get around.` },
      { name: 'Jasmin', text: `We had a great stay! Bali Green was clean, comfortable, and exactly as described.` }
    ],
    coverImage: 'Where You’Ll Sleep/Where You’Ll Sleep_01.jpg',
    images: [
      ...imgs('Overview', ['Overview_01.jpg','Overview_02.jpg','Overview_03.jpg','Overview_04.jpg','Overview_05.jpg']),
      ...imgs('Where You’Ll Sleep', ['Where You’Ll Sleep_01.jpg','Where You’Ll Sleep_02.jpg','Where You’Ll Sleep_03.jpg'], [
        'With direct access to a private patio, Bedroom 2 offers air-conditioning, a queen bed, and a 43-inch smart TV. The serene design is complemented by an ensuite bathroom for ultimate convenience and relaxation.',
        'Bedroom 3',
        'Bedroom 4',
      ]),
      ...imgs('Living Room', ['Living Room_01.jpg','Living Room_02.jpg','Living Room_03.jpg','Living Room_04.jpg','Living Room_05.jpg','Living Room_06.jpg','Living Room_07.jpg','Living Room_08.jpg','Living Room_09.jpg','Living Room_10.jpg'], [
        'The kitchen features a microwave, rice cooker, blender, toaster, and a dual-burner stove. It’s fully equipped to handle all your cooking needs. The spacious counters and sink add functionality, making meal prep simple and enjoyable.',
        'Dining area',
        'Bathroom 1 offers a bathtub, a large mirror, and modern fixtures, with a touch of greenery for a serene feel. The window invites natural light, while the green tile flooring adds charm to this ensuite retreat.',
        'This ensuite bathroom offers a relaxing bathtub, a carved mirror above a modern sink, and charming green tile floors. The decor is complemented by natural light and plants, creating a tranquil and refreshing retreat.',
        'This ensuite bathroom includes a bathtub, shower, and modern amenities. Green tile floors, lush greenery, and a large window bring natural light and a tranquil, tropical vibe to the space. ',
        'Nestled at the end of a lush garden corridor, this bathroom offers a rain shower, a carved mirror above a sleek sink, and bamboo accents. Green tile flooring and plant decor bring a refreshing tropical touch to this functional and stylish space.',
        'Relax on vibrant orange bean bags while enjoying views of the lush garden, hibiscus flowers, manicured lawn, and a pool surrounded by greenery. A perfect spot for outdoor relaxation.',
        'The illuminated entrance to The Bali Green invites you into a tranquil retreat. Framed by lush greenery, the warm lighting and intricate details set the tone for a serene tropical experience.',
        'Additional photos image 1',
        'Living room image 2',
      ]),
      ...imgs('Full Kitchen', ['Full Kitchen_01.jpg'], [
        'Full-length kitchen',
      ]),
      ...imgs('Dining Area', ['Dining Area_01.jpg','Dining Area_02.jpg'], [
        'The kitchen island serves as a dining area and a convenient workspace with ample power outlets. Its curved design, stylish stools, and lush greenery make it perfect for meals, morning coffee, or working comfortably in a tropical setting. ',
        'Dining area',
      ]),
      ...imgs('Bedroom 1', ['Bedroom 1_01.jpg','Bedroom 1_02.jpg','Bedroom 1_03.jpg','Bedroom 1_04.jpg'], [
        'A serene pool view brightens the room with natural light. Enjoy air conditioning, a 43-inch smart TV with streaming, and comfortable furnishings, including bedside tables and a bench. A perfect blend of relaxation and modern convenience. ',
        'The spacious bedroom includes a dedicated work area with a desk, chair, and power outlets. A large wardrobe provides ample storage, while the ensuite bathroom ensures privacy and convenience, making it a perfect space for work and relaxation.',
        'Bedroom 1 image 5',
        'The bedroom features a pool view, air conditioning, and a smart TV with streaming. Two bedside tables with lamps, a wooden footboard bench, and neutral decor add warmth and style, creating a cozy yet elegant environment for rest.',
      ]),
    ],
  },
  {
    slug: 'bali-sol',
    name: 'Bali Sol',
    subtitle: 'Elevated Pool Villa with Cinema',
    rating: 5,
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
      { name: 'Pranjal', text: `Never saw an Airbnb as well maintained as Joel's. Exceptionally well equipped kitchen. The home theatre is an added advantage with availability of all leading OTT platforms.` },
      { name: 'Hedwig', text: `Loved our stay!! Bali Sol, right in the center of Seminyak, felt like a true home away from home. Bigger than expected, beautifully kept.` },
      { name: 'Christopher', text: `Joel's villa was a fantastic place for my little family to stay. In the heart of Seminyak but far enough to feel away from the hustle and bustle. His villa manager, Dewa, was super helpful, friendly and offered great advice. Highly recommend.` },
      { name: 'Monica', text: `We had a wonderful stay at this villa. The place is beautiful, spacious, and very well maintained. The design is lovely and comfortable. Overall, it was such a relaxing and pleasant experience.` },
      { name: 'Umesh', text: `Joel and his team are great. Lots of food joints at walking distance. Overall great place, great host.` }
    ],
    coverImage: 'Where You’Ll Sleep/Where You’Ll Sleep_01.jpg',
    images: [
      ...imgs('Overview', ['Overview_01.jpg','Overview_02.jpg','Overview_03.jpg','Overview_04.jpg','Overview_05.jpg']),
      ...imgs('Where You’Ll Sleep', ['Where You’Ll Sleep_01.jpg','Where You’Ll Sleep_02.jpg'], [
        'Spacious 35 m² bedroom with 1.5 AC, king-size bed, blackout curtains, Smart TV with streaming, safe, iron and board, and dedicated workspace. Sliding doors open to the pool and garden, with access to the ensuite bathroom for comfort and convenience',
        'Bedroom 2 in a 1–2 person setup, featuring a king-size bed, smart TV, blackout curtains, and direct access to the poolside terrace—ideal for couples or solo travelers who enjoy extra space and comfort',
      ]),
      ...imgs('Living Room', ['Living Room_01.jpg','Living Room_02.jpg','Living Room_03.jpg','Living Room_04.jpg','Living Room_05.jpg','Living Room_06.jpg','Living Room_07.jpg','Living Room_08.jpg','Living Room_09.jpg','Living Room_10.jpg','Living Room_11.jpg','Living Room_12.jpg','Living Room_13.jpg','Living Room_14.jpg','Living Room_15.jpg','Living Room_16.jpg','Living Room_17.jpg'], [
        'Fully equipped open-plan kitchen with fridge, stove, microwave, rice cooker, blender, airfryer. Seamlessly connected to a real bar with hanging shelves, glassware, and 4 tall stools, creating the perfect social hub for meals, drinks, and conversation',
        'Dining room at the heart of the villa with a six-person glass-top table, palm-carved chairs, decorative mirrors, and a curvy ceiling fan—connecting bar, kitchen, living area, and pool with light, style, and views of every corner',
        'Bathroom 1 ensuite to Bedroom 1, featuring a rain shower, skylight, teak vanity, stone accents, tropical greenery, and full WC setup with stainless steel fixtures',
        'Bathroom 2 ensuite to Bedroom 2, featuring a rain shower, skylight, teak vanity, stone flooring, tropical plants, and WC with stainless steel fixtures',
        'Convenient guest bathroom located beside the pool area, featuring a toilet, sink, and direct access to the outdoor shower — perfect for rinsing off after a swim',
        'Step through the entrance into a lush, flowery garden that opens up to full views of the villa—your first taste of tropical tranquility',
        'Laundry area with washing machine, plenty of hangers, and covered drying space—so you can hang clothes straight into the wardrobe, no folding or ironing needed',
        'Well-lit, plant-lined exterior with ample space for a standard sized car and several motorbikes/scooters. Features a rolling gate and a code lockbox, so villa guests can easily share keys and avoid ever being locked out',
        'A sparkling 7m x 3m pool framed by lush greenery and bright loungers, creating the villa’s perfect centerpiece for both relaxation and social time',
        'Spacious living room with two large sofas, four footrests, cinema-red blackout curtains, dartboard, and garden views. Flexible for lounging, games, or cinema nights, with sofa armrest trays and wheel-based tables keeping drinks and snacks close',
        'From the living room, enjoy seamless connection to every part of the villa—pool and garden, dining area, bar, kitchen, and bedrooms—all within view for the ultimate shared Bali experience.',
        'Sink into the oversized 1m-deep, 2.5m-wide sofas with four footrests—perfect for lounging with friends by day or stretching out in full comfort during home cinema nights',
        'Bright and spacious living room with deep lounge sofas, four footrests, and built-in drink platforms on the armrests. The space flows naturally into the dining area and bar, making it the perfect social hub of the villa',
        'Home cinema with retractable screen and projector set in the heart of the villa (Important note: best used at night or with the blackout curtains drawn). The perfect blend of entertainment and open tropical living',
        'Enjoy the big-screen experience day or night — the full blackout curtains ensure perfect viewing conditions, while the high-power ceiling fan and additional movable fans keep the cinema cool and comfortable for up to 9 people',
        'With spacious sofas, oversized bean bags, and 4 cushioned footrests, the cinema comfortably fits up to 9 people — the perfect setup for group movie marathons or a laid-back gaming session on the big screen',
        'Everything is simple to control: the retractable screen, Epson projector, Xiaomi smart TV for Netflix & YouTube, and the Sony surround sound system — all at your fingertips with dedicated remotes',
      ]),
    ],
  },
]

export function getVilla(slug: string): Villa | undefined {
  return villas.find((v) => v.slug === slug)
}

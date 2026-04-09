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
      ...imgs('Pool', ['Pool_06.jpeg','Pool_05.jpeg','Pool_01.jpg','Pool_02.jpg','Pool_07.jpeg','Pool_08.jpeg','Pool_03.jpeg','Pool_04.jpeg','Pool_09.jpeg'], [
        'Private 2BR villa with pool, open living area and garden. Lounge by the water, relax in the shaded seating area, and enjoy a clean, modern space in a central Seminyak location, just minutes from Eat Street and the beach.',
        'Hanging swing chair set in the lush garden, offering a comfortable spot to relax with pool views. Fits up to two people and features waterproof cushions, so you can enjoy it anytime without worrying about rain or moisture, day or night.',
        'Pool view framed by lush tropical greenery, leading to the shaded daybed at the end. A perfect connection between water, garden, and relaxation space, offering a calm and private setting.',
        'Poolside daybed with waterproof mattress and cushions, offering a very comfortable spot to relax with garden and villa views. Curtains can be drawn for added privacy, making it ideal for lounging, reading, or unwinding at any time of day.',
        'Sun loungers at the end of the pool, surrounded by lush tropical greenery. Relax in the shade or enjoy the sun, with a hanging swing chair tucked into the garden corner for a quiet, private spot to unwind.',
        'View from the daybed across the full villa. Bedroom 1 on the left, open living and kitchen area beside it, and the pool leading to sun loungers and a hanging swing chair, surrounded by lush tropical greenery.',
        'View from the pool toward the entrance, with sun loungers and the hanging swing chair framed by a lush green garden wall. Minimal visible walls create a private, tropical setting that gives the villa its distinctive, calm and immersive atmosphere.',
      ]),
      ...imgs('Exterior', ['Exterior_01.jpg']),
      ...imgs('Bedroom 1', ['Bedroom 1_01.jpeg','Bedroom 1_02.jpg','Bedroom 1_03.jpeg','Bedroom 1_04.jpg','Bedroom 1_05.jpeg','Bedroom 1_06.jpeg','Bedroom 1_07.jpeg'], [
        'This serene bedroom features a king-sized bed, a 43" smart TV with streaming and cable, blackout curtains for restful sleep, and an ensuite bathroom. Floor-to-ceiling glass doors open to the lush garden and private pool.',
        'This bright and airy bedroom is filled with natural light, with floor-to-ceiling glass doors that open to the lush garden and pool. Blackout curtains ensure restful sleep, while the ensuite bathroom adds privacy and convenience.',
        'Relax in a serene space designed for comfort, featuring a plush king-size bed, air conditioning, and a 43-inch Smart TV with Netflix. With a private ensuite bathroom and pool access, this bedroom offers tranquility and practicality.',
        'The bedroom offers convenient power outlets and a 43-inch Smart TV with Netflix and other streaming services as well as cable, ensuring comfort and entertainment during your stay.',
        'This cozy bedroom is designed for ultimate nighttime comfort, featuring fully blackout curtains for restful sleep. A 43" smart TV with streaming and cable adds entertainment, while warm wooden accents create a relaxing ambiance.',
        'Bedroom 1 features en suite access to Bathroom 1, with a comfortable bed, bedside tables, and hanging lamps. Adjustable ceiling lighting sets the ambiance, with a clean modern design and warm wooden accents for a restful stay.',
        'Bedroom 1 featuring a comfortable bed, workspace, wardrobe, and smart TV. Enjoy up to 12 premium streaming services. Clean modern design with warm wooden accents.',
      ]),
      ...imgs('Bedroom 2', ['Bedroom 2_01.jpeg','Bedroom 2_02.jpeg','Bedroom 2_03.jpeg'], [
        'Bedroom 2 with en suite bathroom, comfortable bed, workspace, wardrobe, and TV. Enjoy up to 12 premium streaming services. Clean modern design with warm wooden accents for a restful stay.',
        'After a long day enjoying Bali\'s beaches or relaxing by our pool, this room is your perfect retreat. It features a king-size bed, TV, luggage space, air conditioning, and windows opening to the pool and garden.',
      ]),
      ...imgs('Living Room', ['Living Room_01.jpeg','Living Room_02.jpg','Living Room_03.jpeg','Living Room_04.jpeg','Living Room_05.jpeg','Living Room_06.jpeg'], [
        'Enjoy a relaxed dining experience in this open-plan space, where the fully equipped kitchen meets the cozy living area. The island bar offers a perfect spot for casual meals, while natural light and pool views create a welcoming atmosphere.',
        'Full view of the open living and kitchen area from the pool, with wide sliding curtains that can be closed for privacy or opened to connect indoor and outdoor spaces. A seamless flow between poolside and living area for a comfortable, easy stay.',
        'Open living/kitchen area with direct pool access, featuring a comfortable sofa, Smart TV, and fully equipped kitchen with bar seating. A practical, well designed space to relax, dine, or spend time indoors while staying connected to the villa outside.',
        'Open living and kitchen area with direct pool access, allowing you to relax on the sofa, dine at the bar, or watch TV while enjoying views of the pool and lush garden. A bright, comfortable space that keeps you connected to the outdoors at all times.',
      ]),
      ...imgs('Kitchen', ['Kitchen_01.jpeg','Kitchen_02.jpeg'], [
        'Cook and dine in style in this fully equipped kitchen, designed for convenience and enjoyment. The layout flows into the living area, creating a perfect spot for meals and conversations. With pool views and an island bar, it\'s the heart of the villa.',
        'Fully-stocked kitchen cupboards with pots, pans, cutlery, plates, glasses etc.',
      ]),
      ...imgs('Dining Area', ['Dining Area_01.jpg','Dining Area_02.jpeg','Dining Area_03.jpg']),
      ...imgs('Bathroom 1', ['Bathroom 1_01.jpg','Bathroom 1_02.jpeg','Bathroom 1_03.jpg'], [
        'This bright ensuite bathroom features a walk-in rain shower, a skylight for natural light, and a sleek vanity with a vessel sink. Thoughtful touches like plush towels and tropical décor create a refreshing, spa-like ambiance.',
        'This elegant ensuite bathroom features a walk-in rain shower, a skylight that fills the space with natural light, and a sleek marble vanity with a vessel sink. Tropical plants and wooden accents give it a serene spa-like feel.',
        'Walk-in rain shower in Bathroom 1, en suite to Bedroom 1, with natural light from above, clean modern finishes, and a simple tropical touch. A bright, refreshing space designed for comfort and ease of use.',
      ]),
      ...imgs('Bathroom 2', ['Bathroom 2_01.jpeg','Bathroom 2_02.jpeg','Bathroom 2_03.jpeg'], [
        'Bathroom 2, en suite to Bedroom 2, featuring a clean, modern design with walk-in shower, vanity with sink, and natural light from the frosted window. A bright and practical space with all essentials for a comfortable and refreshing stay.',
        'Bathroom 2, en suite to Bedroom 2, featuring a spacious walk-in rain shower with natural light from above, clean modern finishes, and a simple tropical touch. A bright, comfortable space designed for a refreshing and relaxing experience.',
      ]),
      ...imgs('Nearby Attractions', ['Nearby Attractions_01.jpeg','Nearby Attractions_02.jpeg','Nearby Attractions_03.jpeg','Nearby Attractions_04.jpeg','Nearby Attractions_05.jpeg','Nearby Attractions_06.jpeg'], [
        'Seminyak Beach is just a 10-min walk from the villa, with friendly waves perfect for beginner and intermediate surfers. Affordable surf schools like Bali Green Surf and Santai Surf offer lessons to help you catch your first wave.',
        'The luxurious, tropical Potato Head Beach Club is just 5 minutes by motorbike! Lounge by the infinity pool, sip on creative cocktails, and soak up the vibrant atmosphere with world-class dining, beachfront views, and iconic sunset vibes.',
        'Enjoy the renowned beach restaurant Ku De Ta, only 1km from the villa! Savor gourmet dishes and signature cocktails with breathtaking ocean views, stunning sunsets, and a vibrant yet relaxed atmosphere right on Seminyak Beach.',
        'The villa is a short walk from La Favela, a Brazilian-inspired hotspot with lush jungle decor, vintage charm, and a vibrant atmosphere. Enjoy unique dining by day and dance to eclectic beats at one of Bali\'s most famous nightlife venues.',
        'As the name suggests, Motel Mexicola is all about bold Mexican vibes. Come for the tacos, stay for the tequila, and end up dancing on tables to classic hits!',
      ]),
      ...imgs('Other', ['Other_01.jpeg']),
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
      ...imgs('Pool', ['Pool_05.jpeg','Pool_02.jpeg','Pool_01.jpeg','Pool_04.jpeg','Pool_09.jpeg','Pool_07.jpeg','Pool_06.jpeg','Pool_10.jpeg','Pool_11.jpeg','Pool_12.jpeg','Pool_08.jpeg','Pool_03.jpeg'], [
        'Welcome to Bali Blue! A private villa in the heart of Seminyak where you can relax by the paradise-like pool and soak up Bali\'s vibrant energy while enjoying comfort, privacy, and everything this magical island has to offer.',
        'No matter where you are in Bali Blue, you\'ll find a joyful, cozy, private, and bright atmosphere—perfect for refreshing days by the pool and fun-filled nights.',
        'Relax by the pool on a cozy sunbed and bask in the tropical warmth of the Balinese sun—perfect for unwinding and enjoying peaceful island vibes.',
        'Quiet nights or lively fun—whatever you choose, the magic of our pool offers the perfect spot to relax and enjoy.',
        'Traveling with your family? We provide fun pool items for your kids to play and enjoy quality time together.',
        'Bali\'s sunny days can be intense, but our spacious daybed by the pool offers the perfect shady escape—surrounded by beautiful greenery, it\'s ideal for relaxing, reading, or simply cooling down in a tropical oasis.',
        'There\'s nothing better than a refreshing shower before or after a dip in the pool—perfect for cooling off and recharging for more Bali fun.',
        'We offer a pool safety fence upon request, so you and your little ones can fully enjoy a worry-free, relaxing holiday.',
        'Enjoy the beauty of natural sunlight in our open, airy spaces—designed to help you relax, unwind, and fully embrace the Bali vibe.',
        'Bask in the sun in our sun loungers by the pool, or escape the heat and enjoy the shade in our daybed.',
        'Need a break from the Bali sun? Unwind on our cozy poolside daybed, nestled among lush greenery—the perfect shady spot to relax, read, or simply cool down and enjoy the tropical breeze.',
        'Even at night, Bali Blue offers you a cozy and welcoming stay right in the heart of Seminyak—where comfort and vibrant island energy meet for an unforgettable experience.',
      ]),
      ...imgs('Exterior', ['Exterior_02.jpeg','Exterior_03.jpeg','Exterior_04.jpeg'], [
        'Entrance: Welcome to Bali Blue!',
      ]),
      ...imgs('Bedroom 1 (Master)', ['Bedroom 1 (Master)_01.jpeg','Bedroom 1 (Master)_02.jpeg','Bedroom 1 (Master)_03.jpeg'], [
        'Relax in this beautifully designed bedroom featuring a king-size bed, air conditioning, and a spacious wardrobe with a safe for your valuables. You\'ll also have direct access to the pool lounge. The en-suite bathroom offers added comfort and privacy.',
        'This bedroom includes a king-size bed, AC, a wardrobe, and a safe. Direct access to the pool lounge invites you to enjoy the outdoor space, while the en-suite bathroom ensures ultimate convenience and privacy.',
        'Our rooms offer a fresh, private, and relaxing atmosphere. Fully equipped for your comfort, it includes an en-suite bathroom, ideal for unwinding and enjoying a restful night after a day in the pool or exploring Bali.',
      ]),
      ...imgs('Bedroom', ['Bedroom_01.jpeg','Bedroom_02.jpeg','Bedroom_03.jpeg','Bedroom_04.jpeg'], [
        'This inviting bedroom features air conditioning, a TV, and a wardrobe. Enjoy decorative mood lighting, while direct access to the en-suite bathroom ensures convenience. Step outside to the poolside gazebo bed or take a dip in the pool.',
        'Relax in this charming bedroom with AC, a TV, and a spacious wardrobe. The decorative mood lighting adds a soothing touch, and access to the en-suite bathroom provides privacy. Enjoy the poolside gazebo bed and take in the refreshing pool views.',
        'Cozy bedrooms to relax and recharge after a day by the pool or exploring the beauty of Bali.',
        'Our rooms offer a fresh, private, and relaxing atmosphere. Fully equipped for your comfort, it includes an en-suite bathroom, ideal for unwinding and enjoying a restful night after a day in the pool or exploring Bali.',
      ]),
      ...imgs('Living Room', ['Living Room_01.jpeg','Living Room_02.jpeg','Living Room_03.jpeg','Living Room_04.jpeg'], [
        'This spacious living room offers a stunning pool view with plush couches, cushions, and a coffee table for a cozy vibe. Enjoy a smart TV with Bluetooth speaker, while floor-to-ceiling curtains provide privacy and keep the space peaceful and bug-free.',
        'Lounge and kitchen: two comfortable couches with cushions and footrests, a glass-top table with four comfortable chairs, a TV with Bluetooth speaker system, a 150 Mbps Wi-Fi connection, and floor-to-ceiling curtains to keep bugs out at night.',
        'The lounge and kitchen feature cozy sofas with cushions and footrests, a glass dining table with four chairs, a smart TV with Bluetooth speaker, 150 Mbps Wi-Fi, and floor-to-ceiling curtains for privacy and protection from bugs.',
        'Our living room is designed to make you feel at home while enjoying the beauty of Bali in a fresh and private atmosphere. Whether sipping coffee or unwinding after a day exploring the island, you\'ll find the perfect spot to recharge and feel at ease.',
      ]),
      ...imgs('Kitchen', ['Kitchen_01.jpeg','Kitchen_02.jpeg','Kitchen_03.jpeg','Kitchen_04.jpeg','Kitchen_05.jpeg','Kitchen_06.jpeg','Kitchen_07.jpeg'], [
        'Fully equipped for your convenience, our kitchen invites you to enjoy a refreshing moment. Whether you\'re brewing a delicious cup of coffee, preparing a healthy breakfast, or cooking a hearty meal.',
        'Our kitchen is a bright, open space. Perfect for preparing fresh breakfasts or delicious meals while enjoying quality time with family, friends, or your partner.',
        'Feels like home! Kitchen featuring a sleek island bar and all the essentials for cooking, including a large fridge-freezer, electric kettle, water dispenser (hot & cold), and microwave. Complete with cutlery, dishes, cups, and pots.',
        'Fully equipped kitchen with island bar, large fridge-freezer, electric kettle, water dispenser (hot and cold), microwave, cutlery, dishes, cups, pots, pans, etc.',
        'With direct access to the pool, it\'s the perfect spot to enjoy the fresh breeze and a tasty snack after a refreshing swim.',
      ]),
      ...imgs('Dining Area', ['Dining Area_01.jpeg','Dining Area_02.jpeg'], [
        'Our dining area is an open-concept space seamlessly connected to the kitchen and living room, creating a natural flow that encourages connection and shared moments.',
        'The dining area blends effortlessly with the kitchen and living room, offering an open, social space ideal for meals, conversations, and creating special moments in a bright, welcoming setting.',
      ]),
      ...imgs('Bathroom', ['Bathroom_01.jpeg','Bathroom_02.jpeg','Bathroom_03.jpeg','Bathroom_04.jpeg','Bathroom_05.jpeg','Bathroom_06.jpeg','Bathroom_07.jpeg'], [
        'This en-suite bathroom to Bedroom 1 features a modern bathtub with an integrated shower, offering the best of both worlds. A sleek sink with a large mirror enhances the space, while a ladder-shaped towel-drying rack adds style and functionality.',
        'Enjoy a practical and comfortable shower experience, perfect for freshening up quickly so you can keep exploring Bali and relaxing in our beautiful spaces.',
        'Enjoy an energizing shower in your en-suite bathroom, fully equipped for your comfort.',
        'Enjoy a practical and comfortable shower experience, perfect for freshening up quickly so you can keep exploring Bali and relaxing in our beautiful spaces.',
      ]),
      ...imgs('Location-Area', ['Location-Area_01.jpeg','Location-Area_03.jpeg','Location-Area_04.jpeg'], [
        'Seminyak Beach is just a 10-min walk from the villa, with friendly waves perfect for beginner and intermediate surfers. Affordable surf schools like Bali Green Surf and Santai Surf offer lessons to help you catch your first wave.',
        'The luxurious, tropical Potato Head Beach Club is just 5 minutes by motorbike! Lounge by the infinity pool, sip on creative cocktails, and soak up the vibrant atmosphere with world-class dining, beachfront views, and iconic sunset vibes in Seminyak.',
        'Enjoy the renowned beach restaurant Ku De Ta, only 1km from the villa! Savor gourmet dishes and signature cocktails with breathtaking ocean views, stunning sunsets, and a vibrant yet relaxed atmosphere right on Seminyak Beach.',
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
      { name: 'Mimi', text: 'This is my second visit to this beautiful Villa. I love that everything is in walking distance and the host couldn\'t be more helpful arranging things for me and picking me up from the airport. Always attentive and happy.' },
      { name: 'Trevor', text: 'A lovely comfortable villa in a very private location but a few minutes walk from bustling Seminyak. A special mention for Dewa who was delightful and very helpful and arranged a driver for us for a great day out.' },
      { name: 'Sally', text: 'We loved the location, perfect next to the Circle K, Coffee shop and Laundry! Dewa was also so great as a host, and arranged a pool fence and cot for our infant.' },
      { name: 'Vikram', text: 'The host was very responsive and supportive throughout our stay. Any minor issues were resolved promptly.' },
      { name: 'Pratheesh', text: 'Our stay was excellent thanks to the proactive and responsive host whose communication and empathy was top notch.' },
    ],
    coverImage: 'Exterior/Exterior_01.jpeg',
    images: [
      ...imgs('Exterior', ['Exterior_01.jpeg', 'Exterior_02.png'], [
        'Welcome to Bali Blue 2! The entrance to your private tropical villa awaits.',
        'Lush greenery surrounds the villa, creating a peaceful and serene atmosphere in the heart of Seminyak.',
      ]),
      ...imgs('Pool', ['Pool_01.jpeg'], [
        'Take a refreshing dip in the private pool, surrounded by tropical garden views and comfortable loungers.',
      ]),
      ...imgs('Living Room', ['Living Room_01.jpg'], [
        'The spacious living room opens onto the garden and pool area, featuring a Smart TV and comfortable seating for the whole group.',
      ]),
      ...imgs('Bedroom', ['Bedroom_01.jpeg','Bedroom_02.jpeg'], [
        'Relax in this beautiful bedroom featuring a king-size bed, air conditioning, and a 43-inch Smart TV. You\'ll have direct access to the pool lounge, perfect for unwinding by the water. The en-suite bathroom offers comfort and privacy.',
        'This serene bedroom opens to the pool and lush garden, featuring a Smart TV with Netflix, blackout curtains, a workspace with a desk, and a full-length mirror. The king bed ensures comfort, making it perfect for both relaxation and entertainment.',
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
      { name: 'Thomas', text: 'We stayed for the second time in this villa, once again amazed by the level of care and responsiveness from both Joel and Mr Dewa.' },
      { name: 'Mitchell', text: 'Joel is a lovely host and Dewa is an extremely friendly villa manager, helpful, knowledgeable and all requests were granted with no fuss.' },
      { name: 'Madeline', text: 'Joel, Dewa and house keepers, pool boy (ketut) and breakfast chefs at this villa were amazing!!' },
      { name: 'Yvonne', text: 'Joel\'s Villa was nice and quiet with beautiful gardens and in a great location, very easy to get around.' },
      { name: 'Jasmin', text: 'We had a great stay! Bali Green was clean, comfortable, and exactly as described.' },
    ],
    coverImage: 'Living Room/Living Room_01.jpeg',
    images: [
      ...imgs('Living Room', ['Living Room_01.jpeg','Living Room_02.jpeg','Living Room_03.jpeg','Living Room_04.jpeg'], [
        'Lounge doors closed for hot days and evenings with AC to cool the space.',
        'Lounge sliding doors open for full connection to jungle garden and pool with ceiling fan to cool the space.',
      ]),
      ...imgs('Garden', ['Garden_01.jpeg','Garden_02.jpeg'], [
        'Wake up to a lush tropical garden each morning.',
        'Relax in the tropical garden gazebo.',
      ]),
      ...imgs('Exterior', ['Exterior_01.jpeg','Exterior_02.jpeg'], [
        'The Bali Green\'s nameplate adorns the vibrant yellow wall, adding a touch of charm to the entrance. Surrounded by greenery, it marks the start of your peaceful getaway.',
        'The illuminated entrance to The Bali Green invites you into a tranquil retreat. Framed by lush greenery, the warm lighting and intricate details set the tone for a serene tropical experience.',
      ]),
      ...imgs('Bedroom', ['Bedroom_01.jpeg','Bedroom_02.jpeg','Bedroom_03.jpeg','Bedroom_04.jpeg','Bedroom_05.jpeg','Bedroom_06.jpeg','Bedroom_07.jpeg','Bedroom_08.jpeg','Bedroom_09.jpeg','Bedroom_10.jpeg','Bedroom_11.jpeg','Bedroom_12.jpeg','Bedroom_13.jpeg'], [
        'This air-conditioned master bedroom offers a 43-inch smart TV with cable and streaming, a pool view, and ensuite bathroom. It features bedside tables with lamps, a footboard bench, and curtains for privacy, creating a serene and comfortable retreat.',
        'A serene pool view brightens the room with natural light. Enjoy air conditioning, a 43-inch smart TV with streaming, and comfortable furnishings, including bedside tables and a bench. A perfect blend of relaxation and modern convenience.',
        'The bedroom features a pool view, air conditioning, and a smart TV with streaming. Two bedside tables with lamps, a wooden footboard bench, and neutral decor add warmth and style, creating a cozy yet elegant environment for rest.',
        'With direct access to a private patio, Bedroom 2 offers air-conditioning, a queen bed, and a 43-inch smart TV. The serene design is complemented by an ensuite bathroom for ultimate convenience and relaxation.',
        'Relax in Bedroom 2 with its air-conditioning, queen bed, and 43-inch smart TV. French doors open to a peaceful private patio, while the ensuite bathroom ensures convenience. A perfect mix of comfort and tropical charm.',
        'This bright and cozy bedroom features a queen-size bed, ensuite bathroom, Smart TV, and air conditioning. Filled with natural light, it offers a warm, relaxing vibe. With direct access to the living area, it provides both comfort and convenience.',
        'The spacious bedroom includes a dedicated work area with a desk, chair, and power outlets. A large wardrobe provides ample storage, while the ensuite bathroom ensures privacy and convenience, making it a perfect space for work and relaxation.',
        'This bright bedroom includes a queen bed, smart TV, air-conditioning, and ensuite bathroom. French doors lead to a private patio with lush greenery, offering a serene retreat for relaxation or enjoying Bali\'s tropical air.',
      ]),
      ...imgs('Kitchen', ['Kitchen_01.jpeg','Kitchen_02.jpeg','Kitchen_03.jpeg','Kitchen_04.jpeg','Kitchen_05.jpeg'], [
        'The kitchen features a microwave, rice cooker, blender, toaster, and a dual-burner stove. Fully equipped to handle all your cooking needs, with spacious counters and sink for simple and enjoyable meal prep.',
        'The kitchen island serves as a dining area and a convenient workspace with ample power outlets. Its curved design, stylish stools, and lush greenery make it perfect for meals, morning coffee, or working in a tropical setting.',
      ]),
      ...imgs('Bathroom', ['Bathroom_01.jpeg','Bathroom_02.jpeg','Bathroom_03.jpeg','Bathroom_04.jpeg','Bathroom_05.jpeg','Bathroom_06.jpeg','Bathroom_07.jpeg','Bathroom_08.jpeg'], [
        'Bathroom 1 offers a bathtub, a large mirror, and modern fixtures, with a touch of greenery for a serene feel. The window invites natural light, while the green tile flooring adds charm to this ensuite retreat.',
        'This ensuite bathroom includes a bathtub, shower, and modern amenities. Green tile floors, lush greenery, and a large window bring natural light and a tranquil, tropical vibe to the space.',
        'This ensuite bathroom features a relaxing bathtub, a stylish carved mirror, and a modern sink. Natural light streams through the window, complemented by lush plants and green tile flooring, creating a tranquil, spa-like atmosphere.',
        'This ensuite bathroom offers a relaxing bathtub, a carved mirror above a modern sink, and charming green tile floors. Natural light and plants create a tranquil and refreshing retreat.',
        'Bathroom 2 features a bathtub, a large carved mirror, and a modern sink. The green tile flooring adds character, while natural light and lush plants create a serene atmosphere. Ensuite access ensures privacy and convenience.',
        'Bathroom 3 offers a relaxing bathtub with a shower, a sleek sink with a carved mirror, and charming green tile flooring. The vibrant plants and spacious layout create a refreshing, spa-like ambiance.',
        'Nestled at the end of a lush garden corridor, this bathroom offers a rain shower, a carved mirror above a sleek sink, and bamboo accents. Green tile flooring and plant decor bring a refreshing tropical touch.',
        'Located at the end of an outdoor garden corridor, this bathroom features a carved mirror, a sleek sink, and a bamboo towel ladder. The rain shower and green tile flooring, paired with lush plant accents, create a serene and tropical-inspired space.',
      ]),
      ...imgs('Other', ['Other_01.png']),
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
      ...imgs('Living Room', ['Living Room_02.jpeg','Living Room_01.jpeg','Living Room_03.jpeg'], [
        'Spacious living room with two large sofas, four footrests, and vibrant décor—perfect for relaxing by day with garden views or transforming into your own private cinema and game room with darts, karaoke, and a retractable projector screen.',
        'Spacious living room with two large sofas, four footrests, cinema-red blackout curtains, dartboard, and garden views. Flexible for lounging, games, or cinema nights, with sofa armrest trays and wheel-based tables keeping drinks and snacks close.',
        'From the living room, enjoy seamless connection to every part of the villa—pool and garden, dining area, bar, kitchen, and bedrooms—all within view for the ultimate shared Bali experience.',
      ]),
      ...imgs('Pool', ['Pool_01.jpeg','Pool_05.jpeg','Pool_06.jpeg','Pool_02.jpeg','Pool_03.jpeg','Pool_04.jpeg'], [
        'A sparkling 7m x 3m pool framed by lush greenery and bright loungers, creating the villa\'s perfect centerpiece for both relaxation and social time.',
        'Poolside patio with vibrant loungers, perfect for sunbathing or relaxing between swims. Fresh pool towels provided!',
        'Shaded second patio on the other side of the pool with smaller bean bags—perfect for relaxing chats or enjoying a drink.',
        'Outdoor pool shower surrounded by tropical greenery—perfect for rinsing off after a swim.',
        'Enjoy direct pool access from every part of the villa, with sun loungers perfectly placed for relaxing between dips.',
      ]),
      ...imgs('Exterior', ['Exterior_01.png','Exterior_02.jpeg','Exterior_03.jpeg','Exterior_04.jpeg','Exterior_06.jpeg'], [
        'Well-lit, plant-lined exterior with ample space for a standard sized car and several motorbikes/scooters. Features a rolling gate and a code lockbox, so villa guests can easily share keys and avoid ever being locked out.',
        'Secure code lockbox for easy key sharing among guests—so no one is ever locked out when heading in or out of the villa.',
      ]),
      ...imgs('Cinema', ['Cinema_01.jpeg','Cinema_02.jpeg','Cinema_03.png','Cinema_04.jpeg'], [
        'Settle in for the ultimate movie night with space for up to 9 people — comfy sofas, bean bags, and 4 footrests all facing a giant screen powered by an Epson projector, framed by full blackout curtains for the perfect cinema vibe.',
        'Enjoy the big-screen experience day or night — the full blackout curtains ensure perfect viewing conditions, while the high-power ceiling fan and additional movable fans keep the cinema cool and comfortable for up to 9 people.',
        'With spacious sofas, oversized bean bags, and 4 cushioned footrests, the cinema comfortably fits up to 9 people — the perfect setup for group movie marathons or a laid-back gaming session on the big screen.',
        'Everything is simple to control: the retractable screen, Epson projector, Xiaomi smart TV for Netflix & YouTube, and the Sony surround sound system — all at your fingertips with dedicated remotes.',
      ]),
      ...imgs('Bar', ['Bar_02.jpeg'], [
        'Private bar with four teak barstools, hanging shelves for bottles and glassware, and tropical touches—perfectly linking the kitchen and dining area.',
      ]),
      ...imgs('Games', ['Games_03.jpeg'], [
        'Take aim at the closeable professional dartboard, mounted at the official height of 173 cm (5 ft 8 in) from floor to bullseye. Complete with 6 darts, chalkboards, and crayon for scoring, the board also flips for dedicated target practice.',
      ]),
      ...imgs('Bedroom 1', ['Bedroom 1_01.jpeg','Bedroom 1_02.jpeg','Bedroom 1_03.jpeg','Bedroom 1_05.jpeg','Bedroom 1_06.jpeg','Bedroom 1_07.jpeg','Bedroom 1_08.jpeg'], [
        'Spacious 35 m² bedroom with 1.5 AC, king-size bed, blackout curtains, Smart TV with streaming, safe, iron and board, and dedicated workspace. Sliding doors open to the pool and garden, with access to the ensuite bathroom for comfort and convenience.',
        'Bedroom 1 with a king-size bed, featuring 1.5 AC, pendant lamps, blackout curtains, Smart TV, workspace, and direct pool access—ideal for couples or solo guests.',
        'Bedroom 1 in a 2-person setup, featuring a king-size bed, pendant lamps, blackout curtains, and direct pool access—perfect for single travelers or couples seeking comfort and privacy.',
        'This close-up shot highlights the cozy corner of Bedroom 1, featuring a stylish round wooden chair with a palm-pattern cushion, a natural jute rug, tall decorative grasses, and floor-to-ceiling blackout curtains.',
        'Bedroom 1 also includes a compact wooden desk setup with a chair and soft ambient lighting, perfect for reading, writing, or catching up on remote work.',
        'For a small nightly fee, we can set up an additional bed (85 cm x 200 cm). Perfect for families or small groups who want to stay together in comfort without compromising on space or style.',
        'A portable cot is available free of charge and can be set up in either bedroom. Please let us know in advance if you\'re traveling with young children so we can prepare it for your stay.',
      ]),
      ...imgs('Bedroom 2', ['Bedroom 2_01.jpeg','Bedroom 2_02.jpeg','Bedroom 2_03.jpeg','Bedroom 2_05.jpeg','Bedroom 2_07.jpeg','Bedroom 2_09.jpeg','Bedroom 2_10.jpeg','Bedroom 2_11.jpeg','Bedroom 2_12.jpeg'], [
        'Bedroom 2 in a 1–2 person setup, featuring a king-size bed, smart TV, blackout curtains, and direct access to the poolside terrace—ideal for couples or solo travelers who enjoy extra space and comfort.',
        'Bedroom 2 in a 1–2 person setup, complete with a king-size bed, wardrobe, workspace, and Netflix-ready smart TV—combining comfort with modern convenience.',
        'Bedroom 2 in the 1–2 person setup, featuring a king-size bed, pendant lamps, stylish décor, and blackout curtains for a restful night\'s sleep.',
        'Bedroom 2 in the 1–2 person setup, offering a king-size bed, pendant lighting, cozy seating, and a dedicated vanity/workspace—perfect for comfort and versatility.',
        'Bedroom 2 detail: modern pendant lamp, bold artwork, and patterned cushions add a warm, stylish touch to the king-size bed setup.',
        'Bedroom 2 detail: soft pendant lighting, Balinese-inspired cushions, and vibrant artwork create a cozy yet modern atmosphere.',
        'Bedroom 2 detail: romantic touches such as towel swans, warm pendant lighting, and hand-woven textiles add charm and intimacy to the space.',
        'Bedroom 2 detail: vibrant artwork and patterned textiles bring color and personality, complemented by soft pendant lighting for a cozy, inviting atmosphere.',
        'Bedroom 2 detail: a stylish rattan chair with floral cushion adds warmth and a tropical touch, perfect for relaxing with natural light streaming through the curtains.',
      ]),
      ...imgs('Kitchen', ['Kitchen_01.jpeg','Kitchen_02.jpeg','Kitchen_03.jpeg','Kitchen_04.jpeg','Kitchen_05.jpeg'], [
        'Fully equipped kitchen with gas stove, microwave, water dispenser, air fryer, rice cooker, blender, and ample counter space—perfect for everything from quick snacks to full meals.',
        'Detail of the kitchen\'s gas stove with teak wood corner shelves, stocked with mugs, shakers, and spices, blending functionality with warm design accents.',
        'Microwave and water dispenser on a solid teak wood counter, blending modern convenience with natural design.',
      ]),
      ...imgs('Dining Area', ['Dining Area_01.jpeg','Dining Area_02.jpeg','Dining Area_03.jpeg','Dining Area_04.jpeg','Dining Area_05.jpeg','Dining Area_06.jpeg'], [
        'Elegant dining space with six carved wooden chairs, decorative mirrors, ceiling fan, and direct connection to the bar and kitchen—perfect for meals, gatherings, and shared moments.',
        'Dining room at the heart of the villa with a six-person glass-top table, palm-carved chairs, decorative mirrors, and a curvy ceiling fan—connecting bar, kitchen, living area, and pool with light, style, and views of every corner.',
        'Dining area with glass-top wooden table, six carved chairs, and decorative mirrors that reflect natural light—centrally placed to connect the bar, kitchen, living room, and garden.',
        'Glass-top wooden dining table with six carved chairs, decorative mirrors, and ceiling fan—centrally placed to connect the living room, bar, kitchen, and garden for a shared villa experience.',
        'Glass-top dining table set for six, with palm-carved wooden chairs, elegant mirrors, and fresh floral details—bringing warmth and charm to shared meals.',
        'Palm-carved wooden chairs and a glass-top dining table set for six, complete with fresh flowers and elegant glassware—perfect for stylish, shared meals.',
      ]),
      ...imgs('Bathroom 1', ['Bathroom 1_01.jpeg','Bathroom 1_02.jpeg'], [
        'Bathroom 1 ensuite to Bedroom 1, featuring a rain shower, skylight, teak vanity, stone accents, tropical greenery, and full WC setup with stainless steel fixtures.',
        'Light-filled ensuite bathroom to Bedroom 1 with rain shower, teak vanity, natural stone, tropical plants, and WC with stainless steel shower hose, brush, and holders.',
      ]),
      ...imgs('Bathroom 2', ['Bathroom 2_01.jpeg','Bathroom 2_02.jpeg','Bathroom 2_03.jpeg','Bathroom 2_04.jpeg'], [
        'Bathroom 2 ensuite to Bedroom 2, featuring a rain shower, skylight, teak vanity, stone flooring, tropical plants, and WC with stainless steel fixtures.',
        'Convenient guest bathroom located beside the pool area, featuring a toilet, sink, and direct access to the outdoor shower — perfect for rinsing off after a swim.',
        'Bathroom 2 features a modern WC with stainless steel shower hose, toilet roll and towel holders, accented with natural light and decorative wall details.',
        'Bathroom 2 offers a bright, spa-like feel with a large skylight, rain shower, modern vanity with teak accents, decorative touches, and a WC complete with stainless steel shower hose and fittings.',
      ]),
    ],
  },
]

export function getVilla(slug: string): Villa | undefined {
  return villas.find((v) => v.slug === slug)
}

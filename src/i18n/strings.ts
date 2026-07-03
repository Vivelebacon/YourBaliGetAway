// Catalog of every static UI string on the guest-facing site. This is the source
// of truth handed to the translation layer so the client has a synchronous t()
// (no flash). A string missing from here simply renders in English, never crashes.
// Use {n}, {villa}, {from}, {to} placeholders for interpolated values.

export const UI_STRINGS: string[] = [
  // ── Navbar ──
  'Home',
  'Our Villas',
  'Book',
  'Contact',
  'WhatsApp Us',
  'Currency',
  'Language',

  // ── Home: collection ──
  'The Collection',
  'Five Exceptional Villas',
  'From',
  '/ night',
  'BR',
  'BA',
  'guests',
  'Check availability',
  'View villa',

  // ── Home: why book direct ──
  'Best Rate Guarantee',
  'Book direct and pay no platform fees. Always cheaper than Airbnb.',
  'Quick Confirmation',
  'Send your dates and your host confirms personally. No double bookings, ever.',
  'Personal Service',
  'Direct contact with your host via WhatsApp for a tailored Bali experience.',

  // ── Home: booking + reviews ──
  'Direct Booking',
  'Check Availability',
  'Select your dates and villa below. Real-time calendar. No double bookings, ever.',
  'Guest Experiences',
  'What Our Guests Say',

  // ── Hero (cinema) ──
  'Bali, Indonesia',
  'Scroll to explore',

  // ── Footer ──
  'Five private pool villas in the heart of Bali. Book direct for the best rates and personalised service.',
  'Seminyak, Bali, Indonesia',
  'All rights reserved.',
  'Powered by Hostaway. Real-time availability, zero double bookings.',

  // ── Villa search (home widget) ──
  'Please pick your check-in and check-out dates.',
  'Check-out must be after check-in.',
  'Search failed',
  'Check-in',
  'Check-out',
  'Guests',
  'guest',
  'Searching…',
  'Search',
  'No villas available for those dates. Try different dates or fewer guests.',
  'villa',
  'villas',
  'available',
  'off',
  'View & book',

  // ── Booking calendar ──
  'Loading live availability…',
  "We couldn't load availability right now.",
  'Please refresh, or contact us directly via WhatsApp.',
  'Request sent',
  'Thank you. Your request for {villa} from {from} to {to} has been received. Your host will review and confirm with you shortly. These dates are not blocked until confirmed.',
  'Select your dates',
  'Those dates include unavailable nights. Pick a different range.',
  'Minimum stay for these dates is {n} nights.',
  'night',
  'nights',
  'total',
  'monthly discount applied',
  'weekly discount applied',
  'Clear dates',
  'Full name',
  'Email',
  'Phone (optional)',
  'Message (optional)',
  'Sending…',
  'Request to Book',
  'No instant booking. Your host confirms before any dates are blocked.',
  'Previous month',
  'Next month',

  // ── Villa detail page ──
  'reviews',
  'Bedrooms',
  'Bathrooms',
  'Up to {n}',
  'Amenities',
  'Reserve {villa}',
  'Real-time availability. Send a request and your host confirms. Best rate guaranteed.',
  'Gallery',
  'Guest Reviews',
  '({n} reviews on Airbnb)',
  'You Might Also Like',
  'View Villa',
  'Back to all villas',
  'Close',
  'Previous',
  'Next',

  // ── Chat widget ──
  "Hi there! I'm Maya from Your Bali Getaway 🌴 I'd love to help you find your perfect villa. Tell me your dates and how many of you are coming, and I'll show you what's available 😊",
  'Check availability for my dates',
  'Best villa for a couple',
  'A villa for a group',
  'What makes your villas special',
  'Maya · usually replies instantly',
  'Ask about the villas…',
  "Sorry, I couldn't respond just now. You can reach the team directly on WhatsApp.",
  'Chat on WhatsApp',
  'Book now',
  'Need help choosing your villa?',
]

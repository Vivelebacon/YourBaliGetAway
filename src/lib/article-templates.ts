// Ready-made article scaffolds for the Takeaways CMS. Joel picks one when
// creating an article (or switches the category in the editor): it pre-fills a
// structured body with headings and prompts, so he only fills in the blanks.
// Changing the category in the editor swaps the template: templateForCategory
// returns the first template declared for that category.
// Client-safe: no server-only imports.

export interface ArticleTemplate {
  id: string
  label: string
  category: string
  hint: string
  excerpt: string
  body: string
  joelPicks: string
}

export const ARTICLE_TEMPLATES: ArticleTemplate[] = [
  {
    id: 'restaurants',
    label: 'Restaurants / where to eat',
    category: 'food',
    hint: 'A shortlist of the best places to eat in an area.',
    excerpt: 'Where we send our guests to eat: our favourite tables nearby, from a casual bite to a long dinner.',
    body: `<p><em>Set the scene in one or two lines: what is the food like in this area, and who is this guide for?</em></p>
<h2>For a special dinner</h2>
<p><strong>[Restaurant name]</strong> — <em>what makes it special, what to order, and a booking tip.</em></p>
<h2>For brunch and coffee</h2>
<ul><li><strong>[Place]</strong>: <em>one line on why you love it.</em></li><li><strong>[Place]</strong>: <em>one line on why you love it.</em></li></ul>
<h2>For a casual bite</h2>
<p><em>A warung or local spot worth knowing, and what to try there.</em></p>`,
    joelPicks: `<p><em>The insider bit (members only): the exact table to ask for, the best time to arrive, and the one dish most people miss.</em></p>`,
  },
  {
    id: 'bars',
    // Drinks live under Food & Drink now. Still pickable by name when creating
    // an article; templateForCategory returns the Restaurants one for 'food'.
    label: 'Bars / drinks / nightlife',
    category: 'food',
    hint: 'Where to go for a drink, sunset cocktail or a night out.',
    excerpt: 'From a quiet sunset cocktail to a proper night out, here is where to go for a drink nearby.',
    body: `<p><em>Set the scene: what is the drinks and nightlife scene like here?</em></p>
<h2>For a sunset drink</h2>
<p><strong>[Bar / beach club]</strong> — <em>the vibe, what to order, and when to arrive for the best spot.</em></p>
<h2>For cocktails</h2>
<ul><li><strong>[Bar]</strong>: <em>one line on why.</em></li><li><strong>[Bar]</strong>: <em>one line on why.</em></li></ul>
<h2>For a night out</h2>
<p><em>Where the night goes late, and what to expect.</em></p>`,
    joelPicks: `<p><em>Members only: the bar locals actually go to, and the drink to order there.</em></p>`,
  },
  {
    id: 'wellness',
    label: 'Massage / spa / wellness',
    category: 'wellness',
    hint: 'Where to relax: spas, massages, yoga.',
    excerpt: 'Make wellness a daily habit in Bali. Here is where to go, what to book and how much to pay.',
    body: `<p><em>Why is this worth doing in Bali? Set expectations on quality and price.</em></p>
<h2>The best addresses</h2>
<p><strong>[Spa name]</strong> — <em>what they are known for, and which treatment to book.</em></p>
<h2>Everyday value</h2>
<ul><li><em>A rule of thumb for picking a good street spa.</em></li><li><em>What to say about pressure and timing.</em></li></ul>
<h2>At the villa</h2>
<p><em>How guests can book an in-villa treatment through you.</em></p>`,
    joelPicks: `<p><em>Members only: the exact therapist or time slot you'd book, and the in-villa option most guests don't know about.</em></p>`,
  },
  {
    id: 'beaches',
    label: 'Beaches / sunset spots',
    category: 'beaches',
    hint: 'Where to swim, surf and watch the sunset.',
    excerpt: 'Not all Bali beaches are equal, and sunset is the daily main event. Where to go and when.',
    body: `<p><em>Set expectations: what are the beaches near the villas good for?</em></p>
<h2>The local beaches</h2>
<ul><li><strong>[Beach]</strong>: <em>what it's good for.</em></li><li><strong>[Beach]</strong>: <em>what it's good for.</em></li></ul>
<h2>Worth the drive</h2>
<p><em>A beach or two further out that's worth the trip.</em></p>
<h2>Sunset tips</h2>
<p><em>What time to arrive, where to sit, and how to make the most of it.</em></p>`,
    joelPicks: `<p><em>Members only: your secret sunset spot and the exact time to be there.</em></p>`,
  },
  {
    id: 'activities',
    label: 'Activities / things to do',
    category: 'activities',
    hint: 'Surf lessons, classes, water sports, entertainment.',
    excerpt: 'Beyond the beach and the pool: the activities worth booking during your stay.',
    body: `<p><em>What kind of activities can guests do around here?</em></p>
<h2>On the water</h2>
<p><strong>[Activity]</strong> — <em>surf lessons, snorkelling, water sports: where to book and what to expect.</em></p>
<h2>Classes and culture</h2>
<ul><li><strong>[Activity]</strong>: <em>cooking class, yoga, craft: one line on why.</em></li></ul>
<h2>For the evening</h2>
<p><em>Shows, live music or entertainment worth catching.</em></p>`,
    joelPicks: `<p><em>Members only: the activity guests rave about, and how to book it for the best price.</em></p>`,
  },
  {
    id: 'daytrip',
    label: 'Day trip / excursions',
    category: 'explore',
    hint: 'A destination within reach of the villa: Ubud, Uluwatu, temples.',
    excerpt: 'You do not need to move hotels to see the famous Bali. Here is a day trip worth planning.',
    body: `<p><em>What is this place, and why is it worth a day?</em></p>
<h2>What to see</h2>
<p><em>The main sights, in the order you'd do them.</em></p>
<h2>When to go</h2>
<p><em>Best time of day, and how to beat the crowds.</em></p>
<h2>Getting there</h2>
<p><em>How to arrange a driver, roughly what it costs, and how to book through you.</em></p>`,
    joelPicks: `<p><em>Members only: the smarter way to do this trip that avoids the crowds and the traffic.</em></p>`,
  },
  {
    id: 'practical',
    label: 'Practical tips',
    category: 'practical',
    hint: 'Money, scooters, etiquette, health, SIM cards.',
    excerpt: 'The unglamorous knowledge that makes a Bali trip smooth: cash, transport and etiquette.',
    body: `<p><em>One line on why this matters.</em></p>
<h2>Money</h2>
<ul><li><em>Cash, ATMs, cards.</em></li></ul>
<h2>Getting around</h2>
<p><em>Grab / Gojek, scooters, drivers.</em></p>
<h2>Etiquette and health</h2>
<ul><li><em>Temple dress, offerings on the pavement.</em></li><li><em>Water, pharmacies, the basics.</em></li></ul>`,
    joelPicks: `<p><em>Members only: the one tip you wish every guest knew before they landed.</em></p>`,
  },
  {
    id: 'blank',
    label: 'Blank / other',
    category: 'other',
    hint: 'Start from an empty page.',
    excerpt: '',
    body: '',
    joelPicks: '',
  },
]

export function getTemplate(id: string): ArticleTemplate {
  return ARTICLE_TEMPLATES.find((t) => t.id === id) ?? ARTICLE_TEMPLATES[ARTICLE_TEMPLATES.length - 1]
}

// One template per category, used by the editor when Joel switches the category.
export function templateForCategory(category: string): ArticleTemplate {
  return (
    ARTICLE_TEMPLATES.find((t) => t.category === category) ??
    ARTICLE_TEMPLATES[ARTICLE_TEMPLATES.length - 1]
  )
}

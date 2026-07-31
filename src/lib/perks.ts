// Guest Discounts & Perks: benefits negotiated for Your Bali Getaway guests.
//
// Kept deliberately separate from recommendations. A business offering a guest
// discount is not automatically endorsed, so perks never appear inside the
// recommendation categories or the Tried & Tested strip.
//
// Config for now (the list is short and changes rarely). The shape is stable,
// so it can move behind the CMS later without touching the page.

export interface GuestPerk {
  /** Business or venue name. */
  name: string
  /** What the guest actually gets, in one line. */
  benefit: string
  /** Where it is, e.g. "Seminyak". */
  area?: string
  /** Anything the guest has to do or know to claim it. */
  howToClaim?: string
  /** Optional photo, relative to /public or a full URL. */
  image?: string
  /** Optional external link to the business. */
  url?: string
}

export const GUEST_PERKS: GuestPerk[] = []

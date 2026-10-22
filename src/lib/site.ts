// Edit these values for your client. Everything shown on the site reads from here.
export const site = {
  name: "Alyson Warranty",
  // Public address of the live site, used for canonical links, the sitemap and share previews.
  // Set SITE_URL (e.g. https://alysonwarranty.com) in the hosting environment. It is read when the
  // server starts, so changing the domain needs a restart, not a rebuild.
  url: (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  description:
    "Auto and home warranty plans that help pay for costly repairs: vehicle service contracts for your car and home service contracts for your systems and appliances. Get a free quote in a few minutes.",
  // Official profile pages on other sites (LinkedIn, Facebook, Trustpilot, Crunchbase, Bing Places…).
  // Added to the Organization data as sameAs, which helps Google build a knowledge panel.
  sameAs: [] as string[],
  // PLACEHOLDER: set the real number and email in Admin → Settings before launch.
  phone: "(800) 555-0199",
  phoneHref: "tel:+18005550199",
  email: "quotes@alysonwarranty.com",
  agencyLegalName: "Alyson Warranty",
  // Shown in the footer on every page: what the business is.
  licenseNote:
    "Alyson Warranty offers vehicle service contracts and home service contracts, which are backed and administered by the provider named in each contract. We are not an insurance company and do not sell insurance.",
  // Rating badges in the "Our Reputation" section. Use only real, current figures from
  // the named platform; the badges stay hidden while this list is empty. Example:
  // { score: "4.8", source: "Google", count: "1,200+ reviews", href: "https://g.page/..." }
  reviewSources: [] as { score: string; source: string; count: string; href?: string }[],
  // "What Our Customers Say" section. Copy reviews word for word from a real review
  // platform about this business; the section stays hidden while `reviews` is empty.
  customerReviews: {
    // Overall rating shown above the review cards, e.g.
    // { platform: "Google", rating: 4.6, count: 312, url: "https://g.page/..." }
    summary: null as { platform: string; rating: number; count: number; url: string } | null,
    // e.g. { name: "Jane", location: "Austin, TX", date: "May 9, 2026", rating: 5, text: "..." }
    reviews: [] as { name: string; location: string; date: string; rating: number; text: string }[],
    // Only an award actually given to this business, e.g.
    // { text: "Awarded “Best Value” by Example.com", url: "https://example.com/review" }
    award: null as { text: string; url: string } | null,
  },
  // ─────────────────────────────────────────────────────────────
  // CONSENT TEXT: PLACEHOLDER ONLY. Your client's lawyer must supply
  // the final TCPA consent wording. Change the version every time
  // the text changes so each lead records exactly what the user saw.
  // One text per product: each form shows the one for its product.
  // ─────────────────────────────────────────────────────────────
  vscConsentVersion: "2026-10-22-draft",
  vscConsentText:
    "By clicking “Get my free quote”, I agree that Alyson Warranty and the vehicle service contract providers it works with may contact me about vehicle service contracts and related vehicle protection products at the phone number and email I provided, including by calls and texts that may use automated technology or prerecorded messages. Consent is not required to buy. Message and data rates may apply. I also agree to the Privacy Policy and Terms of Use.",
  homeConsentVersion: "2026-10-22-draft",
  homeConsentText:
    "By clicking “Get my free quote”, I agree that Alyson Warranty and the home service contract providers it works with may contact me about home warranty plans and related home protection products at the phone number and email I provided, including by calls and texts that may use automated technology or prerecorded messages. Consent is not required to buy. Message and data rates may apply. I also agree to the Privacy Policy and Terms of Use.",
};

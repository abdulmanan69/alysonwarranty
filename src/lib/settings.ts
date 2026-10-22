import { unstable_cache, revalidateTag } from "next/cache";
import { db } from "./db";
import { DEFAULT_PRIVACY_HTML, DEFAULT_TERMS_HTML } from "./legal-templates";
import { site } from "./site";

export type TrackingSettings = { ga4Id: string; gtmId: string; metaPixelId: string };
export type VerificationSettings = { google: string; bing: string; yandex: string; meta: string };
/** IndexNow tells Bing, Yandex and other engines about new or changed pages right away. */
export type IndexNowSettings = { enabled: boolean; key: string; lastSubmitted: string; lastResult: string };
/** AI search: which AI crawlers may read the site, and the /llms.txt summary. */
export type AiSettings = { allowSearchBots: boolean; allowTrainingBots: boolean; llmsTxt: boolean };
export type SeoSettings = { title: string; description: string };
export type ResultsSettings = { disclaimer: string };

export type BusinessSettings = {
  phone: string;
  email: string;
  agencyLegalName: string;
  licenseNote: string;
  vscConsentText: string; // consent on the auto warranty form; the version changes automatically with the text
  vscConsentVersion: string;
  homeConsentText: string; // consent on the home warranty form
  homeConsentVersion: string;
};

export type ReviewItem = { name: string; location: string; date: string; rating: number; text: string; title?: string };
export type ReviewTheme = "trustpilot" | "google";
export type ContentSettings = {
  hero: { eyebrow: string; title: string; subtitle: string };
  whyIntro: string;
  reasons: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  repairCosts: Record<string, string>; // part name -> price shown in the car diagram
  reviews: {
    theme?: ReviewTheme; // look of the reviews section; defaults to Trustpilot
    autoplaySeconds?: number; // seconds between slides; 0 = don't move
    summary: { platform: string; rating: number; count: number; url: string } | null;
    items: ReviewItem[];
    award: { text: string; url: string } | null;
  };
};

/** One menu entry. Header items may have one level of children (a dropdown). */
export type MenuItem = { id: string; label: string; href: string; newTab?: boolean; description?: string; children?: MenuItem[] };
/** @deprecated kept for older saved settings */
export type NavLink = MenuItem;
export type FooterColumn = { id: string; title: string; links: MenuItem[] };
export type NavigationSettings = {
  links: MenuItem[]; // header menu, left to right
  showPhone: boolean;
  ctaLabel: string; // yellow button; empty = hidden
  ctaHref: string;
  sticky: boolean; // header stays at the top while scrolling
  announcement: { enabled: boolean; text: string; linkLabel: string; href: string };
  footerColumns: FooterColumn[];
};

export type LegalSettings = {
  privacyHtml: string;
  termsHtml: string;
  privacyUpdated: string; // YYYY-MM-DD, set automatically when the text changes
  termsUpdated: string;
  privacyEmail: string; // empty = business email
  privacyPhone: string; // empty = business phone
  mailingAddress: string;
  governingState: string;
  honorGpc: boolean; // treat the browser's Global Privacy Control signal as an opt-out
  responseDays: number; // deadline for access/delete/correct requests
  confirmByEmail: boolean; // email people a confirmation of their request (needs email alerts set up)
  reviewed: boolean; // an attorney has approved both documents
};

export type BlogSettings = {
  title: string;
  intro: string;
  postsPerPage: number;
  writersCanPublish: boolean; // false = writers send posts to an admin for review
  showQuoteCta: boolean; // quote box inside every post
  ctaTitle: string;
  ctaText: string;
};

export type NotificationSettings = {
  emailTo: string; // comma-separated
  smsTo: string; // comma-separated, E.164 e.g. +15125550100
  webhookUrl: string; // Slack, Teams, Google Chat or any https webhook
  onNewLead: boolean;
  onNoQuotes: boolean; // extra alert when a lead got no online quotes and needs a call
};

export type PricingRules = {
  basePrice: number; // monthly, in dollars, before adjustments
  coveragePercent: { state_minimum: number; standard: number; premium: number }; // e.g. -38 = 38% cheaper
  ageUnder25: number; // added to the monthly price, in dollars
  age65Plus: number;
  perAccident: number;
  perViolation: number;
  uninsuredPercent: number; // surcharge when the driver has no current insurance
  newVehiclePercent: number; // surcharge for vehicles 3 years old or newer
  termMonths: number;
  maxQuotes: number;
  declineSuspended: boolean;
  declineAtIncidents: number; // accidents + violations at or above this get no online quotes; 0 = never
  coverageSummary: { state_minimum: string; standard: string; premium: string };
};

// Defaults match the original built-in demo formula.
export const DEFAULTS = {
  tracking: { ga4Id: "", gtmId: "", metaPixelId: "" } as TrackingSettings,
  verification: { google: "", bing: "", yandex: "", meta: "" } as VerificationSettings,
  indexnow: { enabled: false, key: "", lastSubmitted: "", lastResult: "" } as IndexNowSettings,
  ai: { allowSearchBots: true, allowTrainingBots: true, llmsTxt: true } as AiSettings,
  seo: { title: "", description: "" } as SeoSettings,
  results: {
    disclaimer:
      "Any prices shown are estimates based on the details you gave us. Your exact price depends on the plan and options you choose, and we confirm it before you buy.",
  } as ResultsSettings,
  business: {
    phone: site.phone,
    email: site.email,
    agencyLegalName: site.agencyLegalName,
    licenseNote: site.licenseNote,
    vscConsentText: site.vscConsentText,
    vscConsentVersion: site.vscConsentVersion,
    homeConsentText: site.homeConsentText,
    homeConsentVersion: site.homeConsentVersion,
  } as BusinessSettings,
  notifications: { emailTo: "", smsTo: "", webhookUrl: "", onNewLead: true, onNoQuotes: true } as NotificationSettings,
  navigation: {
    links: [
      { id: "auto", label: "Auto warranty", href: "/extended-car-warranty" },
      { id: "home", label: "Home warranty", href: "/home-warranty" },
      { id: "repair-costs", label: "Repair costs", href: "/repair-costs" },
      { id: "why-us", label: "Why us", href: "/why-us" },
      { id: "faq", label: "FAQ", href: "/faq" },
      { id: "blog", label: "Blog", href: "/blog" },
      { id: "about", label: "About", href: "/about" },
    ],
    showPhone: true,
    ctaLabel: "Get a quote",
    ctaHref: "/quote", // the visitor picks auto or home
    sticky: true,
    announcement: { enabled: false, text: "", linkLabel: "", href: "" },
    footerColumns: [
      {
        id: "get-covered",
        title: "Get a quote",
        links: [
          { id: "f-vsc", label: "Auto warranty quote", href: "/quote/auto-warranty" },
          { id: "f-home", label: "Home warranty quote", href: "/quote/home-warranty" },
          { id: "f-plans", label: "Auto warranty plans", href: "/extended-car-warranty" },
          { id: "f-home-plans", label: "Home warranty plans", href: "/home-warranty" },
          { id: "f-repair", label: "Repair costs", href: "/repair-costs" },
          { id: "f-why", label: "Why choose us", href: "/why-us" },
          { id: "f-faq", label: "FAQ", href: "/faq" },
          { id: "f-blog", label: "Blog", href: "/blog" },
          { id: "f-about", label: "About us", href: "/about" },
        ],
      },
      {
        id: "policies",
        title: "Policies",
        links: [
          { id: "f-privacy", label: "Privacy Policy", href: "/privacy" },
          { id: "f-terms", label: "Terms of Use", href: "/terms" },
          { id: "f-dns", label: "Do Not Sell or Share My Personal Information", href: "/do-not-sell" },
        ],
      },
    ],
  } as NavigationSettings,
  legal: {
    privacyHtml: DEFAULT_PRIVACY_HTML,
    termsHtml: DEFAULT_TERMS_HTML,
    privacyUpdated: "2026-10-08", // date of the current default wording (warranty-only rewrite)
    termsUpdated: "2026-10-08",
    privacyEmail: "",
    privacyPhone: "",
    mailingAddress: "",
    governingState: "",
    honorGpc: true,
    responseDays: 45,
    confirmByEmail: true,
    reviewed: false,
  } as LegalSettings,
  blog: {
    title: "The {company} Blog",
    intro: "Practical guides on auto warranties, home warranties and keeping repair bills down.",
    postsPerPage: 9,
    writersCanPublish: false,
    showQuoteCta: true,
    ctaTitle: "Worried about your next repair bill?",
    ctaText: "Get a free auto or home warranty quote. Our team will contact you with plan options and prices. Free, no obligation.",
  } as BlogSettings,
  content: {
    hero: {
      eyebrow: "Auto & home warranty plans",
      title: "Protect your car and your home from costly repairs.",
      subtitle: "An auto warranty helps pay for engine, transmission and other major car repairs. A home warranty helps pay to fix or replace heating, air conditioning, plumbing and appliances. Get a free quote for either in a few minutes.",
    },
    whyIntro:
      "Our goal is simple: take the stress out of repair bills, whether they come from your car or your home. A {company} plan helps protect your budget, and real people are always a phone call away.",
    reasons: [
      { title: "Real People, Plain Answers", body: "Our team talks you through your options and answers your questions before you decide anything." },
      { title: "Backed by Trusted Providers", body: "Every plan is backed and administered by an established service contract provider, so claims are handled by people who do this every day." },
      { title: "Plans for Your Car and Your Home", body: "Auto plans from powertrain to complete, and home plans for systems, appliances or both, with options that fit your budget." },
      { title: "Free, No Obligation", body: "Quotes are free, you can review the full contract before you buy, and every plan comes with a 30-day money-back guarantee." },
    ],
    faqs: [
      { q: "What is an auto warranty?", a: "An auto warranty bought after the factory warranty, legally a vehicle service contract, is an optional contract that pays for repairs to the parts it lists, such as the engine, transmission and air conditioning, when they break down. It isn't insurance." },
      { q: "What is a home warranty?", a: "A home warranty, legally a home service contract, is an optional contract that pays to repair or replace the home systems and appliances it lists, such as heating, air conditioning, plumbing, electrical and kitchen appliances, when they fail from normal wear. It isn't insurance." },
      { q: "Is a warranty the same as insurance?", a: "No. Car insurance pays for damage after an accident, and homeowners insurance pays for damage from events such as fire, storms and theft. Service contracts are optional and pay for breakdowns of the items they list. They don't replace the insurance your state or lender requires." },
      { q: "What does an auto warranty include?", a: "It depends on the plan. Powertrain plans include the engine, transmission and drive parts; higher levels add systems such as cooling, brakes, electrical and air conditioning. The exact parts, exclusions and deductible are listed in each contract." },
      { q: "What does a home warranty include?", a: "It depends on the plan. Systems plans include heating, air conditioning, plumbing, electrical and the water heater; appliance plans include the refrigerator, oven, dishwasher, washer and dryer; combo plans include both. The exact items, exclusions, limits and service call fee are listed in each contract." },
      { q: "Can I get a plan for an older car or an older home?", a: "Often, yes. Many auto plans accept older and higher-mileage cars, and most home plans have no age limit on the home, as long as everything is in working order when the plan starts. Eligibility depends on the plan." },
      { q: "How much does a plan cost?", a: "Auto plans commonly cost a few hundred to around $1,500 a year, and home plans are priced per year plus a service call fee per visit. Both depend on what you want to protect. Request a free quote and our team will give you prices for your car or home." },
      { q: "Can I cancel my plan and get a refund?", a: "Yes. Every plan {company} sells comes with a 30-day money-back guarantee: cancel within 30 days of purchase for a full refund, as long as no claims have been filed. After that, you can usually cancel for a prorated refund under the terms of your contract." },
    ],
    repairCosts: {
      "Engine Cylinder Head": "$7,500",
      Alternator: "$628-$814",
      "Instrument Cluster": "$885-$905",
      "A/C Compressor": "$550",
      "Backup Camera": "$631-$647",
      Transmission: "$3,000",
      "Power Steering Pump": "$500-$800",
      "Suspension Struts": "$1,254",
    },
    reviews: { summary: site.customerReviews.summary, items: site.customerReviews.reviews, award: site.customerReviews.award },
  } as ContentSettings,
  pricing: {
    // Roughly US market level (2026): full coverage averages about $2,000 a year, state minimum about $750.
    basePrice: 165,
    coveragePercent: { state_minimum: -62, standard: 0, premium: 28 },
    ageUnder25: 120,
    age65Plus: 20,
    perAccident: 60,
    perViolation: 35,
    uninsuredPercent: 20,
    newVehiclePercent: 15,
    termMonths: 6,
    maxQuotes: 4,
    declineSuspended: true,
    declineAtIncidents: 4,
    coverageSummary: {
      state_minimum: "State minimum liability",
      standard: "50/100/50 liability, $1,000 deductible collision & comprehensive",
      premium: "100/300/100 liability, $500 deductible collision & comprehensive",
    },
  } as PricingRules,
};

export type SettingKey = keyof typeof DEFAULTS;
export type Settings = { [K in SettingKey]: (typeof DEFAULTS)[K] };

// Only the raw rows are cached (saving any setting clears it); defaults are merged on every call,
// so a cache entry written before a new setting or field existed can't hide its default.
const loadRows = unstable_cache(
  async () => db.setting.findMany({ select: { key: true, value: true } }),
  ["settings-rows"],
  { tags: ["settings"] },
);

// Earlier default wording mixed car insurance and service contract language. Saved text that still
// matches an old default word for word gets the new default; anything an admin wrote is kept.
// Add [old default, new default] pairs whenever a default text changes, so saved copies of the
// old default follow the new wording.
const OLD_DEFAULT_TEXT = new Map<string, string>([]);
const upgradeText = (t: string) => OLD_DEFAULT_TEXT.get(t) ?? t;

function upgradeOldDefaults(out: Settings) {
  const c = out.content;
  c.hero = { eyebrow: upgradeText(c.hero.eyebrow), title: upgradeText(c.hero.title), subtitle: upgradeText(c.hero.subtitle) };
  c.whyIntro = upgradeText(c.whyIntro);
  c.reasons = c.reasons.map((r) => ({ title: upgradeText(r.title), body: upgradeText(r.body) }));
  c.faqs = c.faqs.map((f) => ({ q: upgradeText(f.q), a: upgradeText(f.a) }));
  out.blog.intro = upgradeText(out.blog.intro);
  out.blog.ctaTitle = upgradeText(out.blog.ctaTitle);
  out.blog.ctaText = upgradeText(out.blog.ctaText);
  out.results.disclaimer = upgradeText(out.results.disclaimer);
}

export async function getSettings(): Promise<Settings> {
  const out = structuredClone(DEFAULTS) as Settings;
  for (const row of await loadRows()) {
    if (!(row.key in DEFAULTS)) continue;
    try {
      const key = row.key as SettingKey;
      // Merge so settings saved before a new field was added still get its default.
      Object.assign(out[key], JSON.parse(row.value));
    } catch {}
  }
  out.navigation = normalizeNavigation(out.navigation);
  upgradeOldDefaults(out);
  return out;
}

// Section links from before the site had separate pages now point at those pages.
const OLD_ANCHORS: Record<string, string> = {
  "/#repair-costs": "/repair-costs",
  "/#why-choose": "/why-us",
  "/#faq": "/faq",
  "/privacy#do-not-sell": "/do-not-sell",
};
// Menu links to the retired car insurance state guides are dropped.
const retired = (l: Partial<MenuItem>) => String(l.href ?? "").startsWith("/car-insurance");

/** Fills in ids and missing fields for menus saved by older versions. */
function normalizeNavigation(nav: NavigationSettings): NavigationSettings {
  let n = 0;
  const item = (raw: Partial<MenuItem>, depth: number): MenuItem => ({
    id: raw.id || `m${++n}`,
    label: String(raw.label ?? ""),
    href: OLD_ANCHORS[String(raw.href)] ?? String(raw.href ?? "/"),
    ...(raw.newTab ? { newTab: true } : {}),
    ...(raw.description ? { description: String(raw.description) } : {}),
    ...(depth === 0 && raw.children?.length ? { children: raw.children.map((c) => item(c, 1)) } : {}),
  });
  const ctaHref = OLD_ANCHORS[nav.ctaHref] ?? nav.ctaHref;
  return {
    ...nav,
    ctaHref,
    links: (nav.links ?? []).filter((l) => !retired(l)).map((l) => item(l, 0)),
    sticky: nav.sticky ?? true,
    announcement: { ...DEFAULTS.navigation.announcement, ...(nav.announcement ?? {}) },
    footerColumns: (nav.footerColumns ?? DEFAULTS.navigation.footerColumns).map((c, i) => ({
      id: c.id || `c${i}`,
      title: String(c.title ?? ""),
      links: (c.links ?? []).filter((l) => !retired(l)).map((l) => item(l, 1)),
    })),
  };
}

export async function saveSetting<K extends SettingKey>(key: K, value: Settings[K]) {
  const json = JSON.stringify(value);
  await db.setting.upsert({ where: { key }, create: { key, value: json }, update: { value: json } });
  revalidateTag("settings");
}

/** Replaces {company} in editable text with the business name. */
export const fillCompany = (text: string) => text.replaceAll("{company}", site.name);

/** Business details for the public site: site.ts defaults overlaid with /admin/content edits. */
export async function getSite() {
  const { business } = await getSettings();
  return { ...site, ...business, phoneHref: `tel:+1${business.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")}` };
}

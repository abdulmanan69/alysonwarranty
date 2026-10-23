import Link from "next/link";
import { HomeQuoteForm } from "@/components/HomeQuoteForm";
import { ogMetadata } from "@/lib/og";
import { getSite } from "@/lib/settings";
import { jsonLd } from "@/lib/security";
import { site } from "@/lib/site";

export const metadata = {
  title: "Free Home Warranty Quote",
  description: "Get a free home warranty quote. Tell us about your home and our team will contact you with plan options and prices for systems, appliances or both. 30-day money-back guarantee.",
  alternates: { canonical: "/quote/home-warranty" },
  ...ogMetadata(
    {
      eyebrow: "Home warranty",
      title: "Get a free quote for your home",
      subtitle: "Systems, appliances or both. Free quote, 30-day money-back guarantee.",
      image: "/images/home-hvac-technician.webp",
    },
    { url: "/quote/home-warranty", title: `Home Warranty Quote | ${site.name}` },
  ),
};

export default async function HomeWarrantyQuotePage({ searchParams }: { searchParams: Promise<{ zip?: string }> }) {
  const [biz, { zip }] = await Promise.all([getSite(), searchParams]);
  const initialZip = /^\d{5}$/.test(zip ?? "") ? zip! : "";
  // Tells search engines what this page offers and who provides it.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": site.url + "/quote/home-warranty#service",
    category: "Home service contract (not insurance)",
    name: "Home warranty (home service contract) quotes",
    serviceType: "Home service contract",
    description: "Free quotes on home warranty plans that help pay to repair or replace home systems and appliances when they fail from normal wear. A home warranty is not insurance.",
    url: site.url + "/quote/home-warranty",
    provider: { "@id": site.url + "/#organization" },
    areaServed: { "@type": "Country", name: "United States" },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <HomeQuoteForm initialZip={initialZip} consentText={biz.homeConsentText} consentVersion={biz.homeConsentVersion} phone={biz.phone} phoneHref={biz.phoneHref} />

      {/* What searchers want to know before they request a quote. */}
      <section className="post-content mx-auto mt-14 max-w-3xl">
        <p>
          New to home warranties? Our <Link href="/home-warranty">home warranty guide</Link> explains what a plan covers, what it excludes and how a
          service call works.
        </p>

        <h2>How home warranty pricing works</h2>
        <p>
          A home warranty has two prices: a <strong>plan price</strong>, paid monthly or yearly, and a <strong>service call fee</strong> you pay each time a
          technician comes out. The plan price depends on the size and age of the home, whether you want systems, appliances or both, and the service call
          fee you choose. A higher service call fee lowers the plan price. Older homes and larger homes usually cost more to protect because their systems
          are more likely to fail.
        </p>

        <h2>Common plan levels</h2>
        <table>
          <thead><tr><th>Plan level</th><th>What it generally includes</th></tr></thead>
          <tbody>
            <tr><td>Systems</td><td>Heating, air conditioning, plumbing, electrical and the water heater, the repairs that cost the most</td></tr>
            <tr><td>Appliances</td><td>Refrigerator, oven and range, dishwasher, built-in microwave, washer and dryer</td></tr>
            <tr><td>Combo</td><td>Systems and appliances in one plan, usually at a lower price than buying both separately</td></tr>
          </tbody>
        </table>
        <p>The exact items, exclusions, coverage limits and service call fee are listed in each contract, so you can compare plans on what they actually include.</p>

        <h2>What happens after you request a quote</h2>
        <p>
          After you send the form, a member of our team calls you with plan options and prices for your home from the home service contract providers we
          work with, and explains each one in plain English. You review the full contract before you decide, and there is no obligation to buy. A home
          warranty is not insurance; it is an optional contract that may pay for eligible repairs depending on its terms.
        </p>

        <h2>30-day money-back guarantee</h2>
        <p>
          If you&apos;re not happy with your home warranty plan, you can cancel within 30 days of purchase and get a full refund, as long as no claims have
          been filed. After 30 days you can still cancel for a prorated refund, minus any claims paid and fees listed in your contract.
        </p>

        <h2>Frequently asked questions</h2>
        {FAQS.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

const FAQS = [
  {
    q: "How much does a home warranty cost?",
    a: "It depends on the size and age of your home, the plan level and the service call fee you choose. Plans are priced per year and many people pay monthly. Request a free quote and our team will give you prices for your home.",
  },
  {
    q: "Is a home warranty the same as homeowners insurance?",
    a: "No. Homeowners insurance pays for damage from events such as fire, storms and theft, and your mortgage lender usually requires it. A home warranty is optional and pays to repair or replace listed systems and appliances when they fail from normal wear and tear.",
  },
  {
    q: "Can I get a home warranty on an older home?",
    a: "Usually, yes. Most plans do not have an age limit on the home, as long as the systems and appliances are in working order when the plan starts. Some plans exclude problems that existed before the contract began.",
  },
  {
    q: "Do I have to buy after getting a quote?",
    a: "No. The quote is free with no obligation. You can review the provider's contract terms and decide later.",
  },
  {
    q: "Can I cancel and get my money back?",
    a: "Yes. Every home warranty plan we sell comes with a 30-day money-back guarantee: cancel within 30 days of purchase for a full refund, as long as no claims have been filed. After that, you can usually cancel for a prorated refund under the terms of your contract.",
  },
];

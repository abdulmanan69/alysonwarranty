import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, QuoteBanner } from "@/components/sections";
import { ogMetadata } from "@/lib/og";
import { HOME_DISCLOSURE } from "@/lib/products";
import { jsonLd } from "@/lib/security";
import { getSite } from "@/lib/settings";
import { site } from "@/lib/site";

// Pillar page for "home warranty": what it is, what the plans cover, what they exclude, how a
// service call works and what it costs. Blog posts on single topics link back here.

const title = "Home Warranty: Plans, Coverage and How It Works";
const description =
  "How a home warranty (home service contract) works, what systems and appliances plans cover, what's excluded, how a service call works and what to ask before you buy.";
const PATH = "/home-warranty";
const FTC_URL = "https://consumer.ftc.gov/consumer-alerts/2023/02/so-whats-deal-home-warranties";

export const metadata: Metadata = {
  title: { absolute: `Home Warranty Plans & Coverage | ${site.name}` },
  description,
  alternates: { canonical: PATH },
  ...ogMetadata(
    { eyebrow: "Home warranty", title: "Plans, coverage and how it works", subtitle: "Systems, appliances or both, for the breakdowns that cost the most.", image: "/images/cta-home.webp" },
    { url: PATH, title: `Home Warranty Guide | ${site.name}`, description },
  ),
};

const PLANS = [
  { name: "Systems plan", fit: "Owners of older homes, where heating, cooling and plumbing failures are the big bills", includes: ["Heating and furnace", "Air conditioning", "Plumbing and water heater", "Electrical system"] },
  { name: "Appliances plan", fit: "Homes with a full set of newer appliances past their manufacturer warranty", includes: ["Refrigerator", "Oven, range and cooktop", "Dishwasher and built-in microwave", "Washer and dryer"] },
  { name: "Combo plan", fit: "Most homeowners: one plan, one service call fee, everything above", includes: ["All systems items", "All appliance items", "Usually priced below two separate plans"] },
];

const FAQS = [
  {
    q: "Is a home warranty the same as homeowners insurance?",
    a: "No. Homeowners insurance pays for damage from events such as fire, storms and theft, and your mortgage lender usually requires it. A home warranty is optional and pays to repair or replace listed systems and appliances when they fail from normal wear and tear. The Federal Trade Commission describes a home warranty as a service contract, not a warranty.",
  },
  {
    q: "What does a home warranty cover?",
    a: "It depends on the plan. Systems plans cover heating, air conditioning, plumbing, electrical and the water heater; appliance plans cover the refrigerator, oven and range, dishwasher, washer and dryer; combo plans cover both. The contract lists the exact items, exclusions and coverage limits.",
  },
  {
    q: "What isn't covered by a home warranty?",
    a: "Pre-existing problems, damage from accidents, floods or improper installation, items that were not working when the plan started, cosmetic issues, and anything not listed in the contract. Most plans also cap how much they pay per item or per year.",
  },
  {
    q: "What is a service call fee?",
    a: "A fixed amount you pay each time a technician comes out for a covered item, similar to a deductible. Choosing a higher service call fee usually lowers the plan price.",
  },
  {
    q: "Can I buy a home warranty for a house I already own?",
    a: "Yes. You can buy a plan at any time, not only when buying a home, as long as the systems and appliances are in working order. Many plans have a short waiting period before coverage starts.",
  },
  {
    q: "Can I cancel a home warranty?",
    a: `Yes. Every plan ${site.name} sells comes with a 30-day money-back guarantee: cancel within 30 days of purchase for a full refund, as long as no claims have been filed. After that, you can usually cancel for a prorated refund under the terms of your contract.`,
  },
];

export default async function HomeWarrantyPage() {
  const biz = await getSite();
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}${PATH}#service`,
        name: "Home warranty (home service contract)",
        serviceType: "Home service contract",
        category: "Home service contract (not insurance)",
        description,
        url: `${site.url}${PATH}`,
        provider: { "@id": `${site.url}/#organization` },
        areaServed: { "@type": "Country", name: "United States" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <PageHero
        eyebrow="Home warranty"
        title={title}
        intro="A home warranty helps pay to repair or replace your heating, air conditioning, plumbing, electrical and appliances when they fail from normal wear. Here's how the plans differ, what they exclude and how a service call works."
        crumbs={[{ name: "Home warranty", href: PATH }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/quote/home-warranty" className="btn-primary bg-line text-asphalt hover:bg-[#E3B21F]">Get my free home quote</Link>
          <a href={biz.phoneHref} className="btn-secondary">Call {biz.phone}</a>
        </div>
      </PageHero>

      <section className="mx-auto max-w-4xl px-5 py-12">
        <div className="post-content">
          <p>
            <strong>
              A home warranty, legally called a home service contract, is an optional plan that pays to repair or replace the home systems and appliances
              it lists when they break down from normal use.
            </strong>{" "}
            You pay a plan price, monthly or yearly, and a service call fee each time a technician comes out. It is not homeowners insurance: insurance pays
            after fire, storms or theft, while a home warranty pays when the furnace, water heater or dishwasher simply wears out.
          </p>
          <p>
            {site.name} offers three plan levels backed and administered by established providers. You can{" "}
            <Link href="/quote/home-warranty">request a free quote for your home</Link> in a few minutes, and every plan comes with a 30-day money-back
            guarantee.
          </p>

          <h2>What is a home warranty?</h2>
          <p>
            The <a href={FTC_URL}>Federal Trade Commission</a> puts it plainly: a home warranty is really a service contract, and it costs extra. It
            typically applies to existing homes and covers repairs and replacements of items such as appliances and air conditioning systems. A builder&apos;s
            warranty on a newly built home is a different thing, covering the structure itself.
          </p>
          <p>
            The contract lists the items it covers, the limits it pays per item, the exclusions, the service call fee and how to request service. Those pages,
            not the brochure, decide what you get.
          </p>
          <img src="/images/home-warranty/hvac-heat-pump-unit.webp" alt="Heat pump unit installed outside a house" width={1280} height={960} loading="lazy" decoding="async" />
          <p className="text-sm"><em>Heating and cooling systems are the most expensive items in most homes and the reason many owners buy a systems plan. Photo: HarmvdB on Pixabay.</em></p>

          <h2>Home warranty plans compared</h2>
          <table>
            <thead><tr><th>Plan</th><th>What it covers</th><th>Good fit for</th></tr></thead>
            <tbody>
              {PLANS.map((p) => (
                <tr key={p.name}><td><strong>{p.name}</strong></td><td>{p.includes.join(", ")}</td><td>{p.fit}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm">Items vary by provider and plan. The contract&apos;s covered-items list and limits govern what is paid.</p>

          <h2>How much does a home warranty cost?</h2>
          <p>Two numbers make up the cost, and five things move them:</p>
          <ol>
            <li><strong>Plan level.</strong> Combo plans cost more than systems-only or appliances-only plans, but usually less than both bought separately.</li>
            <li><strong>Service call fee.</strong> The fee you pay per technician visit. Choosing a higher fee lowers the plan price.</li>
            <li><strong>Home size.</strong> Larger homes have more to cover and usually cost more.</li>
            <li><strong>Home age.</strong> Older systems fail more often, so older homes can cost more or have tighter limits.</li>
            <li><strong>Add-ons.</strong> Pools, spas, well pumps, septic systems and second refrigerators are usually optional extras.</li>
          </ol>
          <p>
            Our team gives you the exact price for your home. <Link href="/quote/home-warranty">Request a free quote</Link> and we will contact you with
            plan options and prices.
          </p>

          <h2>What a home warranty doesn&apos;t cover</h2>
          <p>The FTC advises checking four things before you buy: whether reimbursement is capped, whether accidental damage is covered, whether certain appliances or systems are excluded, and whether cancellation carries fees. In practice most contracts exclude:</p>
          <ul>
            <li>Problems that existed before the plan started, or items that were not working at the start</li>
            <li>Damage from accidents, floods, pests, misuse or improper installation</li>
            <li>Cosmetic issues and items outside the home, unless added as extras</li>
            <li>Costs above the per-item or per-year limit in the contract</li>
            <li>Code upgrades, permits and disposal fees, unless the contract includes them</li>
          </ul>
          <img src="/images/home-warranty/kitchen-appliances.webp" alt="Kitchen with built-in oven, microwave and refrigerator" width={1280} height={853} loading="lazy" decoding="async" />
          <p className="text-sm"><em>Appliance plans cover the kitchen and laundry items that fail most often as a home ages. Photo: shadowfirearts on Pixabay.</em></p>

          <h2>How a service call works</h2>
          <ol>
            <li><strong>Request service</strong> through the provider&apos;s phone line or portal. The FTC recommends also putting the request in writing.</li>
            <li><strong>A technician is assigned</strong> from the provider&apos;s network, usually within a few days.</li>
            <li><strong>Pay the service call fee</strong> when the technician visits.</li>
            <li><strong>The provider approves the repair or replacement</strong> under the contract&apos;s terms and limits, and pays the rest.</li>
          </ol>

          <h2>Questions to ask before you buy</h2>
          <p>
            Who administers the contract and pays claims? What is the per-item limit? Is there a waiting period? Can you choose your own technician? How do
            you cancel, and is there a fee? The FTC also warns that a home warranty is only as good as the company responsible for it, so check reviews and
            your state consumer protection office. We answer all of these on the call and send the full contract before you decide.
          </p>

          <h2>Our 30-day money-back guarantee</h2>
          <p>
            Every plan {site.name} sells comes with a 30-day money-back guarantee. If you change your mind, cancel within 30 days of purchase for a full refund,
            as long as no claims have been filed. After that, cancellation and any prorated refund follow the terms of your contract.
          </p>
          <p>
            Ready to see what a plan would cost for your home? <Link href="/quote/home-warranty">Get your free quote</Link> or call{" "}
            <a href={biz.phoneHref}>{biz.phone}</a>. Looking for your car instead? See our <Link href="/extended-car-warranty">auto warranty guide</Link>.
          </p>

          <h2>Frequently asked questions</h2>
          {FAQS.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <p className="text-sm">
            Last updated October 2026. {HOME_DISCLOSURE} Source: <a href={FTC_URL}>Federal Trade Commission</a>.
          </p>
        </div>
      </section>

      <QuoteBanner />
    </>
  );
}

import Link from "next/link";
import { PageHero } from "@/components/sections";
import { ogMetadata } from "@/lib/og";
import { HOME_DISCLOSURE, PRODUCTS, VSC_DISCLOSURE } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata = {
  title: "Get a Free Quote",
  description: "Choose your free quote: an auto warranty for your car's engine, transmission and more, or a home warranty for your home's systems and appliances.",
  alternates: { canonical: "/quote" },
  ...ogMetadata(
    { eyebrow: "Free quote", title: "Which quote do you need?", subtitle: "Auto warranty or home warranty." },
    { url: "/quote", title: `Get a Free Quote | ${site.name}` },
  ),
};

const CHOICES = [
  {
    eyebrow: PRODUCTS.vsc.label,
    title: "Protect your car from repair bills",
    body: "Pays for repairs when a listed part breaks down, such as the engine, transmission or air conditioning, after the factory warranty ends.",
    points: ["Plans from powertrain to complete", "Takes a few minutes", "30-day money-back guarantee"],
    href: PRODUCTS.vsc.quoteHref,
    cta: "Start auto warranty quote",
    photo: "/images/hero/hero-suv-sunset",
    alt: "SUV driving on a highway at sunset",
  },
  {
    eyebrow: PRODUCTS.home.label,
    title: "Protect your home's systems and appliances",
    body: "Pays to repair or replace listed items such as heating, air conditioning, plumbing, electrical and kitchen appliances when they fail from normal wear.",
    points: ["Systems, appliances or both", "Takes a few minutes", "30-day money-back guarantee"],
    href: PRODUCTS.home.quoteHref,
    cta: "Start home warranty quote",
    photo: "/images/hero/hero-house-florida",
    alt: "Single-story family house with a landscaped front yard",
  },
];

export default async function QuoteChooserPage({ searchParams }: { searchParams: Promise<{ zip?: string }> }) {
  const { zip } = await searchParams;
  const q = /^\d{5}$/.test(zip ?? "") ? `?zip=${zip}` : "";
  return (
    <>
      <PageHero title="Which quote do you need?" intro="We offer two separate products. Pick the one you're looking for; you can always come back for the other." crumbs={[{ name: "Get a quote", href: "/quote" }]} />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-2">
        {CHOICES.map((c) => (
          <div key={c.href} className="flex flex-col overflow-hidden rounded-2xl border border-rail bg-white shadow-[0_20px_50px_-30px_rgba(17,41,79,0.25)]">
            <img
              src={`${c.photo}-1024.webp`}
              srcSet={`${c.photo}-640.webp 640w, ${c.photo}-1024.webp 1024w`}
              sizes="(min-width: 768px) 560px, 100vw"
              alt={c.alt}
              width={1024}
              height={683}
              decoding="async"
              className="aspect-[16/7] w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sky">{c.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-extrabold">{c.title}</h2>
              <p className="mt-3 leading-relaxed text-road">{c.body}</p>
              <ul className="mb-7 mt-5 space-y-2 text-sm">
                {c.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5">
                    <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-sky/10 text-sky">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link href={c.href + q} className="btn-primary mt-auto inline-flex justify-center bg-line text-asphalt hover:bg-line-dark">{c.cta}</Link>
            </div>
          </div>
        ))}
      </section>
      <div className="mx-auto max-w-6xl space-y-2 px-5 pb-12 text-xs leading-relaxed text-road">
        <p>{VSC_DISCLOSURE}</p>
        <p>{HOME_DISCLOSURE}</p>
      </div>
    </>
  );
}

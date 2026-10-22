import { CustomerReviews } from "@/components/CustomerReviews";
import { HeroSlides } from "@/components/HeroSlides";
import { Reveal } from "@/components/Reveal";
import { FaqSection, QuoteBanner, RepairCostsSection, WhyChooseSection } from "@/components/sections";
import { HOME_DISCLOSURE, PRODUCTS, VSC_DISCLOSURE } from "@/lib/products";
import { fillCompany, getSettings, getSite } from "@/lib/settings";
import { site } from "@/lib/site";

const icon = (d: string) => (
  <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

// The two ways in. Each card goes straight to its own quote form.
const PATHS = [
  {
    key: "vsc" as const,
    icon: icon("M5 17h14M5 17l1.5-5h11L19 17M5 17v2M19 17v2M7 12l2-5h6l2 5"),
    title: "Auto warranty",
    body: "Engine, transmission, air conditioning and more, after your factory warranty ends.",
    points: ["Powertrain to complete plans", "Any licensed repair shop"],
    cta: "Get an auto quote",
  },
  {
    key: "home" as const,
    icon: icon("M3 11 12 3l9 8M5 10v10h14V10M10 20v-6h4v6"),
    title: "Home warranty",
    body: "Heating, air conditioning, plumbing, electrical and kitchen appliances when they fail.",
    points: ["Systems, appliances or both", "One service call fee per visit"],
    cta: "Get a home quote",
  },
];

export default async function Home() {
  const [{ content }, biz] = await Promise.all([getSettings(), getSite()]);
  // Editable in /admin/content. "{company}" becomes the business name.
  const faqs = content.faqs.map((f, i) => ({ q: fillCompany(f.q), a: fillCompany(f.a), call: i === 0 }));
  const reasons = content.reasons.map((r) => ({ title: fillCompany(r.title), body: fillCompany(r.body) }));

  return (
    <>
      <section className="relative isolate min-h-[590px] overflow-hidden bg-asphalt text-white sm:min-h-[620px]">
        <HeroSlides />
        <div aria-hidden className="absolute inset-0 -z-10 bg-asphalt/65" />
        <div className="mx-auto flex min-h-[590px] max-w-6xl items-center px-5 py-16 sm:min-h-[620px] md:py-20">
          <div className="w-full max-w-3xl">
            <p className="hero-rise mb-5 text-sm font-bold uppercase tracking-[0.14em] text-line">{fillCompany(content.hero.eyebrow)}</p>
            <h1 style={{ animationDelay: "80ms" }} className="hero-rise max-w-2xl text-4xl font-bold leading-[1.08] sm:text-5xl md:text-[3.5rem]">
              {fillCompany(content.hero.title)}
            </h1>
            <p className="hero-rise mt-5 max-w-xl text-lg leading-relaxed text-white/85" style={{ animationDelay: "160ms" }}>
              {fillCompany(content.hero.subtitle)}
            </p>
            {/* Two products, two doors: each card opens its own quote form. */}
            <div className="hero-rise mt-8 grid gap-4 sm:grid-cols-2" style={{ animationDelay: "240ms" }}>
              {PATHS.map((p) => (
                <a key={p.key} href={PRODUCTS[p.key].quoteHref} className="group rounded-2xl bg-white/95 p-5 text-asphalt shadow-[0_20px_50px_-24px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5 hover:bg-white">
                  <span className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-asphalt text-line">{p.icon}</span>
                    <span className="text-xl font-extrabold">{p.title}</span>
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-road">{p.body}</p>
                  <ul className="mt-3 space-y-1 text-sm text-road">
                    {p.points.map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <span aria-hidden className="grid h-4 w-4 place-items-center rounded-full bg-sky/10 text-sky">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-line px-4 py-2.5 text-sm font-bold text-asphalt transition group-hover:bg-[#E3B21F]">
                    {p.cta}
                    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </a>
              ))}
            </div>
            <div className="hero-rise mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/90" style={{ animationDelay: "320ms" }}>
              <span>Free quotes, no obligation</span>
              <span>30-day money-back guarantee</span>
              <span>Secure, private quote requests</span>
            </div>
          </div>
        </div>
        <div aria-hidden className="lane lane-move h-2.5 w-full" />
      </section>

      <RepairCostsSection costs={content.repairCosts} />

      {/* Auto warranty */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 text-center md:grid-cols-[1fr_1.15fr] md:gap-12 md:py-16 md:text-left">
          <Reveal className="md:order-1">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sky">{PRODUCTS.vsc.label}</p>
            <h2 className="mx-auto mt-2 max-w-md text-3xl font-extrabold leading-tight sm:text-4xl md:mx-0">
              Could You Afford A $3,000 Auto Repair Bill Today?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-road md:mx-0">
              An auto warranty through {site.name} can help protect your budget from expensive car repair surprises. Our team shows you plan options and prices for your car, backed by a 30-day money-back guarantee.
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-road/80 md:mx-0">*A deductible may apply. {VSC_DISCLOSURE}</p>
            <a href={PRODUCTS.vsc.quoteHref} className="btn-primary mt-7 inline-flex bg-line uppercase tracking-wide text-asphalt hover:bg-[#E3B21F]">
              Get my free auto quote
            </a>
            <a href={PRODUCTS.vsc.guideHref} className="mt-4 block text-sm font-semibold text-sky hover:underline md:inline-block md:ml-5 md:mt-0">
              How auto plans work →
            </a>
          </Reveal>
          <Reveal from="pop" delay={150} className="order-first md:order-2">
            <img src="/images/cta-car.webp" alt="" aria-hidden="true" width={1200} height={831} loading="lazy" decoding="async" className="mx-auto block h-auto w-full max-w-md md:max-w-none" />
          </Reveal>
        </div>
      </section>

      {/* Home warranty */}
      <section className="bg-mist">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 text-center md:grid-cols-[1.15fr_1fr] md:gap-12 md:py-16 md:text-left">
          <Reveal from="pop" delay={150} className="order-first">
            <img src="/images/cta-home.webp" alt="" aria-hidden="true" width={1200} height={831} loading="lazy" decoding="async" className="mx-auto block h-auto w-full max-w-md rounded-[2rem] object-cover md:max-w-none" />
          </Reveal>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sky">{PRODUCTS.home.label}</p>
            <h2 className="mx-auto mt-2 max-w-md text-3xl font-extrabold leading-tight sm:text-4xl md:mx-0">
              When The Air Conditioner Quits In July, Who Pays?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-road md:mx-0">
              A home warranty through {site.name} helps pay to repair or replace your heating, air conditioning, plumbing, electrical and kitchen appliances when they fail from normal wear. One service call fee per visit, and our team explains every plan in plain English.
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-road/80 md:mx-0">{HOME_DISCLOSURE}</p>
            <a href={PRODUCTS.home.quoteHref} className="btn-primary mt-7 inline-flex bg-line uppercase tracking-wide text-asphalt hover:bg-[#E3B21F]">
              Get my free home quote
            </a>
            <a href={PRODUCTS.home.guideHref} className="mt-4 block text-sm font-semibold text-sky hover:underline md:inline-block md:ml-5 md:mt-0">
              How home plans work →
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 pb-14 pt-6 md:pb-20 md:pt-24">
        <div className="relative mx-auto grid max-w-6xl items-center gap-6 overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#0B2F5B_0%,#1F5FAD_55%,#3D8FDB_100%)] px-6 pb-10 pt-8 text-center text-white md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:overflow-visible md:px-12 md:py-14 md:text-left">
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.18),transparent_45%)]" />
          <Reveal from="left" className="relative md:-my-28">
            <img
              src="/images/reviews-phone.webp"
              alt={`Customer reviews of ${site.name} shown on a phone.`}
              width={663}
              height={1013}
              loading="lazy"
              decoding="async"
              className="mx-auto block h-auto w-56 cursor-pointer drop-shadow-2xl transition duration-500 ease-out hover:-translate-y-4 hover:-rotate-2 hover:scale-105 hover:drop-shadow-[0_35px_45px_rgba(0,0,0,0.45)] sm:w-64 md:w-full md:max-w-[360px]"
            />
          </Reveal>
          <Reveal delay={200} className="relative">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Our Reputation Speaks for Itself</h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-white/85 md:mx-0">
              Drivers and homeowners choose {site.name} for honest answers, fair prices and people who actually pick up the phone.
            </p>
            {site.reviewSources.length > 0 && (
              <ul className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-6 md:justify-start">
                {site.reviewSources.map((r) => {
                  const badge = (
                    <>
                      <span className="flex items-center gap-3">
                        <span className="grid h-14 min-w-14 place-items-center rounded-lg bg-white px-2 text-3xl font-semibold text-sky">{r.score}</span>
                        <span className="text-lg font-bold">{r.source}</span>
                      </span>
                      <span className="mt-2 block text-sm text-white/80">{r.count}</span>
                    </>
                  );
                  return (
                    <li key={r.source}>
                      {r.href ? (
                        <a href={r.href} target="_blank" rel="noreferrer" className="block hover:opacity-90">{badge}</a>
                      ) : (
                        badge
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            <a href="/quote" className="btn-primary mt-8 inline-flex bg-line uppercase tracking-wide text-asphalt hover:bg-[#E3B21F]">
              Get a free quote
            </a>
          </Reveal>
        </div>
      </section>

      <WhyChooseSection intro={content.whyIntro} reasons={reasons} />

      <CustomerReviews />

      <FaqSection faqs={faqs} phone={biz.phone} phoneHref={biz.phoneHref} />

      <QuoteBanner />
    </>
  );
}

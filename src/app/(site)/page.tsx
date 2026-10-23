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

/** Product section photo: rounded, with a tinted card offset behind it and a small label on top. */
function ProductPhoto({ src, alt, tint, badge, badgeIcon, left = false }: { src: string; alt: string; tint: string; badge: string; badgeIcon: string; left?: boolean }) {
  return (
    <div className="relative mx-auto max-w-md md:max-w-none">
      <div aria-hidden className={`absolute inset-0 rounded-[2rem] ${tint} ${left ? "-translate-x-3 translate-y-3 md:-translate-x-5 md:translate-y-5" : "translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5"}`} />
      <img src={src} alt={alt} width={1200} height={900} loading="lazy" decoding="async" className="relative block aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[0_24px_60px_-28px_rgba(17,41,79,0.45)]" />
      <span className={`absolute -bottom-4 flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-asphalt shadow-[0_12px_30px_rgba(17,41,79,0.18)] ${left ? "right-4 sm:right-6" : "left-4 sm:left-6"}`}>
        <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-navy text-line">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={badgeIcon} /></svg>
        </span>
        {badge}
      </span>
    </div>
  );
}

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
      <section className="relative isolate min-h-[590px] overflow-hidden bg-[radial-gradient(circle_at_12%_18%,rgba(40,100,180,0.45),transparent_55%),linear-gradient(135deg,#11294F_0%,#173B73_100%)] text-white sm:min-h-[620px]">
        <HeroSlides />
        {/* Deep blue wash over the photo behind the text (phones and tablets only; on large screens
            the photo sits to the right of the text). */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(17,41,79,0.84)_0%,rgba(17,41,79,0.7)_55%,rgba(17,41,79,0.55)_100%)] lg:hidden" />
        <div className="mx-auto flex min-h-[590px] max-w-6xl items-center px-5 py-16 sm:min-h-[620px] md:py-20">
          <div className="w-full max-w-3xl lg:max-w-[540px] xl:max-w-[600px]">
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
                  <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-line px-4 py-2.5 text-sm font-bold text-asphalt transition group-hover:bg-line-dark">
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
            <a href={PRODUCTS.vsc.quoteHref} className="btn-primary mt-7 inline-flex bg-line uppercase tracking-wide text-asphalt hover:bg-line-dark">
              Get my free auto quote
            </a>
            <a href={PRODUCTS.vsc.guideHref} className="mt-4 block text-sm font-semibold text-sky hover:underline md:inline-block md:ml-5 md:mt-0">
              How auto plans work →
            </a>
          </Reveal>
          <Reveal from="pop" delay={150} className="order-first md:order-2">
            <ProductPhoto
              src="/images/auto-mechanic-tablet.webp"
              alt="Mechanic checking a car engine with a diagnostic tablet"
              tint="bg-sky/15"
              badge="Use any licensed repair shop"
              badgeIcon="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"
            />
          </Reveal>
        </div>
      </section>

      {/* Home warranty */}
      <section className="bg-mist">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 text-center md:grid-cols-[1.15fr_1fr] md:gap-12 md:py-16 md:text-left">
          <Reveal from="pop" delay={150} className="order-first">
            <ProductPhoto
              src="/images/home-hvac-technician.webp"
              alt="Technician inspecting a home's outdoor air conditioning unit"
              tint="bg-line/20"
              badge="One service call fee per visit"
              badgeIcon="M3 11 12 3l9 8M5 10v10h14V10M10 20v-6h4v6"
              left
            />
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
            <a href={PRODUCTS.home.quoteHref} className="btn-primary mt-7 inline-flex bg-line uppercase tracking-wide text-asphalt hover:bg-line-dark">
              Get my free home quote
            </a>
            <a href={PRODUCTS.home.guideHref} className="mt-4 block text-sm font-semibold text-sky hover:underline md:inline-block md:ml-5 md:mt-0">
              How home plans work →
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 pb-14 pt-6 md:pb-20 md:pt-24">
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#11294F_0%,#173B73_45%,#2864B4_100%)] px-6 pb-10 pt-8 text-center text-white md:grid-cols-[0.95fr_1.05fr] md:gap-12 md:overflow-visible md:px-12 md:py-14 md:text-left">
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.16),transparent_45%)]" />
          <Reveal from="left" className="relative md:-my-24">
            <div className="relative mx-auto max-w-sm md:max-w-none">
              <img
                src="/images/customer-on-phone.webp"
                alt="Smiling homeowner on a phone call at her kitchen table"
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="block aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] ring-4 ring-white/15 transition duration-500 ease-out hover:-translate-y-2 hover:-rotate-1"
              />
              <span className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-asphalt shadow-[0_12px_30px_rgba(16,24,40,0.25)] md:left-6 md:translate-x-0">
                <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-line text-asphalt">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
                </span>
                Real people pick up the phone
              </span>
            </div>
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
            <a href="/quote" className="btn-primary mt-8 inline-flex bg-line uppercase tracking-wide text-asphalt hover:bg-line-dark">
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

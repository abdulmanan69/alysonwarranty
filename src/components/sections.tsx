import Link from "next/link";
import type { ReactNode } from "react";
import { RepairCostDiagram } from "@/components/RepairCostDiagram";
import { Reveal } from "@/components/Reveal";
import { WhyChooseCarousel } from "@/components/WhyChooseCarousel";
import { PRODUCTS, VSC_DISCLOSURE } from "@/lib/products";
import { jsonLd } from "@/lib/security";
import { fillCompany, type ContentSettings } from "@/lib/settings";
import { site } from "@/lib/site";

// Page sections shared by the home page and their own pages (/repair-costs, /why-us, /faq).
// On the home page each section has an H2 heading; on its own page the PageHero carries the
// H1 and the section is shown without a heading (`bare`).

type Crumb = { name: string; href: string };

/** Top of an inner page: breadcrumbs, H1 and intro. Adds breadcrumb data for Google. */
export function PageHero({ eyebrow, title, intro, crumbs = [], children, media }: { eyebrow?: string; title: string; intro?: ReactNode; crumbs?: Crumb[]; children?: ReactNode; media?: ReactNode }) {
  const trail = [{ name: "Home", href: "/" }, ...crumbs];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${site.url}${c.href === "/" ? "" : c.href}` })),
  };
  return (
    <section className="border-b border-rail bg-[linear-gradient(180deg,#F5F8FC_0%,#FFFFFF_100%)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <div className={`mx-auto max-w-6xl px-5 pb-12 pt-10 md:pb-14 md:pt-14 ${media ? "grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14" : ""}`}>
        <div>
        <nav aria-label="Breadcrumb" className="text-sm text-road">
          <ol className="flex flex-wrap items-center gap-1.5">
            {trail.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i < trail.length - 1 ? <Link href={c.href} className="hover:text-sky">{c.name}</Link> : <span aria-current="page" className="text-asphalt">{c.name}</span>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-sky">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-2" : "mt-6"} max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-asphalt sm:text-5xl`}>{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-road">{intro}</p>}
        {children}
        </div>
        {media}
      </div>
    </section>
  );
}

/** Photo for a PageHero's `media`: a soft blue and orange glow behind a rounded picture.
 *  `base` is the file path without the "-640.webp" size suffix. Labels go in `children`. */
export function PageHeroPhoto({ base, alt, children }: { base: string; alt: string; children?: ReactNode }) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-4 rounded-[36px] bg-[radial-gradient(circle_at_20%_20%,rgba(40,100,180,0.2),transparent_55%),radial-gradient(circle_at_85%_90%,rgba(242,140,40,0.3),transparent_50%)] blur-2xl" />
      <picture>
        <source type="image/webp" srcSet={`${base}-640.webp 640w, ${base}-1024.webp 1024w, ${base}-1600.webp 1600w`} sizes="(min-width: 1024px) 560px, 100vw" />
        <img src={`${base}-1024.webp`} alt={alt} width={1600} height={1067} fetchPriority="high" decoding="async" className="relative aspect-[3/2] w-full rounded-[28px] object-cover shadow-[0_24px_60px_rgba(16,24,40,0.18)]" />
      </picture>
      {children}
    </div>
  );
}

const CHIP_CORNERS = {
  "top-left": "-left-2 top-6 sm:-left-5",
  "top-right": "-right-2 top-6 sm:-right-5",
  "bottom-left": "-left-2 bottom-6 sm:-left-5",
  "bottom-right": "-right-2 bottom-6 sm:-right-5",
};

/** White label pinned to the corner of a PageHeroPhoto. Top labels get an orange icon, bottom ones a blue one. */
export function PhotoChip({ icon, corner, children }: { icon: string; corner: keyof typeof CHIP_CORNERS; children: ReactNode }) {
  return (
    <span className={`absolute flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-asphalt shadow-[0_12px_30px_rgba(16,24,40,0.14)] ${CHIP_CORNERS[corner]}`}>
      <span aria-hidden className={`grid h-7 w-7 place-items-center rounded-full ${corner.startsWith("top") ? "bg-line text-asphalt" : "bg-navy text-line"}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
      </span>
      {children}
    </span>
  );
}

export function RepairCostsSection({ costs, bare = false }: { costs: ContentSettings["repairCosts"]; bare?: boolean }) {
  return (
    <section id="repair-costs" className="scroll-mt-6 bg-white text-asphalt">
      <div className="mx-auto max-w-6xl px-5 py-14 text-center md:py-16">
        {!bare && (
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sky">{PRODUCTS.vsc.label}</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">What Would Your Next Repair Cost?</h2>
            <p className="mt-4 text-lg leading-relaxed text-road">Select any part of the car below to see what a typical repair costs out of pocket, without a service contract.</p>
          </div>
        )}
        <RepairCostDiagram costs={costs} />
        <p className="mx-auto mt-6 max-w-4xl text-xs leading-relaxed text-road/80 sm:text-sm">
          Estimated auto repair costs based on ConsumerAffairs data (
          <a href="https://www.consumeraffairs.com/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-sky">
            www.consumeraffairs.com
          </a>
          ). Costs shown are estimates only and may vary by vehicle, location, and repair facility. {VSC_DISCLOSURE}
        </p>
      </div>
    </section>
  );
}

export function WhyChooseSection({ intro, reasons, bare = false }: { intro: string; reasons: { title: string; body: string }[]; bare?: boolean }) {
  return (
    <section id="why-choose" className="scroll-mt-6 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        {!bare && (
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sky">Auto &amp; home warranty</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">Why Choose {site.name}</h2>
            <p className="mt-5 text-lg leading-relaxed text-road">{fillCompany(intro)}</p>
          </Reveal>
        )}
        <WhyChooseCarousel reasons={reasons} />
      </div>
    </section>
  );
}

export type Faq = { q: string; a: string; call?: boolean };

/**
 * FAQ list (the editable FAQs are about vehicle service contracts, so the call to action is that
 * quote). `withSchema` adds FAQ data for Google; use it on one page only (/faq).
 */
export function FaqSection({ faqs, phone, phoneHref, bare = false, withSchema = false, title = "Auto & Home Warranty FAQ" }: { faqs: Faq[]; phone: string; phoneHref: string; bare?: boolean; withSchema?: boolean; title?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const list = (
    <div className="divide-y divide-rail border-y border-rail">
      {faqs.map((f) => (
        <details key={f.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
            {f.q}
            <span aria-hidden className="text-xl text-road transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-2 max-w-prose leading-relaxed text-road">
            {f.a}
            {f.call && (
              <>
                {" "}
                Call <a href={phoneHref} className="font-semibold text-sky underline-offset-2 hover:underline">{phone}</a> for more details.
              </>
            )}
          </p>
        </details>
      ))}
    </div>
  );
  return (
    <section id="faq" className="scroll-mt-6 bg-white">
      {withSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />}
      <div className={`mx-auto grid max-w-6xl gap-10 px-5 ${bare ? "py-12 md:grid-cols-[1.6fr_1fr]" : "pb-16 pt-4 md:grid-cols-[1fr_1.4fr] md:pb-20 md:pt-6"}`}>
        {bare ? (
          <>
            {list}
            <aside className="h-fit rounded-2xl border border-rail p-6">
              <p className="text-lg font-bold">Still have a question?</p>
              <p className="mt-2 leading-relaxed text-road">
                Call <a href={phoneHref} className="font-semibold text-sky underline-offset-2 hover:underline">{phone}</a> and our team will help.
              </p>
              <Link href={PRODUCTS.vsc.quoteHref} className="btn-primary mt-5 inline-flex bg-line uppercase tracking-wide text-asphalt hover:bg-line-dark">Get my free quote</Link>
            </aside>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
              <p className="mt-3 max-w-sm leading-relaxed text-road">
                Still unsure? Call <a href={phoneHref} className="font-semibold text-sky underline-offset-2 hover:underline">{phone}</a> and our team will help.
              </p>
              <a href={PRODUCTS.vsc.quoteHref} className="btn-primary mt-6 inline-flex bg-line uppercase tracking-wide text-asphalt hover:bg-line-dark">Get my free quote</a>
            </div>
            {list}
          </>
        )}
      </div>
    </section>
  );
}

/** Blue quote box at the bottom of most pages: one button per product. */
export function QuoteBanner() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-4">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#11294F_0%,#173B73_45%,#2864B4_100%)] px-6 pb-14 pt-10 text-white sm:px-12 md:pb-16 md:pt-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.18),transparent_45%)]" />
        <div className="relative grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-line">Auto & home warranty · Free · No obligation</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              See what a plan for your car or home costs.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/85">
              Answer a few quick questions and our team will contact you with plan options and prices, backed by a 30-day money-back
              guarantee.
            </p>
          </div>
          <div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={PRODUCTS.vsc.quoteHref} className="btn-primary flex-1 justify-center bg-line text-asphalt hover:bg-line-dark">Auto warranty quote</Link>
              <Link href={PRODUCTS.home.quoteHref} className="btn-primary flex-1 justify-center bg-line text-asphalt hover:bg-line-dark">Home warranty quote</Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
              {["Takes a few minutes", "Free, no obligation", "30-day money-back guarantee"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-line">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div aria-hidden className="lane absolute inset-x-0 bottom-0 h-2" />
      </Reveal>
    </section>
  );
}

import type { Metadata } from "next";
import { FaqSection, PageHero, QuoteBanner } from "@/components/sections";
import { ogMetadata } from "@/lib/og";
import { fillCompany, getSettings, getSite } from "@/lib/settings";
import { site } from "@/lib/site";

const title = "Auto & Home Warranty FAQ";
const description = "Auto warranty and home warranty questions answered: what each plan includes, what it costs, who qualifies and how cancellation works.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq" },
  ...ogMetadata({ eyebrow: "FAQ", title, subtitle: description }, { url: "/faq", title: `${title} | ${site.name}`, description }),
};

export default async function FaqPage() {
  const [{ content }, biz] = await Promise.all([getSettings(), getSite()]);
  const faqs = content.faqs.map((f, i) => ({ q: fillCompany(f.q), a: fillCompany(f.a), call: i === 0 }));
  return (
    <>
      <PageHero eyebrow="FAQ" title={title} intro="Quick answers about auto warranties (vehicle service contracts) and home warranties (home service contracts): what they include, what they cost and how they work." crumbs={[{ name: "FAQ", href: "/faq" }]} />
      <FaqSection faqs={faqs} phone={biz.phone} phoneHref={biz.phoneHref} bare withSchema />
      <QuoteBanner />
    </>
  );
}

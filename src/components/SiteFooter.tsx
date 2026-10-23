import Link from "next/link";
import { HOME_DISCLOSURE, VSC_DISCLOSURE } from "@/lib/products";
import { getSettings, getSite } from "@/lib/settings";
import { site } from "@/lib/site";

const COLS: Record<number, string> = { 1: "sm:grid-cols-2", 2: "sm:grid-cols-3", 3: "sm:grid-cols-4", 4: "sm:grid-cols-3 lg:grid-cols-5" };

// Link columns come from /admin/menus; the Contact column is added from the business details.
export async function SiteFooter() {
  const [s, { navigation: nav }] = await Promise.all([getSite(), getSettings()]);
  const columns = [
    ...nav.footerColumns.map((c) => ({ id: c.id, heading: c.title, links: c.links })),
    {
      id: "contact",
      heading: "Contact",
      links: [
        { id: "phone", label: s.phone, href: s.phoneHref },
        { id: "email", label: s.email, href: `mailto:${s.email}` },
      ],
    },
  ];
  return (
    <footer className="mt-24 overflow-hidden bg-navy text-white">
      <div aria-hidden className="h-1.5 bg-[linear-gradient(90deg,#F28C28_0%,#F28C28_33%,#2864B4_33%,#2864B4_100%)]" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-14 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
        <div className="max-w-sm space-y-3 text-[13px] leading-relaxed text-white/70">
          <Link href="/" aria-label={`${site.name} home`} className="mb-5 inline-block">
            <img src="/brand/alyson-logo-light.webp" alt={site.name} width={456} height={139} loading="lazy" decoding="async" className="h-12 w-auto" />
          </Link>
          <p>{s.licenseNote}</p>
          <p>{VSC_DISCLOSURE}</p>
          <p>{HOME_DISCLOSURE}</p>
          <p>
            © {new Date().getFullYear()} {s.agencyLegalName}. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer" className={`grid grid-cols-2 gap-x-6 gap-y-10 ${COLS[Math.min(4, nav.footerColumns.length)] ?? "sm:grid-cols-2"}`}>
          {columns.map((col) => (
            <div key={col.id} className={col.id === "contact" ? "col-span-2 sm:col-span-1" : undefined}>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-line">{col.heading}</p>
              <ul className="mt-3 space-y-2 text-[15px] text-white/85">
                {col.links.map((l) => {
                  const ext = /^https?:\/\//.test(l.href) || ("newTab" in l && l.newTab);
                  return (
                    <li key={l.id}>
                      <Link href={l.href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="break-words transition hover:text-white hover:underline hover:underline-offset-4">
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Wordmark stretched to the full width with SVG so it scales with the screen. */}
      <div aria-hidden className="mx-auto mt-14 max-w-[1600px] px-5 pb-6 sm:pb-8">
        <svg viewBox="0 0 1000 96" className="block h-auto w-full text-white/[0.07]">
          <text x="0" y="86" textLength="1000" lengthAdjust="spacing" fontSize="92" fontWeight="800" fill="currentColor">
            {site.name.toUpperCase()}
          </text>
        </svg>
      </div>

      <p className="pb-4 text-center text-[11px] text-white/40">
        Developed by{" "}
        <a href="https://github.com/abdulmanan69" target="_blank" rel="noopener noreferrer" className="transition hover:text-white/80 hover:underline">
          abdulmanan69
        </a>
      </p>
    </footer>
  );
}

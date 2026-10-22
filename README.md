# Alyson Warranty

The website and admin dashboard for alysonwarranty.com. It sells two products, kept apart
everywhere in the code and the data:

- **Auto warranty** (legally a vehicle service contract): `Lead.line = "vsc"`, 6-step quote form at
  `/quote/auto-warranty`, guide at `/extended-car-warranty`.
- **Home warranty** (legally a home service contract): `Lead.line = "home"`, 4-step quote form at
  `/quote/home-warranty`, guide at `/home-warranty`.

Neither product is insurance, and the copy never calls it that. Quotes end on a thank-you page
with no prices; the team calls the person with plan options.

Built with Next.js 15, TypeScript, Tailwind CSS, Prisma (PostgreSQL), React Hook Form and Zod.

## What's included

- Home page with both products, repair-cost section, why-us, FAQ and reviews (hidden until real
  reviews are added in `src/lib/site.ts`)
- `/quote` chooser, then one multi-step form per product with validation on every step (client
  and server), saved progress, ZIP → state detection and live vehicle models from the NHTSA API
- TCPA consent capture per product: exact text, version, IP, user agent, page URL, time
- TrustedForm hook, UTM / gclid / fbclid tracking, duplicate protection (24 hours)
- Admin dashboard (`/admin`): leads with product filter, lead detail (vehicle or property card,
  consent proof, history, status), CSV export, settings (business details, both consent texts),
  menus, legal pages, homepage content, blog, pages, health check
- Blog with categories, drafts and review flow, plus a REST API (`/api/blog-api/v1`, Bearer key)
  and the `scripts/blog-api.mjs` CLI for posts, uploads, menus, legal pages and homepage content
- SEO: per-page metadata, Organization / Service / FAQ schema, sitemap, `llms.txt`, IndexNow key,
  share images
- Audit log of every important action

## Run it locally

Requires Node.js 20 or newer and Docker (for the local PostgreSQL database).

```bash
npm install
cp .env.example .env        # then edit ADMIN_PASSWORD and OG_SECRET
npm run db:up               # starts PostgreSQL on 127.0.0.1:5434
npm run db:deploy           # creates the tables
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the dashboard
(login from `ADMIN_USER` / `ADMIN_PASSWORD`).

**Production:** see [DEPLOY.md](DEPLOY.md) (Docker Compose on Coolify: app + PostgreSQL + backups).

## Where things are

```
prisma/schema.prisma                     Database tables (Lead, Vehicle, Property, Consent, ...)
src/lib/site.ts                          Business name, phone, email, footer note, CONSENT TEXTS
src/lib/products.ts                      The two products and their disclosures
src/lib/settings.ts                      Editable defaults (menus, homepage content, legal, SEO)
src/lib/validation.ts                    All form rules (shared client + server)
src/lib/legal-templates.ts               Starting Privacy Policy and Terms of Use
src/components/VscQuoteForm.tsx          Auto warranty form
src/components/HomeQuoteForm.tsx         Home warranty form
src/app/api/vsc-leads/route.ts           Saves auto warranty submissions
src/app/api/home-leads/route.ts          Saves home warranty submissions
src/app/(site)/extended-car-warranty/    Auto warranty guide (pillar page)
src/app/(site)/home-warranty/            Home warranty guide (pillar page)
src/app/admin/                           Dashboard
src/app/api/blog-api/v1/                 Blog and settings API
scripts/blog-api.mjs                     CLI for the API
```

## Must be done by the client (not code)

- **Phone number and email** in Admin → Settings (the code ships with placeholders).
- **Consent texts** for both forms from their lawyer (TCPA). The version changes automatically
  whenever a text is saved, so every lead records exactly what it agreed to.
- **Privacy Policy and Terms of Use** reviewed by a lawyer, then marked approved in
  Admin → Legal & privacy.
- **30-day money-back guarantee** wording confirmed with each service contract provider.
- **Footer note** describing the business, kept accurate for every state it sells in.

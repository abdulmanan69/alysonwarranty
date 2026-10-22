import { after, NextRequest, NextResponse } from "next/server";
import { audit } from "@/lib/audit";
import { db } from "@/lib/db";
import { contactFlags, readLeadRequest, recentHomeDuplicate } from "@/lib/lead-intake";
import { notifyLead } from "@/lib/notify";
import { getSettings, getSite } from "@/lib/settings";
import { digitsOnly, homeSubmissionSchema } from "@/lib/validation";

export const runtime = "nodejs";

// Home warranty quote requests, saved as Lead.line = "home" with a Property row. The visitor
// then sees a thank-you page (/quote/results/[id]) and the team calls with plan options and prices.
export async function POST(req: NextRequest) {
  const request = await readLeadRequest(req);
  if (request instanceof NextResponse) return request;
  const { body, ip } = request;

  const parsed = homeSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
  }
  const { form, tracking, trustedFormCertUrl, pageUrl, consentVersion, website } = parsed.data;
  // Hidden "website" field: people never see it, bots fill it in.
  if (website) return NextResponse.json({ error: "Validation failed" }, { status: 422 });

  // Consent text comes from the server config, never from the browser.
  const site = await getSite();
  if (consentVersion !== site.homeConsentVersion) {
    return NextResponse.json({ error: "Consent version mismatch. Please reload the page." }, { status: 409 });
  }

  const userAgent = req.headers.get("user-agent") ?? "unknown";
  const phone = digitsOnly(form.phone).replace(/^1(?=\d{10}$)/, "");
  const email = form.email.toLowerCase();

  const existing = await recentHomeDuplicate(phone, email, form.zip);
  if (existing) {
    await audit("api", "duplicate_submission", "lead", existing);
    return NextResponse.json({ id: existing, duplicate: true });
  }

  const { legal } = await getSettings();
  const { doNotContact, doNotSell } = await contactFlags(email, phone, legal.honorGpc);

  const lead = await db.lead.create({
    data: {
      line: "home",
      firstName: form.firstName,
      lastName: form.lastName,
      email,
      phone,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      coverageLevel: form.planInterest, // the plan level the person is most interested in
      ...tracking,
      ipAddress: ip,
      userAgent,
      doNotContact,
      doNotSell,
      trustedFormCertUrl: trustedFormCertUrl || null,
      properties: {
        create: {
          homeType: form.homeType,
          squareFeet: Number(form.squareFeet),
          yearBuilt: Number(form.yearBuilt),
          ownership: form.ownership,
          existingWarranty: form.existingWarranty,
        },
      },
      consent: {
        create: { consentText: site.homeConsentText, consentVersion: site.homeConsentVersion, ipAddress: ip, userAgent, pageUrl },
      },
    },
  });

  await audit("api", "lead_created", "lead", lead.id, { line: "home", state: lead.state, source: lead.utmSource });
  after(() => notifyLead(lead.id));
  return NextResponse.json({ id: lead.id });
}

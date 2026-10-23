"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HOME_DISCLOSURE } from "@/lib/products";
import { STATES, stateFromZip } from "@/lib/states";
import { HOME_STEP_FIELDS, homeFormSchema, type HomeFormValues, type HomeStepKey } from "@/lib/validation";
import { readTracking } from "./TrackingCapture";
import { TrustedForm } from "./TrustedForm";

// Home warranty quote, one short step at a time: where the home is, the property, what to
// protect, then contact details. It ends on /quote/results/[id], a thank-you page; the team
// calls with plan options and prices.

const STEPS: { key: HomeStepKey; label: string; title: string; subtitle: string }[] = [
  { key: "location", label: "Location", title: "Where is the home?", subtitle: "Plans and prices vary by state, so we start with your ZIP code." },
  { key: "property", label: "Property", title: "Tell us about the home", subtitle: "The type, size and age of the home decide which plans fit and what they cost." },
  { key: "coverage", label: "Coverage", title: "What do you want to protect?", subtitle: "Systems such as heating, air conditioning, plumbing and electrical, appliances, or both." },
  { key: "contact", label: "Contact", title: "How can we reach you?", subtitle: "A member of our team will contact you soon with plan options and prices for your home." },
];

const DRAFT_KEY = "home_quote";

// Anonymous drop-off tracking for the admin Reports page: a random per-tab ID and a step number.
function trackStep(step: number) {
  try {
    let sid = sessionStorage.getItem("aq_funnel");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("aq_funnel", sid);
    }
    const body = new Blob([JSON.stringify({ sid, step })], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/funnel", body)) fetch("/api/funnel", { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {
    // Tracking must never get in the way of the form.
  }
}

type Props = { initialZip?: string; consentText: string; consentVersion: string; phone: string; phoneHref: string };

export function HomeQuoteForm({ initialZip = "", consentText, consentVersion, phone, phoneHref }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HomeFormValues>({
    resolver: zodResolver(homeFormSchema),
    mode: "onTouched",
    defaultValues: { zip: initialZip, state: stateFromZip(initialZip) ?? "" } as Partial<HomeFormValues>,
  });

  // Restore an unfinished form (never restores consent).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved?.values) {
        reset({ ...saved.values, consent: undefined, ...(initialZip ? { zip: initialZip, state: stateFromZip(initialZip) ?? saved.values.state } : {}) });
        if (typeof saved.step === "number") setStep(Math.min(saved.step, STEPS.length - 1));
      }
    } catch {}
  }, [initialZip, reset]);

  const values = watch();
  useEffect(() => {
    try {
      const { consent: _c, ...rest } = values;
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ values: rest, step }));
    } catch {}
  }, [values, step]);

  // Keep state in sync with ZIP.
  const zip = watch("zip");
  useEffect(() => {
    const s = stateFromZip(zip ?? "");
    if (s) setValue("state", s, { shouldValidate: true });
  }, [zip, setValue]);

  useEffect(() => trackStep(step), [step]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  async function next() {
    const ok = await trigger(HOME_STEP_FIELDS[current.key] as unknown as (keyof HomeFormValues)[], { shouldFocus: true });
    if (ok) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function onSubmit(form: HomeFormValues) {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/home-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          tracking: readTracking(),
          trustedFormCertUrl: formRef.current?.querySelector<HTMLInputElement>('input[name="xxTrustedFormCertUrl"]')?.value ?? "",
          website: formRef.current?.querySelector<HTMLInputElement>('input[name="website"]')?.value ?? "",
          pageUrl: window.location.href,
          consentVersion,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      localStorage.removeItem(DRAFT_KEY);
      trackStep(STEPS.length);
      const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; dataLayer?: unknown[] };
      w.gtag?.("event", "generate_lead", { currency: "USD", value: 0, product: "home_warranty" });
      w.fbq?.("track", "Lead", { content_category: "home_warranty" });
      w.dataLayer?.push({ event: "home_quote_submitted" });
      router.push(`/quote/results/${data.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? `${err.message}. Check your answers and try again.` : "We couldn't send your answers. Try again.");
      setSubmitting(false);
    }
  }

  const err = (k: keyof HomeFormValues) => (errors[k] ? <p id={`${k}-error`} className="error">{errors[k]?.message as string}</p> : null);
  // Every field is required; the consent box also points to its wording.
  const aria = (k: keyof HomeFormValues) => ({
    id: k,
    "aria-invalid": !!errors[k],
    "aria-required": true,
    "aria-describedby": [errors[k] && `${k}-error`, k === "consent" && "consent-text"].filter(Boolean).join(" ") || undefined,
  });

  if (submitting) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rail bg-white px-6 py-16 text-center shadow-[0_20px_50px_-20px_rgba(17,41,79,0.18)]" role="status" aria-live="polite">
        <span aria-hidden className="mx-auto block h-14 w-14 animate-spin rounded-full border-4 border-sky/15 border-t-sky" />
        <h2 className="mt-8 text-2xl font-bold">Sending your details</h2>
        <p className="mt-2 text-road">This usually takes a few seconds. Please don&apos;t close this page.</p>
      </div>
    );
  }

  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <TrustedForm />
      {/* Bot trap: hidden from people and screen readers, so only bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-rail bg-white shadow-[0_20px_50px_-24px_rgba(17,41,79,0.2)]">
        <div className="border-b border-rail px-6 pb-5 pt-6 sm:px-10">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-sky">
              Step {step + 1} of {STEPS.length}
              <span className="font-medium text-road"> · {current.label}</span>
            </span>
            <span className="font-medium text-road">{progress}% complete</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EDF0F3]" role="progressbar" aria-label="Quote progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full rounded-full bg-gradient-to-r from-sky to-[#4A86D0] transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div key={step} className="step-in px-6 py-8 sm:px-10 sm:py-10">
          <h1 className="text-2xl font-extrabold leading-tight sm:text-[1.9rem]">{current.title}</h1>
          <p className="mt-2 max-w-xl leading-relaxed text-road">{current.subtitle}</p>

          <div className="mt-8 space-y-6">
            {current.key === "location" && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="zip">ZIP code</label>
                  <input className="input" inputMode="numeric" maxLength={5} autoComplete="postal-code" placeholder="e.g. 90210" {...aria("zip")} {...register("zip")} />
                  {err("zip")}
                </div>
                <div>
                  <label className="label" htmlFor="state">State</label>
                  <select className="input" {...aria("state")} {...register("state")}>
                    <option value="">Choose a state</option>
                    {STATES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                  {err("state")}
                </div>
              </div>
            )}

            {current.key === "property" && (
              <>
                <ChoiceGroup label="What type of home is it?" name="homeType" error={errors.homeType?.message}
                  options={[["single_family", "Single-family house"], ["condo", "Condo or apartment"], ["townhouse", "Townhouse"], ["mobile", "Mobile or manufactured home"], ["multi_unit", "Duplex or multi-unit"]]}
                  reg={register("homeType")} cols={2} />
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="squareFeet">Approximate size (square feet)</label>
                    <input className="input" inputMode="numeric" placeholder="e.g. 1800" {...aria("squareFeet")} {...register("squareFeet")} />
                    {err("squareFeet")}
                  </div>
                  <div>
                    <label className="label" htmlFor="yearBuilt">Year built</label>
                    <input className="input" inputMode="numeric" maxLength={4} placeholder="e.g. 1998" {...aria("yearBuilt")} {...register("yearBuilt")} />
                    {err("yearBuilt")}
                  </div>
                </div>
                <p className="hint">An estimate is fine. You can find both on your county property record or your closing documents.</p>
              </>
            )}

            {current.key === "coverage" && (
              <>
                <ChoiceGroup label="Which describes you?" name="ownership" error={errors.ownership?.message}
                  options={[["own", "I own and live in this home"], ["buying", "I'm buying it (closing soon)"], ["landlord", "I rent it out"]]} reg={register("ownership")} cols={3} />
                <ChoiceGroup label="Do you have a home warranty now?" name="existingWarranty" error={errors.existingWarranty?.message}
                  options={[["yes", "Yes"], ["no", "No"], ["not_sure", "Not sure"]]} reg={register("existingWarranty")} cols={3} />
                <ChoiceGroup label="What do you want to protect?" name="planInterest" error={errors.planInterest?.message}
                  options={[
                    ["systems", "Systems: Heating, air conditioning, plumbing, electrical and water heater"],
                    ["appliances", "Appliances: Refrigerator, oven and range, dishwasher, washer and dryer"],
                    ["combo", "Both: Systems and appliances in one plan"],
                    ["not_sure", "Not sure yet: Show me every plan my home qualifies for"],
                  ]} reg={register("planInterest")} />
              </>
            )}

            {current.key === "contact" && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="firstName">First name</label>
                    <input className="input" autoComplete="given-name" {...aria("firstName")} {...register("firstName")} />
                    {err("firstName")}
                  </div>
                  <div>
                    <label className="label" htmlFor="lastName">Last name</label>
                    <input className="input" autoComplete="family-name" {...aria("lastName")} {...register("lastName")} />
                    {err("lastName")}
                  </div>
                  <div>
                    <label className="label" htmlFor="email">Email</label>
                    <input type="email" className="input" autoComplete="email" placeholder="you@example.com" {...aria("email")} {...register("email")} />
                    {err("email")}
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">Phone</label>
                    <input type="tel" className="input" autoComplete="tel-national" placeholder="(555) 555-5555" {...aria("phone")} {...register("phone")} />
                    {err("phone")}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="address">Street address of the home</label>
                    <input className="input" autoComplete="street-address" {...aria("address")} {...register("address")} />
                    {err("address")}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="city">City</label>
                    <input className="input" autoComplete="address-level2" {...aria("city")} {...register("city")} />
                    {err("city")}
                  </div>
                </div>
                <div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-rail bg-white p-4 text-sm leading-relaxed text-road transition hover:border-road/40 has-[:checked]:border-sky has-[:checked]:bg-sky/[0.04]">
                    <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-sky" {...aria("consent")} {...register("consent")} />
                    <span id="consent-text">{consentText}</span>
                  </label>
                  {err("consent")}
                </div>
              </>
            )}
          </div>

          {serverError && (
            <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{serverError}</p>
          )}
          {isLast && <p className="mt-6 text-xs leading-relaxed text-road">{HOME_DISCLOSURE}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-rail bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          {step > 0 ? (
            <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
              <Arrow dir="left" /> Back
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}
          {isLast ? (
            <button key="submit" type="submit" className="btn-primary bg-line text-asphalt hover:bg-line-dark sm:min-w-52">
              Get my free quote <Arrow dir="right" />
            </button>
          ) : (
            <button key="next" type="button" onClick={next} className="btn-primary bg-line text-asphalt hover:bg-line-dark sm:min-w-44">
              Continue <Arrow dir="right" />
            </button>
          )}
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-6">
        <div className="hidden rounded-2xl border border-rail bg-white p-6 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-road/70">Your quote</p>
          <ol className="mt-4">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={s.key} className="relative pb-5 pl-11 last:pb-0">
                  {i < STEPS.length - 1 && <span aria-hidden className={`absolute left-[13px] top-8 h-[calc(100%-2rem)] w-0.5 ${done ? "bg-sky" : "bg-rail"}`} />}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition ${
                      done ? "bg-sky text-white" : active ? "border-2 border-sky bg-white text-sky ring-4 ring-sky/15" : "border-2 border-rail bg-white text-road/60"
                    }`}
                  >
                    {done ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  {done ? (
                    <button type="button" onClick={() => setStep(i)} className="pt-0.5 text-left text-[15px] font-medium text-asphalt hover:text-sky">{s.label}</button>
                  ) : (
                    <span aria-current={active ? "step" : undefined} className={`block pt-0.5 text-[15px] ${active ? "font-semibold text-asphalt" : "text-road/70"}`}>{s.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="rounded-2xl bg-[linear-gradient(135deg,#11294F_0%,#2864B4_100%)] p-6 text-white">
          <p className="text-lg font-bold">Prefer to talk to someone?</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/80">Our team can explain plan options and prices by phone.</p>
          <a href={phoneHref} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-semibold text-asphalt transition hover:bg-white/90">
            <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
            {phone}
          </a>
        </div>

        <ul className="space-y-3 rounded-2xl border border-rail bg-white p-6 text-sm text-road">
          {["Free quote, no obligation", "30-day money-back guarantee", "Systems, appliances or both", "Real people to help you"].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky/10 text-sky">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
              </span>
              {t}
            </li>
          ))}
        </ul>
      </aside>
    </form>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left" ? <path d="M19 12H5m6-6-6 6 6 6" /> : <path d="M5 12h14m-6-6 6 6-6 6" />}
    </svg>
  );
}

function ChoiceGroup({ label, name, options, reg, error, cols = 1 }: { label: string; name: string; options: [string, string][]; reg: UseFormRegisterReturn; error?: string; cols?: 1 | 2 | 3 | 4 }) {
  const grid = { 1: "grid gap-2.5", 2: "grid grid-cols-2 gap-2.5", 3: "grid gap-2.5 sm:grid-cols-3", 4: "grid grid-cols-2 gap-2.5 sm:grid-cols-4" }[cols];
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="label">{label}</legend>
      <div className={grid}>
        {options.map(([value, text]) => {
          // "Title: description" options show the description on its own line.
          const [title, detail] = text.split(": ");
          return (
            <label key={value} className="choice">
              <input type="radio" value={value} {...reg} />
              <span>
                <span className="block">{title}</span>
                {detail && <span className="mt-0.5 block text-sm font-normal text-road">{detail}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && <p id={`${name}-error`} className="error">{error}</p>}
    </fieldset>
  );
}

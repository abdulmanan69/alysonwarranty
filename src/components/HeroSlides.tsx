"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

// Home hero photos: a slow zoom and drift on the photo that's showing, then a crossfade to the
// next one. The first photo loads right away (it's the largest thing on the page); the others
// only start downloading after the page has loaded, and a slide only changes once the next
// photo is ready. People who ask their device for less motion get still photos.

// Auto and home photos take turns. `pos` keeps the car or house in view when a narrow screen
// crops the sides. Photos: Pexels (free to use), see public/images/CREDITS.txt.
const SLIDES = [
  { name: "Your SUV", file: "hero-suv-sunset", drift: "-1.5%", pos: "50% 60%" },
  { name: "Your home", file: "hero-house-florida", drift: "1.5%", pos: "52% 50%" },
  { name: "Your truck", file: "hero-pickup-field", drift: "1.5%", pos: "26% 60%" },
  { name: "Your kitchen", file: "hero-kitchen", drift: "-1.5%", pos: "68% 50%" },
];
const SHOW_MS = 7000; // how long each photo stays
const FADE_MS = 1200; // crossfade length; matches .hero-slide in globals.css

const srcSet = (file: string) => [640, 1024, 1600, 2048].map((w) => `/images/hero/${file}-${w}.webp ${w}w`).join(", ");

export function HeroSlides() {
  const [active, setActive] = useState(0);
  const [intro, setIntro] = useState(true); // the first photo zooms with a CSS animation until the first change
  const [loadRest, setLoadRest] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>(() => SLIDES.map((_, i) => i === 0));
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const start = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (idle) idle(() => setLoadRest(true), { timeout: 3000 });
      else setTimeout(() => setLoadRest(true), 1500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  const show = useCallback(
    (i: number) => {
      setActive(i);
      if (intro) setTimeout(() => setIntro(false), FADE_MS + 100);
    },
    [intro],
  );

  // Move on after SHOW_MS, but only to a photo that has finished loading.
  useEffect(() => {
    if (still) return;
    const next = (active + 1) % SLIDES.length;
    if (!loaded[next]) return;
    const t = setTimeout(() => show(next), SHOW_MS);
    return () => clearTimeout(t);
  }, [active, loaded, still, show]);

  return (
    <>
      {/* Phones and tablets: the photo fills the hero behind the text. Large screens: it fills the
          right side and fades into the deep blue behind the headline. */}
      <div className="absolute inset-0 -z-20 overflow-hidden lg:left-[57%] xl:left-[55%]">
        {SLIDES.map((s, i) => {
          const on = i === 0 || loadRest;
          return (
            <img
              key={s.file}
              src={on ? `/images/hero/${s.file}-1600.webp` : undefined}
              srcSet={on ? srcSet(s.file) : undefined}
              sizes="(min-width: 1024px) 45vw, 100vw"
              fetchPriority={i === 0 ? "high" : undefined}
              decoding="async"
              alt=""
              aria-hidden="true"
              onLoad={() => setLoaded((l) => (l[i] ? l : l.map((v, j) => (j === i ? true : v))))}
              style={{ "--kb-x": s.drift, objectPosition: s.pos } as CSSProperties}
              className={`hero-slide ${i === active ? "is-active" : ""} ${i === 0 && intro ? "is-intro" : ""}`}
            />
          );
        })}
        <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(90deg,#11294F_0%,rgba(17,41,79,0.6)_14%,rgba(17,41,79,0)_42%),linear-gradient(0deg,rgba(10,22,44,0.65)_0%,rgba(10,22,44,0)_32%)] lg:block" />
      </div>

      {/* Which photo is showing, with a bar that fills until the next one. */}
      <div className="absolute inset-x-0 bottom-10 hidden md:block">
        <div className="mx-auto flex max-w-6xl justify-end gap-4 px-5 xl:gap-6">
          {SLIDES.map((s, i) => (
            <button
              key={s.file}
              type="button"
              onClick={() => show(i)}
              aria-pressed={i === active}
              aria-label={`Show photo: ${s.name}`}
              className={`w-28 whitespace-nowrap text-left text-xs font-semibold uppercase tracking-[0.12em] transition ${i === active ? "text-white" : "text-white/65 hover:text-white"}`}
            >
              <span className="block h-[3px] overflow-hidden rounded-full bg-white/25">
                {i === active && (
                  <span className={`block h-full rounded-full bg-line ${still ? "w-full" : "hero-progress"}`} style={{ animationDuration: `${SHOW_MS}ms` }} />
                )}
              </span>
              <span className="mt-2 block">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

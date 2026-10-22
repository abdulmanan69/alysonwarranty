import { OG_SIZE, renderOg } from "@/lib/og";
import { site } from "@/lib/site";

// Homepage share card, built from the shared template in src/lib/og.tsx.
export const alt = `${site.name}: auto and home warranty plans`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({
    title: "Protect your car and your home from costly repairs.",
    subtitle: "Auto warranty · Home warranty · Free quotes · No obligation",
  });
}

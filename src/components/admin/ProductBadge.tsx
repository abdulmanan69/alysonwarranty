import { PRODUCTS, productOf } from "@/lib/products";

/** Which product a lead asked about: auto warranty (amber) or home warranty (green). */
export function ProductBadge({ line }: { line: string }) {
  const p = productOf(line);
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p === "home" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
      {PRODUCTS[p].short}
    </span>
  );
}

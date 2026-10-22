// The two products this site sells, kept apart everywhere: separate quote forms, consent text,
// lead type (Lead.line) and wording. Neither one is insurance, so the copy never uses insurance
// words (policy, premium, insurer).
//   vsc  = auto warranty, legally a vehicle service contract
//   home = home warranty, legally a home service contract

export const PRODUCTS = {
  vsc: { label: "Auto warranty", short: "Auto", legal: "vehicle service contract", quoteHref: "/quote/auto-warranty", guideHref: "/extended-car-warranty" },
  home: { label: "Home warranty", short: "Home", legal: "home service contract", quoteHref: "/quote/home-warranty", guideHref: "/home-warranty" },
} as const;

export type ProductLine = keyof typeof PRODUCTS;

export const productOf = (line: string): ProductLine => (line === "home" ? "home" : "vsc");
export const productLabel = (line: string) => PRODUCTS[productOf(line)].label;

/** Shown next to every auto warranty offer. */
export const VSC_DISCLOSURE =
  "An auto warranty bought after the factory warranty is a vehicle service contract, not insurance. It's an optional contract that pays for repairs to the parts it lists, subject to its terms, exclusions and deductible.";

/** Shown next to every home warranty offer. */
export const HOME_DISCLOSURE =
  "A home warranty is a home service contract, not insurance. It's an optional contract that pays to repair or replace the home systems and appliances it lists when they fail from normal wear, subject to its terms, exclusions and service call fee.";

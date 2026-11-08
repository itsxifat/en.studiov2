// All hero copy and constants live here so the component files stay pure markup.

export const CITY = "Dhaka";
export const COUNTRY = "Bangladesh";
export const DISCIPLINE = "Film & photography production";
export const AFFILIATION = "A sister concern of Enfinito";
export const AFFILIATION_HINT = "(opens in a new tab)"; // screen-reader only
export const PARENT_URL = "https://enfinito.com";

// Each inner array is one visual line; each string is one masked word-group.
export const HEADLINE = [
  ["Pictures", "that move."],
  ["Pictures", "that stay"], // the final period is rendered separately so it can land last
];
export const HEADLINE_TEXT = "Pictures that move. Pictures that stay.";

export const SUBHEAD =
  "Film and photography for brands — commercials, campaign films and product stills, made in Dhaka.";

export const CTA_PRIMARY = { label: "View portfolio", href: "/portfolio" };
export const CTA_SECONDARY = { label: "Get a quote", href: "/quote" };
export const WORK_ANCHOR = "#work";

export const INDEX_MAX = 5;

// Shared micro-type style: meta row, strip anchor, index numerals.
export const META =
  "text-[11px] xl:text-xs font-medium uppercase tracking-[0.14em] leading-none tabular-nums";

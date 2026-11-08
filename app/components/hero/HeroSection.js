import { preconnect } from "react-dom";
import { Instrument_Serif } from "next/font/google";
import { toHeroItems } from "../../lib/media";
import { ButtonPill, TextLink } from "../ui/StyledButtons";
import Arrow from "./Arrow";
import WorkIndex from "./WorkIndex";
import s from "./hero.module.css";
import {
  CITY,
  COUNTRY,
  DISCIPLINE,
  AFFILIATION,
  AFFILIATION_HINT,
  PARENT_URL,
  HEADLINE,
  HEADLINE_TEXT,
  SUBHEAD,
  CTA_PRIMARY,
  CTA_SECONDARY,
  WORK_ANCHOR,
  INDEX_MAX,
  META,
} from "./hero.config";

const CONTAINER = "relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6";

// Display face for the headline only. Declared here (not in the root layout) so its
// @font-face and preload ship only on routes that render the hero. `block` (not swap):
// it is preloaded, ~25KB, and the headline is masked for its first 100ms, so it must
// never paint in the metric fallback and swap glyphs mid-animation.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "block",
  variable: "--font-instrument-serif",
});

// Server component. Zero client JavaScript: every animation is CSS.
export default function HeroSection({ items = [] }) {
  const index = toHeroItems(items, INDEX_MAX);
  for (const origin of new Set(index.map((i) => i.origin))) {
    // No crossOrigin option: a CORS preconnect is not reused by a plain <img>.
    preconnect(origin);
  }

  // Word-group delays follow the load choreography: 100 / 170 / 240 / 310 ms.
  let delay = 100;
  const lastLine = HEADLINE.length - 1;

  return (
    <section
      aria-labelledby="hero-title"
      className={`${instrumentSerif.variable} ${s.hero} grid grid-rows-[auto_1fr_64px] md:grid-rows-[auto_1fr_72px] pt-20 md:pt-24`}
    >
      <div className={s.grain} aria-hidden="true" />

      {/* Row 1 — masthead meta */}
      <div className={`${CONTAINER} pt-6 md:pt-10 flex items-center justify-between`}>
        <p className={`${META} ${s.meta} ${s.revealSm}`} style={{ "--d": "700ms" }}>
          {CITY}
          <span className="hidden md:inline">, {COUNTRY}</span>
        </p>
        <p
          className={`${META} ${s.meta} ${s.revealSm} hidden md:block`}
          style={{ "--d": "760ms" }}
        >
          {DISCIPLINE}
        </p>
        <a
          href={PARENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${META} ${s.meta} ${s.revealSm} ${s.link} focus-ring inline-flex items-center gap-1.5 py-4 -my-4`}
          style={{ "--d": "820ms" }}
        >
          {AFFILIATION}
          <span className="sr-only"> {AFFILIATION_HINT}</span>
          <Arrow dir="upright" size={12} />
        </a>
      </div>

      {/* Row 2 — headline, paragraph, actions (scroll-exit target) */}
      <div className={`${s.body} ${CONTAINER} self-start md:self-end pt-10 md:pt-0 pb-8`}>
        <h1 id="hero-title" className={s.h1}>
          <span className="sr-only">{HEADLINE_TEXT}</span>
          <span aria-hidden="true">
            {HEADLINE.map((line, li) => (
              <span key={li} className={s.line}>
                {line.map((group, gi) => {
                  const d = `${delay}ms`;
                  delay += 70;
                  const isLast = li === lastLine && gi === line.length - 1;
                  return (
                    <span key={gi}>
                      {gi > 0 ? " " : null}
                      <span className={s.mask}>
                        <span className={s.g} style={{ "--d": d }}>
                          {group}
                          {isLast ? <span className={s.dot}>.</span> : null}
                        </span>
                      </span>
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-8 md:mt-10 md:flex md:items-start md:justify-between md:gap-8">
          <p className={`${s.p} ${s.reveal} max-w-[36ch]`} style={{ "--d": "480ms" }}>
            {SUBHEAD}
          </p>
          <nav
            aria-label="Primary actions"
            className="mt-8 md:mt-0 shrink-0 flex flex-wrap items-center gap-x-6 md:gap-x-7 gap-y-4"
          >
            <ButtonPill href={CTA_PRIMARY.href} className={s.reveal} style={{ "--d": "560ms" }}>
              {CTA_PRIMARY.label}
            </ButtonPill>
            <TextLink href={CTA_SECONDARY.href} className={s.reveal} style={{ "--d": "620ms" }}>
              {CTA_SECONDARY.label}
            </TextLink>
          </nav>
        </div>
      </div>

      {/* Row 3 — hairline strip with the work index */}
      <div className={`${CONTAINER} flex items-center justify-between`}>
        <span
          className={`${s.rule} absolute top-0 inset-x-4 sm:inset-x-6 h-px bg-[color:var(--rule)]`}
          aria-hidden="true"
        />
        <a
          href={WORK_ANCHOR}
          className={`${META} ${s.meta} ${s.fadeOnly} ${s.link} focus-ring inline-flex items-center gap-1.5 h-full`}
          style={{ "--d": "820ms" }}
        >
          <Arrow dir="down" size={12} />
          <span>
            <span className="hidden md:inline">Featured </span>work
          </span>
        </a>
        <WorkIndex items={index} />
      </div>
    </section>
  );
}

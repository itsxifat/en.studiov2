import Link from "next/link";
import s from "./hero.module.css";
import { META } from "./hero.config";

// Contact-sheet index of featured work. Renders nothing with zero items so the
// strip keeps its height and the hero reads as finished without data.
export default function WorkIndex({ items }) {
  if (!items?.length) return null;

  return (
    <ol
      role="list"
      aria-label="Featured work"
      className="flex items-center gap-3 md:gap-5"
    >
      {items.map((it, i) => (
        <li
          key={it.id}
          className={`${s.idx} ${i >= 3 ? "hidden lg:flex" : "flex"} items-center`}
          style={{ "--d": `${900 + 50 * i}ms` }}
        >
          <Link
            href={it.href}
            prefetch={false}
            aria-label={`Featured work ${it.n}: ${it.title}`}
            className={`${META} ${s.meta} focus-ring flex items-center gap-2`}
          >
            <span aria-hidden="true" className={`${s.n} hidden md:inline`}>
              {it.n}
            </span>
            <span className={`${s.thumb} w-16 h-10 md:w-20 md:h-[50px]`}>
              {/* Decorative: the link carries the name, so a failed hotlink is an empty well. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                alt=""
                width="80"
                height="50"
                decoding="async"
                fetchPriority="low"
              />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

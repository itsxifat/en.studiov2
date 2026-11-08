import Link from "next/link";
import Arrow from "../hero/Arrow";
import b from "./buttons.module.css";

/**
 * ButtonPill — the one solid call to action. White pill, black label,
 * background-only hover, 2% press. No icon.
 */
export function ButtonPill({ href, children, className = "", style }) {
  return (
    <Link href={href} style={style} className={`${b.pill} focus-ring ${className}`}>
      {children}
    </Link>
  );
}

/**
 * TextLink — secondary action. Underline draws from the left on hover and
 * retracts to the right on leave (transform on ::after, compositor-only).
 */
export function TextLink({ href, children, className = "", style }) {
  return (
    <Link href={href} style={style} className={`${b.textLink} focus-ring ${className}`}>
      <span className={b.label}>{children}</span>
      <Arrow dir="right" />
    </Link>
  );
}

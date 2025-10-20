"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Plays loader only:
 *  • on first load in a new tab
 *  • on hard reload or direct URL entry
 *
 * Skips loader:
 *  • when navigating back via Next.js router
 *  • when using browser back/forward (bfcache)
 */
export function useHomeLoaderGate() {
  const [showLoader, setShowLoader] = useState(false);

  const KEY_TO = "home_last_timeorigin";
  const KEY_PLAYED_DOC = "home_loader_played_doc";

  const nav = useMemo(() => {
    const e = performance.getEntriesByType("navigation");
    return e && e.length ? e[0] : undefined;
  }, []);

  useEffect(() => {
    const thisTO = String(performance.timeOrigin);
    const lastTO = sessionStorage.getItem(KEY_TO);
    if (lastTO !== thisTO) {
      sessionStorage.setItem(KEY_TO, thisTO);
      sessionStorage.removeItem(KEY_PLAYED_DOC); // reset if it's a new doc
    }

    const navType = nav?.type || "navigate";
    const alreadyPlayed = sessionStorage.getItem(KEY_PLAYED_DOC) === "1";

    const allowedByType = navType === "navigate" || navType === "reload";
    const isBackForward = navType === "back_forward";

    if (!alreadyPlayed && allowedByType && !isBackForward) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [nav]);

  const markPlayed = () => {
    sessionStorage.setItem(KEY_PLAYED_DOC, "1");
    setShowLoader(false);
  };

  return { showLoader, markPlayed };
}

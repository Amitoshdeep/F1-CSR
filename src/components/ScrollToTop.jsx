// components/ScrollToTop.jsx
import React, { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// useLayoutEffect on client, useEffect on server to avoid SSR warnings
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * ScrollToTop
 * - Listens to route changes (React Router v6 useLocation)
 * - Resets window/document scroll and common scrollable containers
 * - Props:
 *    - selector: CSS selector string for additional scrollable containers (defaults to common roots)
 *    - behavior: 'auto' | 'smooth' (default 'auto')
 */
export default function ScrollToTop({ selector = 'main, [role="main"], [data-scroll-container], #root, #app, .App', behavior = "auto" }) {
  const { pathname, hash } = useLocation();

  useIsomorphicLayoutEffect(() => {
    // 1) Try to scroll the top-level window and document
    try {
      if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
        window.scrollTo({ top: 0, left: 0, behavior });
      }
    } catch (e) {
      try { window.scrollTo(0, 0); } catch (_) {}
    }

    try {
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch (_) {}

    // 2) Scroll any likely app-level scrollable containers (apps often render scrolling in #root or .App)
    try {
      const els = document.querySelectorAll(selector);
      els.forEach((el) => {
        try {
          if (typeof el.scrollTo === "function") {
            // prefer using scrollTo with behavior when available
            el.scrollTo({ top: 0, left: 0, behavior });
          } else {
            el.scrollTop = 0;
          }
        } catch (_) {
          try { el.scrollTop = 0; } catch (__){ }
        }
      });
    } catch (_) {}

    // Note: we purposely ignore hash navigation here (always reset to top). If you want to preserve
    // fragment scrolling, add logic to skip when `hash` is present.

  }, [pathname, hash, selector, behavior]);

  return null;
}

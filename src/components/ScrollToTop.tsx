"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const id = hash ? hash.substring(1) : null;

    // Defer to next tick so the element exists after navigation
    setTimeout(() => {
      if (id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'auto' });
        else window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 0);
      }
    }, 0);
  }, [pathname]);

  return null;
}

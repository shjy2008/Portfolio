"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    let frameId = 0;

    const scrollForCurrentLocation = () => {
      const hash = window.location.hash;
      const id = hash ? decodeURIComponent(hash.slice(1)) : "";

      if (!id) {
        window.scrollTo(0, 0);
        return;
      }

      let attempts = 0;
      const maxAttempts = 10;

      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "auto" });
          return;
        }

        attempts += 1;
        if (attempts < maxAttempts) {
          frameId = window.requestAnimationFrame(tryScroll);
        } else {
          window.scrollTo(0, 0);
        }
      };

      frameId = window.requestAnimationFrame(tryScroll);
    };

    scrollForCurrentLocation();
    window.addEventListener("hashchange", scrollForCurrentLocation);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("hashchange", scrollForCurrentLocation);
    };
  }, [pathname]);

  return null;
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Resetear scroll global
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 2. Resetear scroll del contenedor interno del admin
    const resetAdminScroll = () => {
      const mainContent = document.getElementById("admin-main-content");
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    };

    resetAdminScroll();
    const frameId = requestAnimationFrame(resetAdminScroll);

    return () => cancelAnimationFrame(frameId);
  }, [pathname]);

  return null;
}
// frontend/components/navigation/NavBarClient.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import TopBanner from "./TopBanner";

export default function NavBarClient({ children }: { children: ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            id="navbar-fixed"
            className="fixed top-0 left-0 w-full z-[22] flex flex-col transition-transform duration-300"
            style={{
                transform: isScrolled ? "translateY(-32px)" : "translateY(0px)"
            }}
        >
            <TopBanner />
            <div className="text-fg-primary bg-surface-primary">
                {children}
            </div>
        </div>
    );
}
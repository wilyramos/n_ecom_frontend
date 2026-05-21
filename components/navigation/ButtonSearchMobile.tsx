// frontend/components/navigation/ButtonSearchMobile.tsx
"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";

export default function ButtonSearchMobile() {
    const [openSearch, setOpenSearch] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateHeight = () => {
            const nav = document.getElementById("navbar-fixed");
            if (nav) {
                setHeaderHeight(nav.offsetHeight);
            }
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenSearch(false);
            }
        };
        if (openSearch) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openSearch]);

    return (
        <>
            {/* Toggle button único para responsive */}
            <button
                onClick={() => setOpenSearch(!openSearch)}
                className="p-2.5 rounded-full hover:bg-surface-secondary text-fg-muted  transition-colors duration-200 active:scale-90"
                aria-label="Buscar productos"
            >
                {openSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Caja del buscador desplegable */}
            {openSearch && (
                <div
                    ref={containerRef}
                    className="fixed left-0 w-full bg-surface-primary border-b border-border-default z-[45] px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ top: headerHeight }}
                >
                    <div className="max-w-3xl mx-auto w-full">
                        <ButtonSearchFormStore
                            isMobile={true}
                            onSearchComplete={() => setOpenSearch(false)}
                        />
                    </div>
                </div>
            )}

            {/* Overlay */}
            {openSearch && (
                <div
                    className="fixed inset-0 bg-brand-black/40 backdrop-blur-xs z-[40]"
                    style={{
                        top: headerHeight,
                        height: `calc(100vh - ${headerHeight}px)`
                    }}
                    onClick={() => setOpenSearch(false)}
                />
            )}
        </>
    );
}
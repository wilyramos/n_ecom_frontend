"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";

export default function ButtonSearchMobile() {
    const [openSearch, setOpenSearch] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
                className="p-2.5 rounded-full hover:bg-fg-action text-fg-muted transition-colors duration-200 active:scale-90"
                aria-label="Buscar productos"
            >
                {openSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Caja del buscador desplegable */}
            {openSearch && (
                <div
                    ref={containerRef}
                    className="fixed left-0 top-20 w-full bg-surface-primary border-b border-border-default z-[45] px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200"
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
                    className="fixed left-0 top-20 w-full h-[calc(100vh-5rem)] bg-brand-black/40 backdrop-blur-xs z-[40]"
                    onClick={() => setOpenSearch(false)}
                />
            )}
        </>
    );
}
"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";

export default function ButtonSearchMobile() {
    const [openSearch, setOpenSearch] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cerrar al presionar tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenSearch(false);
        };
        if (openSearch) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [openSearch]);

    // Cerrar si se hace clic fuera del contenedor activo
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
        <div ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpenSearch(!openSearch)}
                className={`p-2.5 rounded-full transition-colors duration-200 active:scale-95 cursor-pointer outline-none ${
                    openSearch 
                        ? "bg-brand-action-muted text-brand-charcoal" 
                        : "text-brand-gris hover:text-brand-charcoal hover:bg-brand-action-muted"
                }`}
                aria-label={openSearch ? "Cerrar buscador" : "Abrir buscador"}
                aria-expanded={openSearch}
            >
                {openSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {openSearch && (
                <>
                    {/* Backdrop / Overlay oscuro */}
                    <div
                        className="fixed inset-x-0 top-14 bottom-0 bg-brand-black/40 backdrop-blur-xs z-40 animate-in fade-in duration-200"
                        onClick={() => setOpenSearch(false)}
                        aria-hidden="true"
                    />

                    {/* Contenedor del Buscador fijo debajo de la barra */}
                    <div className="fixed left-0 top-14 w-full bg-background border-b border-brand-silver-border z-50 px-4 py-4 md:py-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-w-4xl mx-auto w-full">
                            <ButtonSearchFormStore
                                onSearchComplete={() => setOpenSearch(false)}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
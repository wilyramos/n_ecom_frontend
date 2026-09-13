"use client";

import { Search, Loader2, ArrowRight, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchProductsIndex } from "@/actions/product/get-list-products-search";
import type { TProductListSchema } from "@/src/schemas";
import { getSearchHistory, saveSearchTerm } from "@/lib/utils";
import ProductResultSearch from "@/components/ui/home/ProductResultSearch";
import { Input } from "@/components/ui/input";

interface Props {
    onSearchComplete?: () => void;
}

export default function ButtonSearchFormStore({ onSearchComplete }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TProductListSchema[]>([]);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const [history, setHistory] = useState<string[]>([]);
    useEffect(() => setHistory(getSearchHistory()), []);

    // Sugerencias orientadas a Apple
    const DEFAULT_SUGGESTIONS = ["iPhone", "MacBook", "iPad", "Apple Watch", "AirPods"];

    const saveHistory = (term: string) => {
        if (!term) return;
        saveSearchTerm(term);
        setHistory(getSearchHistory());
    };

    useEffect(() => {
        setQuery("");
        setResults([]);
    }, [pathname]);

    const debouncedSearch = useDebouncedCallback(async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed || trimmed.length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const data = await searchProductsIndex(trimmed);
        setResults(data || []);
        setLoading(false);
    }, 350);

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    const executeSearch = (targetQuery: string) => {
        const trimmed = targetQuery.trim();
        if (!trimmed) return;
        saveHistory(trimmed);
        onSearchComplete?.();
        router.push(`/catalogo?search=${encodeURIComponent(trimmed)}`);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        executeSearch(query);
    };

    return (
        <div className="w-full">
            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="w-full">
                <div className="relative flex items-center">
                    <Search className="absolute left-3.5 h-5 w-5 text-brand-gris pointer-events-none" />
                    <Input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar en el catálogo Apple (ej. iPhone 15 Pro, M3, Watch)..."
                        autoFocus
                        className="h-12 pl-11 pr-11 bg-brand-silver-border/20 border-brand-silver-border text-brand-charcoal placeholder:text-brand-gris rounded-xl text-sm md:text-base focus-visible:ring-1 focus-visible:ring-brand-charcoal focus-visible:border-brand-charcoal transition-all"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setResults([]);
                                inputRef.current?.focus();
                            }}
                            className="absolute right-3.5 p-1 text-brand-gris hover:text-brand-charcoal rounded-md transition-colors cursor-pointer"
                            aria-label="Borrar búsqueda"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </form>

            {/* Resultados y Sugerencias */}
            <div className="mt-4 max-h-[calc(80vh-140px)] overflow-y-auto pr-1">
                {/* Cargando */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-10 text-brand-gris">
                        <Loader2 className="animate-spin mb-2" size={24} />
                        <span className="text-xs font-medium tracking-wide">Buscando dispositivos...</span>
                    </div>
                )}

                {/* Historial o Sugerencias iniciales */}
                {!loading && !query && (
                    <div className="py-2">
                        <span className="text-[11px] font-bold text-brand-gris uppercase tracking-widest block mb-3">
                            {history.length > 0 ? "Búsquedas Recientes" : "Dispositivos Frecuentes"}
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {(history.length > 0 ? history : DEFAULT_SUGGESTIONS).map((term, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        setQuery(term);
                                        inputRef.current?.focus();
                                    }}
                                    className="px-3.5 py-1.5 bg-brand-silver-border/40 hover:bg-brand-silver-border/80 border border-brand-silver-border text-xs text-brand-charcoal rounded-full font-medium transition-colors cursor-pointer"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lista de Resultados Encontrados */}
                {!loading && query && results.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-brand-silver-border pb-2.5">
                            <span className="font-semibold text-xs uppercase tracking-wider text-brand-gris">
                                {results.length} {results.length === 1 ? "resultado" : "resultados"}
                            </span>
                            <button
                                type="button"
                                onClick={() => executeSearch(query)}
                                className="inline-flex items-center gap-1.5 text-xs text-brand-charcoal font-semibold hover:text-brand-black hover:underline transition-all cursor-pointer"
                            >
                                <span>Ver todos en el catálogo</span>
                                <ArrowRight size={13} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {results.slice(0, 8).map((item) => (
                                <div key={item._id} onClick={() => onSearchComplete?.()}>
                                    <ProductResultSearch item={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sin Resultados */}
                {!loading && query.trim().length >= 2 && results.length === 0 && (
                    <div className="text-center py-10 text-brand-gris">
                        <p className="text-sm font-medium text-brand-charcoal">
                            No se encontraron productos para <span className="italic">{query}</span>
                        </p>
                        <p className="text-xs text-brand-gris mt-1">
                            Intenta con el modelo (ej. iPhone 13, iPad Air, M2)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
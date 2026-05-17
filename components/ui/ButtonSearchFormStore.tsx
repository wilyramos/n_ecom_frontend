// frontend/components/ui/ButtonSearchFormStore.tsx
"use client";

import { Search, Loader2, ArrowRight, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchProductsIndex } from "@/actions/product/get-list-products-search";
import type { TProductListSchema } from "@/src/schemas";
import { getSearchHistory, saveSearchTerm } from "@/lib/utils";
import ProductResultSearch from "@/components/ui/home/ProductResultSearch";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface Props {
    isMobile?: boolean;
    onSearchComplete?: () => void;
}

export default function ButtonSearchFormStore({ onSearchComplete }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TProductListSchema[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    const [history, setHistory] = useState<string[]>([]);
    useEffect(() => setHistory(getSearchHistory()), []);

    const DEFAULT_SUGGESTIONS = ["iphone", "case", "audífonos"];

    const saveHistory = (term: string) => {
        if (!term) return;
        saveSearchTerm(term);
        setHistory(getSearchHistory());
    };

    useEffect(() => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    }, [pathname]);

    const debouncedSearch = useDebouncedCallback(async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed || trimmed.length < 3) {
            setResults([]);
            return;
        }
        setLoading(true);
        const data = await searchProductsIndex(trimmed);
        setResults(data || []);
        setLoading(false);
        setIsOpen(true);
    }, 400);

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;

        saveHistory(trimmed);
        setIsOpen(false);
        onSearchComplete?.();
        router.push(`/productos?query=${encodeURIComponent(trimmed)}`);
    };

    return (
        <div className="relative w-full">
            <form ref={formRef} onSubmit={handleSubmit} className="w-full">
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-fg-secondary pointer-events-none">
                        <Search size={18} />
                    </div>

                    <Input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value.length > 0) setIsOpen(true);
                        }}
                        placeholder="Buscar productos, marcas..."
                        onFocus={() => setIsOpen(true)}
                        autoFocus
                        className="pl-10 pr-10 bg-surface-primary text-fg-primary border-border-default focus-visible:ring-action-primary"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setResults([]);
                                inputRef.current?.focus();
                            }}
                            className="absolute right-3 text-fg-secondary hover:text-fg-primary transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </form>

            {/* Panel de resultados optimizado */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-surface-primary border border-border-default z-50 max-h-[calc(100vh-240px)] shadow-lg rounded-md overflow-y-auto"
                >
                    <div className="p-4">
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-6 text-fg-secondary">
                                <Loader2 className="animate-spin mb-2" size={20} />
                                <span className="text-xs font-medium">Buscando...</span>
                            </div>
                        )}

                        {!loading && !query && (
                            <div>
                                <h4 className="text-xs font-semibold text-fg-secondary uppercase mb-3 flex items-center gap-2 tracking-wider">
                                    {history.length > 0 ? "Recientes" : "Sugerencias"}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(history.length > 0 ? history : DEFAULT_SUGGESTIONS).map((term, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                setQuery(term);
                                                inputRef.current?.focus();
                                            }}
                                            className="px-3 py-1.5 bg-surface-secondary/20 hover:bg-surface-secondary text-xs text-fg-primary rounded transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && results.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-border-default pb-2">
                                    <h3 className="font-semibold text-xs uppercase tracking-wider text-fg-secondary">Resultados</h3>
                                    <Link
                                        href={`/productos?query=${encodeURIComponent(query)}`}
                                        onClick={() => {
                                            saveHistory(query.trim());
                                            onSearchComplete?.();
                                        }}
                                        className="flex items-center gap-1 text-xs text-action-primary font-bold hover:text-action-primary-hover transition-colors"
                                    >
                                        Ver todos <ArrowRight size={12} />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {results.slice(0, 6).map((item) => (
                                        <ProductResultSearch key={item._id} item={item} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && query && results.length === 0 && (
                            <div className="text-center py-6 text-fg-secondary">
                                <p className="text-sm font-medium text-fg-primary">
                                    Sin resultados para <span className="italic">{query}</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
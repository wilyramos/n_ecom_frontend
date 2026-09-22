"use client";

import { useState, useEffect, useRef } from 'react';
import { PackageSearch, X, Search, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

// Acciones y UI
import { searchProductsAction } from '@/actions/product-actions';
import { ProductGrid } from '@/src/components/pos/ProductGrid';
import { CartSidebar } from '@/src/components/pos/CartSidebar';
import { Product } from '@/src/schemas/product.schema';
import { cn } from '@/lib/utils';

interface TerminalContainerProps {
    initialProducts: Product[];
    isCashOpen: boolean;
    userId: string;
}

export default function TerminalContainer({ initialProducts, userId }: TerminalContainerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

    const [debouncedSearch] = useDebounce(searchTerm, 300);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const results = await searchProductsAction(debouncedSearch);
                setProducts(results);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (debouncedSearch.length > 0) {
            fetchProducts();
        } else {
            setProducts(initialProducts);
            setIsLoading(false);
        }
    }, [debouncedSearch, initialProducts]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex h-full w-full overflow-hidden bg-background text-foreground">
            <section className="flex flex-1 flex-col min-w-0 relative">
                {/* Search Bar Bar Header */}
                <header className="p-4 md:p-6 bg-card border-b border-border sticky top-0 z-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-foreground transition-colors">
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin text-foreground" />
                                ) : (
                                    <Search size={18} strokeWidth={2.5} />
                                )}
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Busca productos o escanea código [ / ]..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-12 pr-10 bg-background border border-border rounded-sm text-xs font-bold transition-all outline-none focus:border-brand-action text-foreground placeholder:text-muted-foreground"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Grid Container */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {products.length > 0 ? (
                        <div className="max-w-7xl mx-auto">
                            <ProductGrid products={products} />
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground space-y-4">
                            <div className="h-24 w-24 bg-card rounded-sm flex items-center justify-center border border-border">
                                <PackageSearch size={36} strokeWidth={1.5} />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black uppercase tracking-widest text-foreground">Sin resultados</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">Intente con otro SKU o escanee nuevamente</p>
                            </div>
                        </div>
                    )}
                    <div className="h-28 lg:hidden" />
                </main>
            </section>

            {/* Sidebar Carrito */}
            <aside className={cn(
                "fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-card border-l border-border transition-transform duration-300 lg:relative lg:translate-x-0",
                isMobileCartOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"
            )}>
                <CartSidebar userId={userId} onClose={() => setIsMobileCartOpen(false)} />
            </aside>
        </div>
    );
}
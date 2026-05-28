"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, X, Package, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SelectedProduct {
    _id: string;
    nombre: string;
    precio: number;
    imagenes?: string[];
}

interface Props {
    initialItems?: (SelectedProduct | string)[];
}

export default function ComplementaryProductsSection({ initialItems = [] }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [searchResults, setSearchResults] = useState<SelectedProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

    useEffect(() => {
        const hydrate = async () => {
            const idsToFetch = initialItems.filter(item => typeof item === 'string') as string[];
            const alreadyPopulated = initialItems.filter(item => typeof item !== 'string') as SelectedProduct[];

            if (idsToFetch.length === 0) {
                setSelectedProducts(alreadyPopulated);
                return;
            }

            setLoadingInitial(true);
            try {
                const res = await fetch("/api/products/batch", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids: idsToFetch })
                });
                if (!res.ok) throw new Error("Hydration failed");
                const fetched: SelectedProduct[] = await res.json();
                setSelectedProducts([...alreadyPopulated, ...fetched]);
            } catch (error) {
                console.error("Error hydrating complementary products:", error);
                setSelectedProducts(alreadyPopulated);
            } finally {
                setLoadingInitial(false);
            }
        };
        hydrate();
    }, [initialItems]);

    const handleSearch = useCallback(async (query: string) => {
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setLoadingSearch(true);
        try {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSearchResults(Array.isArray(data) ? data : (data.products || []));
        } catch (error) {
            console.error("Error searching products:", error);
            setSearchResults([]);
        } finally {
            setLoadingSearch(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) handleSearch(searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm, handleSearch]);

    const toggleProduct = (product: SelectedProduct) => {
        const isSelected = selectedProducts.some(p => p._id === product._id);
        setSelectedProducts(prev => 
            isSelected ? prev.filter(p => p._id !== product._id) : [...prev, product]
        );
    };

    return (
        <div className="space-y-4 border border-border p-4 rounded-lg bg-card">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Complementarios</h3>
                        <p className="text-xs text-muted-foreground">{selectedProducts.length} vinculados</p>
                    </div>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1 px-3">
                            <Plus className="w-3 h-3" /> Vincular
                        </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-2xl p-0 overflow-hidden border border-border bg-background">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle className="text-base font-semibold text-foreground">
                                Catálogo de Productos
                            </DialogTitle>
                            <div className="relative mt-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Buscar productos..." 
                                    className="h-10 pl-10 bg-muted/50 border-border"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </DialogHeader>

                        <div className="h-[50vh] overflow-y-auto p-6 space-y-1">
                            {loadingSearch ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((p) => {
                                    const isSelected = selectedProducts.some(sel => sel._id === p._id);
                                    return (
                                        <div 
                                            key={p._id} 
                                            onClick={() => toggleProduct(p)}
                                            className={cn(
                                                "flex items-center gap-4 p-2 transition-colors cursor-pointer border-b border-border last:border-0",
                                                isSelected ? "bg-muted" : "hover:bg-muted/50"
                                            )}
                                        >
                                            <div className="relative w-10 h-10 border rounded bg-background shrink-0">
                                                <Image src={p.imagenes?.[0] || "/placeholder.png"} alt={p.nombre} fill className="object-contain p-1" unoptimized />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-foreground">{p.nombre}</p>
                                                <p className="text-xs text-muted-foreground">S/ {p.precio.toFixed(2)}</p>
                                            </div>
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                                    {searchTerm.length >= 2 ? "Sin resultados" : "Escribe para buscar"}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-border flex justify-end">
                            <Button onClick={() => setIsModalOpen(false)} size="sm" className="px-6 h-8 text-xs">Cerrar</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {loadingInitial ? (
                    <div className="col-span-full py-6 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                    </div>
                ) : selectedProducts.map((p) => (
                    <div key={`sel-${p._id}`} className="group relative flex items-center gap-3 p-2 border border-border rounded-md bg-background">
                        <div className="relative w-8 h-8 bg-background border rounded">
                            <Image src={p.imagenes?.[0] || "/placeholder.png"} alt={p.nombre} fill className="object-contain p-1" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-foreground truncate">{p.nombre}</p>
                            <p className="text-[9px] text-muted-foreground">S/ {p.precio.toFixed(2)}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedProducts(prev => prev.filter(i => i._id !== p._id))}
                            className="p-1 opacity-50 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                        <input type="hidden" name="complementarios" value={p._id} />
                    </div>
                ))}

                {!loadingInitial && selectedProducts.length === 0 && (
                    <div className="col-span-full p-6 border border-dashed border-border flex flex-col items-center justify-center opacity-50 bg-muted/30">
                        <AlertCircle className="w-4 h-4 mb-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Sin vinculaciones</span>
                    </div>
                )}
            </div>
        </div>
    );
}
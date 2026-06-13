// File: frontend/app/(store)/checkout/layout.tsx
"use client";

import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ChevronRight, ShoppingBag, Truck, CreditCard } from 'lucide-react';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    const isPaymentStep = pathname.includes('/checkout/payment');

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 min-h-screen space-y-6">
            
            {/* ─── INDICADOR DE PASOS (BREADCRUMBS) ─────────────────────────── */}
            <nav className="flex items-center space-x-2 text-xs md:text-sm font-medium border-b border-border pb-4">
                <Link 
                    href="/carrito" 
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Carrito</span>
                </Link>
                
                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />

                {isPaymentStep ? (
                    <Link 
                        href="/checkout" 
                        className="flex items-center gap-1.5 hover:opacity-80 font-bold transition-opacity underline underline-offset-4"
                        style={{ color: 'var(--color-brand-action, #a7c7aa)' }}
                        title="Regresar al formulario de envío"
                    >
                        <Truck className="w-4 h-4" />
                        <span>Envío e Identificación</span>
                    </Link>
                ) : (
                    <div className="flex items-center gap-1.5 text-foreground font-semibold">
                        <Truck className="w-4 h-4" style={{ color: 'var(--color-brand-action, #a7c7aa)' }} />
                        <span>Envío e Identificación</span>
                    </div>
                )}

                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />

                <div className={`flex items-center gap-1.5 ${isPaymentStep ? 'text-foreground font-semibold' : 'text-muted-foreground/60'}`}>
                    <CreditCard className="w-4 h-4" style={{ color: isPaymentStep ? 'var(--color-brand-action, #a7c7aa)' : 'inherit' }} />
                    <span>Pago</span>
                </div>
            </nav>

            {/* ─── CONTENIDO PRINCIPAL Y ASIDE ─────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2">{children}</section>
                <aside className="lg:col-span-1">
                    <div className="lg:sticky lg:top-14 space-y-4">
                        <ResumenFinalCarrito />

                        <div>
                            <div className="p-4 flex flex-row justify-between items-center rounded-2xl border border-border">
                                <div className="text-sm font-semibold tracking-tighter text-[var(--color-text-primary)] flex flex-row items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-fg-action shrink-0" />
                                    1 año de garantía
                                </div>
                                <div>
                                    <Link
                                        href="/cambios-devoluciones"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-[var(--color-text-secondary)] underline hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap"
                                    >
                                        Ver más detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
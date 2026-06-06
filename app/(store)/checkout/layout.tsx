import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 min-h-screen">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2">{children}</section>
                <aside className="lg:col-span-1">
                    <div className="lg:sticky lg:top-14 space-y-4">
                        <ResumenFinalCarrito />

                        <div>
                            <div className="p-4 flex flex-row justify-between items-center rounded-2xl border border-border">
                                <div className="text-sm font-semibold tracking-tighter text-[var(--color-text-primary)] flex flex-row items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-[var(--color-text-primary)] shrink-0" />
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
    )
}
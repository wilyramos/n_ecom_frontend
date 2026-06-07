import { HeadingH3 } from "@/components/ui/Heading";
import Link from "next/link";
import { GoLinkExternal } from "react-icons/go";

export default function GeneralView() {
    

    return (
        <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            {/* Header consistente */}
            <header className="flex items-center justify-between mb-6">
                <HeadingH3 className="text-base font-semibold text-zinc-900 tracking-tight">
                    Detalle de órdenes
                </HeadingH3>

                <Link
                    href="/admin/reports/orders"
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-[var(--color-accent-vivid)] transition-colors"
                >
                    Detalles <GoLinkExternal size={12} />
                </Link>
            </header>

            {/* Grid compacto usando la misma lógica visual */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
               
            </div>
        </section>
    );
}
import { HeadingH3 } from "@/components/ui/Heading";
import Link from "next/link";
import { GoLinkExternal } from "react-icons/go";

export default function GeneralView() {
    const salesSummary = {
        totalSales: 10000,
        numberSales: 150,
        margin: 20,
        totalUnitsSold: 300
    };

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
                {[
                    { label: "Ingresos", val: salesSummary.totalSales },
                    { label: "Ventas", val: salesSummary.numberSales },
                    { label: "Margen", val: salesSummary.margin },
                    { label: "Unidades", val: salesSummary.totalUnitsSold }
                ].map((item) => (
                    <div 
                        key={item.label}
                        className="group flex flex-col gap-1 p-4 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-[var(--color-accent-vivid)]/30 transition-all duration-200"
                    >
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">{item.label}</p>
                        <p className="text-lg font-bold text-zinc-900">{item.val.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
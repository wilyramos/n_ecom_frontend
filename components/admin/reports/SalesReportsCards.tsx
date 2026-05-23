import { getSummarySales } from '@/src/services/sales';
import { FiDollarSign, FiPackage, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import { GoLinkExternal } from "react-icons/go";
import Link from 'next/link';
import { HeadingH3 } from '@/components/ui/Heading';

export default async function SalesReportsCards() {
    const salesSummary = await getSummarySales({});

    return (
        <section className="bg-white border border-zinc-200 rounded-xl p-6 ">
            {/* Header más limpio */}
            <header className="flex items-center justify-between mb-6">
                <HeadingH3 className="text-base font-semibold text-zinc-900 tracking-tight">
                    Resumen de ventas
                </HeadingH3>

                <Link
                    href="/admin/reports/sales"
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-[var(--color-accent-vivid)] transition-colors"
                >
                    Detalles <GoLinkExternal size={12} />
                </Link>
            </header>

            {/* Grid minimalista con diseño de tarjetas "borde-suave" */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Ingresos", val: salesSummary?.totalSales || 0, icon: <FiDollarSign /> },
                    { label: "Ventas", val: salesSummary?.numberSales || 0, icon: <FiPackage /> },
                    { label: "Margen", val: salesSummary?.margin || 0, icon: <FiTrendingUp /> },
                    { label: "Unidades", val: salesSummary?.totalUnitsSold || 0, icon: <FiShoppingCart /> }
                ].map((item) => (
                    <div 
                        key={item.label}
                        className="group flex flex-col gap-2 p-4 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-[var(--color-accent-vivid)]/30 transition-all duration-200"
                    >
                        <div className="flex items-center gap-2 text-[var(--color-accent-vivid)] text-lg">
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">{item.label}</p>
                            <p className="text-lg font-bold text-zinc-900">{item.val.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
"use client"

import DateRangeDropdown from "@/components/admin/reports/FiltersReportsSales";
import { HeadingH2 } from "@/components/ui/Heading";
import { ArrowLeft, LayoutDashboard, Package, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
    { href: "/admin/reports/sales", label: "Vista general", icon: LayoutDashboard },
    { href: "/admin/reports/sales/products", label: "Productos", icon: Package },
    { href: "/admin/reports/sales/vendors", label: "Vendedores", icon: Users },
];

export default function SalesButtonsFilter() {
    const pathname = usePathname();

    return (
        <aside className="space-y-4">
            {/* Back Button */}
            <Link
                href="/admin/reports"
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft size={16} />
                Volver a Reportes
            </Link>

            {/* Header */}
            <div>
                <HeadingH2>Reporte de Ventas</HeadingH2>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap border-b border-border">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
                                isActive
                                    ? "border-primary text-primary bg-accent/50"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="pt-2">
                <DateRangeDropdown />
            </div>
        </aside>
    )
}
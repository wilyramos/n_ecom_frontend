"use client";

import DateRangeDropdown from "@/components/admin/reports/FiltersReportsSales";
import { HeadingH2 } from "@/components/ui/Heading";
import {
    ArrowLeft,
    LayoutDashboard, ShoppingCart,
    DollarSign,
    BarChart3
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Tabs enfocados en filtros y reportes
const tabs = [
    { href: "/admin/reports/orders", label: "Vista General", icon: LayoutDashboard },
    { href: "/admin/reports/orders/status", label: "Por Estado", icon: ShoppingCart },
    { href: "/admin/reports/orders/payments", label: "Por Método de Pago", icon: DollarSign },
    { href: "/admin/reports/orders/payment-status", label: "Por Estado de Pago", icon: BarChart3 },
];

export default function OrdersFiltersReport() {
    const pathname = usePathname();

    return (
        <div className="p-2">
            <aside className="mx-auto">
                {/* Botón de volver */}
                <Link
                    href="/admin/reports"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Volver a Reportes
                </Link>

                {/* Encabezado Principal */}
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 mb-2 gap-3">
                    <HeadingH2>Reporte de Órdenes</HeadingH2>
                    <div className="sm:ml-auto">
                        <DateRangeDropdown />
                    </div>
                </header>

                {/* Navegación de Pestañas */}
                <div className="flex overflow-x-auto border-b-2 border-gray-300 text-xs scrollbar-hide">
                    <div className="flex min-w-max gap-1">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            const Icon = tab.icon;
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-t-lg whitespace-nowrap transition-colors
                    ${isActive
                                            ? "border-b-4 border-blue-600 text-blue-600 bg-white"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{/* versión corta móvil */}{tab.label.split(" ")[0]}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </div>
    );
}

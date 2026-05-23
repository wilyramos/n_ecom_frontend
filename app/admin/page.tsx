import Link from "next/link";
import {
    Package2,
    Users2,
    ReceiptText,
    BadgeDollarSign,
    Building2,
    GitBranch,
    Shapes,
    BarChart3,
    Store,
    LayoutDashboard
} from "lucide-react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default async function AdminPage() {
    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Productos", icon: Package2 },
        { href: "/admin/clients", label: "Clientes", icon: Users2 },
        { href: "/admin/orders", label: "Órdenes", icon: ReceiptText },
        { href: "/admin/slider", label: "Slider", icon: BadgeDollarSign },
        { href: "/admin/brands", label: "Marcas", icon: Building2 },
        { href: "/admin/lines", label: "Líneas", icon: GitBranch },
        { href: "/admin/products/category", label: "Categorías", icon: Shapes },
        { href: "/admin/reports", label: "Reportes", icon: BarChart3 },
        { href: "/terminal", label: "POS", icon: Store },
    ];

    return (
        <AdminPageWrapper
            title="Panel de administración"
            showBackButton={false}
        >
            {/* Grid más ajustado y tarjetas minimalistas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group flex flex-col items-center justify-center gap-2 p-4 border border-[var(--color-border-default)] bg-[var(--color-surface-primary)] hover:border-[var(--color-accent-vivid)] transition-all duration-200 rounded-lg hover:shadow-sm"
                    >
                        {/* Icono con cambio de color al hacer hover */}
                        <Icon className="h-5 w-5 text-zinc-400 group-hover:text-[var(--color-accent-vivid)] transition-colors" />
                        
                        <span className="text-xs font-medium text-zinc-600 group-hover:text-black">
                            {label}
                        </span>
                    </Link>
                ))}
            </div>
        </AdminPageWrapper>
    );
}
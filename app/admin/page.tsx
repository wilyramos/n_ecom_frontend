import Link from "next/link";
import {
    LayoutDashboard, ShoppingBag, ShieldAlert, FileText, Boxes,
    Tags, Building2, GitFork, Images, Layers, Megaphone, Users
} from "lucide-react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default async function AdminPage() {
    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/orders", label: "Órdenes", icon: ShoppingBag },
        { href: "/admin/claims", label: "Reclamaciones", icon: ShieldAlert },
        { href: "/admin/reports", label: "Reportes", icon: FileText },
        { href: "/admin/products", label: "Productos", icon: Boxes },
        { href: "/admin/products/category", label: "Categorías", icon: Tags },
        { href: "/admin/brands", label: "Marcas", icon: Building2 },
        { href: "/admin/lines", label: "Líneas", icon: GitFork },
        { href: "/admin/slider", label: "Slider", icon: Images },
        { href: "/admin/sections", label: "Secciones", icon: Layers },
        { href: "/admin/advertisements", label: "Avisos", icon: Megaphone },
        { href: "/admin/users", label: "Usuarios", icon: Users },
    ];

    return (
        <AdminPageWrapper title="Panel de administración" showBackButton={false}>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex flex-col items-center gap-2 p-3 border border-border rounded-lg hover:border-[var(--color-accent-vivid)] transition-colors"
                    >
                        <Icon className="h-5 w-5 text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-600">{label}</span>
                    </Link>
                ))}
            </div>
        </AdminPageWrapper>
    );
}
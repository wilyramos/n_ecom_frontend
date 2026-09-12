// File: frontend/components/admin/MobileSidebar.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { 
    Menu, 
    ChevronDown, 
    ChevronRight,
    LayoutDashboard,
    ShoppingBag,
    Boxes,
    Tags,
    Building2,
    GitFork,
    FileText,
    ShieldAlert,
    Image,
    Users,
    MonitorSmartphone,
    Eye
} from "lucide-react";
import { User } from "@/src/schemas";
import { cn } from "@/lib/utils";

type NavLink = {
    href?: string;
    icon: React.ElementType;
    label: string;
    children?: { href: string; label: string }[];
    isExternal?: boolean;
};

export default function MobileSidebar({ user }: { user: User }) {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) =>
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

    const links: NavLink[] = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/orders", icon: ShoppingBag, label: "Órdenes" },
        { href: "/admin/products", icon: Boxes, label: "Productos" },
        { href: "/admin/products/category", icon: Tags, label: "Categorías" },
        { href: "/admin/brands", icon: Building2, label: "Marcas" },
        { href: "/admin/lines", icon: GitFork, label: "Líneas" },
        {
            icon: FileText,
            label: "Reportes",
            children: [
                { href: "/admin/reports", label: "Vista General" },
                { href: "/admin/reports/sales", label: "Ventas" },
                { href: "/admin/reports/orders", label: "Órdenes" },
            ],
        },
        { href: "/admin/claims", icon: ShieldAlert, label: "Reclamaciones" },
        { href: "/admin/slider", icon: Image, label: "Slider Banners" },
        { href: "/admin/users", icon: Users, label: "Usuarios" },
        { href: "/pos", icon: MonitorSmartphone, label: "Punto de Venta", isExternal: true },
        { href: "/", icon: Eye, label: "Ver Tienda", isExternal: true },
    ];

    return (
        <Sheet>
            <SheetTrigger className="p-2 rounded-md hover:bg-slate-100 transition-colors">
                <Menu className="h-6 w-6 text-slate-700" />
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-64 bg-white">
                <VisuallyHidden>
                    <SheetTitle>Menú de navegación</SheetTitle>
                </VisuallyHidden>

                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <p className="font-bold text-sm truncate text-slate-900 uppercase">{user?.nombre}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>

                <nav className="p-3 space-y-1">
                    {links.map((item) => {
                        const { href, icon: Icon, label, children, isExternal } = item;
                        const isActive = href && pathname === href;

                        if (children) {
                            const isOpen = openMenus[label];
                            return (
                                <div key={label} className="space-y-1">
                                    <button
                                        onClick={() => toggleMenu(label)}
                                        className="w-full flex items-center gap-3 py-2 px-3 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                    >
                                        <Icon className="h-5 w-5 text-slate-500" />
                                        <span className="flex-1 text-sm font-medium text-left">{label}</span>
                                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </button>

                                    {isOpen && (
                                        <div className="ml-9 space-y-1 py-1">
                                            {children.map((sub) => (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className="block py-1.5 px-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={label}
                                href={href!}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className={cn(
                                    "flex items-center gap-3 py-2 px-3 rounded-md transition-all text-sm font-medium",
                                    isActive 
                                        ? "bg-slate-900 text-white shadow-md" 
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CategoryResponse } from "@/src/schemas";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

export default function ClientCategoriasDesktop({ categories }: { categories: CategoryResponse[] }) {
    const pathname = usePathname();

    const grouped = React.useMemo(() => {
        return categories.reduce((acc, category) => {
            const parentId = category.parent
                ? (typeof category.parent === "string" ? category.parent : category.parent._id)
                : null;
            const key = parentId ?? "root";
            if (!acc[key]) acc[key] = [];
            acc[key].push(category);
            return acc;
        }, {} as Record<string, CategoryResponse[]>);
    }, [categories]);

    const rootCategories = grouped["root"] || [];

    const isRouteActive = (slug?: string) => {
        if (!slug) return false;
        const targetPath = routes.catalog({ category: slug });
        return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
    };

    return (
        <NavigationMenu className="z-50">
            <NavigationMenuList className="gap-1">
                {rootCategories.map((cat) => {
                    const sub = grouped[cat._id] || [];
                    const hasSubcategories = sub.length > 0;

                    // La raíz está activa si coincide su slug o el de alguna de sus subcategorías
                    const isRootActive = isRouteActive(cat.slug) || sub.some((subcat) => isRouteActive(subcat.slug));

                    return (
                        <NavigationMenuItem key={cat._id}>
                            {hasSubcategories ? (
                                <>
                                    <NavigationMenuTrigger
                                        className={cn(
                                            "relative bg-transparent transition-colors font-medium text-sm px-3 py-2",
                                            isRootActive
                                                ? "text-brand-charcoal font-semibold"
                                                : "text-brand-gris hover:text-brand-charcoal data-[state=open]:text-brand-charcoal"
                                        )}
                                    >
                                        <span>{cat.nombre}</span>
                                        {isRootActive && (
                                            <span 
                                                className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-brand-charcoal rounded-full" 
                                                aria-hidden="true" 
                                            />
                                        )}
                                    </NavigationMenuTrigger>

                                    <NavigationMenuContent className="border border-brand-silver-border shadow-xl rounded-xl overflow-hidden p-3 bg-background w-[380px]">
                                        <ul className="grid grid-cols-2 gap-1">
                                            {sub.map((subcat) => {
                                                const isSubActive = isRouteActive(subcat.slug);
                                                return (
                                                    <ListItem
                                                        key={subcat._id}
                                                        href={routes.catalog({ category: subcat.slug })}
                                                        title={subcat.nombre}
                                                        isActive={isSubActive}
                                                    />
                                                );
                                            })}
                                        </ul>
                                    </NavigationMenuContent>
                                </>
                            ) : (
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={routes.catalog({ category: cat.slug })}
                                        aria-current={isRootActive ? "page" : undefined}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "relative bg-transparent border-none transition-colors font-medium text-sm px-3 py-2",
                                            isRootActive
                                                ? "text-brand-charcoal font-semibold"
                                                : "text-brand-gris hover:text-brand-charcoal"
                                        )}
                                    >
                                        <span>{cat.nombre}</span>
                                        {isRootActive && (
                                            <span 
                                                className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-brand-charcoal rounded-full" 
                                                aria-hidden="true" 
                                            />
                                        )}
                                    </Link>
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function ListItem({ 
    title, 
    href, 
    isActive 
}: { 
    title: string; 
    href: string; 
    isActive: boolean;
}) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                        "flex items-center px-3 py-2 rounded-lg transition-all duration-150 border text-xs font-medium",
                        isActive
                            ? "bg-brand-action-muted text-brand-charcoal font-semibold border-brand-action/40"
                            : "border-transparent text-brand-gris hover:text-brand-charcoal hover:bg-brand-silver-border/40"
                    )}
                >
                    <span className="truncate">{title}</span>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
// File: frontend/components/navigation/ClientCategoriasDesktop.tsx
"use client";

import * as React from "react";
import Link from "next/link";
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

    return (
        <NavigationMenu className="z-50">
            <NavigationMenuList>
                {rootCategories.map((cat) => {
                    const sub = grouped[cat._id] || [];
                    const hasSubcategories = sub.length > 0;

                    return (
                        <NavigationMenuItem key={cat._id}>
                            {hasSubcategories ? (
                                <>
                                    <NavigationMenuTrigger className="text-brand-gris hover:text-brand-charcoal data-[state=open]:text-brand-charcoal bg-transparent">
                                        {cat.nombre}
                                    </NavigationMenuTrigger>

                                    <NavigationMenuContent className="border border-brand-silver-border shadow-xl rounded-md overflow-hidden p-4 bg-background w-[400px]">
                                        <ul className="grid grid-cols-2 gap-1">
                                            {sub.map((subcat) => (
                                                <ListItem
                                                    key={subcat._id}
                                                    href={routes.catalog({ category: subcat.slug })}
                                                    title={subcat.nombre}
                                                />
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </>
                            ) : (
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={routes.catalog({ category: cat.slug })}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "bg-transparent border-none text-brand-gris hover:text-brand-charcoal transition-colors font-medium text-sm px-3 py-2"
                                        )}
                                    >
                                        {cat.nombre}
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

function ListItem({ title, href }: { title: string; href: string }) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="group/link flex items-center px-3 py-2 rounded-md hover:bg-brand-silver-border/60 transition-all duration-150 border border-transparent hover:border-brand-silver-border"
                >
                    <span className="text-xs font-medium text-brand-gris group-hover/link:text-brand-charcoal transition-colors">
                        {title}
                    </span>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
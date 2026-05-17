"use client";

import * as React from "react";
import Link from "next/link";
import type { CategoryResponse } from "@/src/schemas";
import { routes } from "@/lib/routes";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
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
                    return (
                        <NavigationMenuItem key={cat._id}>
                            <NavigationMenuTrigger className="bg-transparent border-none text-fg-primary hover:text-action-primary transition-colors font-medium text-sm px-3 py-2">
                                {cat.nombre}
                            </NavigationMenuTrigger>

                            {sub.length > 0 && (
                                <NavigationMenuContent className="border border-border-default shadow-xl rounded-md overflow-hidden p-4 bg-surface-primary w-[400px]">
                                  
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
                    className="group/link flex items-center px-3 py-2 rounded-md hover:bg-surface-secondary/70 transition-all duration-150 border border-transparent hover:border-border-default/60"
                >
                    <span className="text-xs font-medium text-fg-primary group-hover/link:text-action-primary transition-colors">
                        {title}
                    </span>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
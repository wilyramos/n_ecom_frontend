"use client";

import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import type { CategoryListResponse } from "@/src/schemas";

type Props = {
    categories: CategoryListResponse;
};

export default function VisualCategoryView({ categories }: Props) {
    const grouped = categories.reduce((acc, category) => {
        const parentId =
            category.parent && typeof category.parent !== "string"
                ? category.parent._id
                : category.parent || "root";

        if (!acc[parentId]) acc[parentId] = [];
        acc[parentId].push(category);

        return acc;
    }, {} as Record<string, CategoryListResponse>);

    const rootCategories = grouped["root"] || [];

    return (
        <div className="space-y-8 mx-auto">
            {rootCategories.map((parent) => {
                const subcategories = grouped[parent._id] || [];

                return (
                    <div
                        key={parent._id}
                        className="space-y-4 border-b border-border pb-8"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-foreground">{parent.nombre}</h2>
                            <Link
                                href={`/admin/products/category/${parent._id}`}
                                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <FaEdit className="text-sm" />
                                Editar categoría
                            </Link>
                        </div>

                        <div className="overflow-hidden rounded-md border border-border bg-card">
                            <table className="min-w-full table-fixed text-xs">
                                <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="px-4 py-3 w-1/3 text-left">Nombre</th>
                                        <th className="px-4 py-3 w-1/3 text-left">Descripción</th>
                                        <th className="px-4 py-3 w-1/3 text-right">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {subcategories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-4 py-6 text-center text-muted-foreground italic"
                                            >
                                                Sin subcategorías vinculadas.
                                            </td>
                                        </tr>
                                    ) : (
                                        subcategories.map((subcat) => (
                                            <tr
                                                key={subcat._id}
                                                className="hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-4 py-3 truncate text-foreground font-medium">
                                                    {subcat.nombre}
                                                </td>

                                                <td className="px-4 py-3 text-muted-foreground truncate">
                                                    {subcat.descripcion || "-"}
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={`/admin/products/category/${subcat._id}`}
                                                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        <FaEdit className="text-xs" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
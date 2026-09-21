// File: frontend/app/admin/products/category/[id]/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCategory, getPatternCategories } from "@/src/services/categorys";
import EditCategoryForm from "@/components/admin/category/EditCategoryForm";
import DeleteCategoryButton from "@/components/admin/category/DeleteCategoryButton";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";

type Params = Promise<{ id: string }>;

export default async function CategoryPageDetails({
    params,
}: {
    params: Params;
}) {
    const { id } = await params;
    const [category, patternCategories] = await Promise.all([
        getCategory(id),
        getPatternCategories(),
    ]);

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
            <AdminActionBar
                leftContent={
                    <span className="text-xs font-semibold text-zinc-800 truncate">
                        Editar: {category.nombre}
                    </span>
                }
            >
                <div className="flex items-center gap-2">
                    <DeleteCategoryButton categoryId={category._id} />

                    <Link
                        href="/admin/products/category"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Volver a Categorías</span>
                    </Link>
                </div>
            </AdminActionBar>

            <EditCategoryForm
                category={category}
                categories={patternCategories || []}
            />
        </AdminPageContainer>
    );
}
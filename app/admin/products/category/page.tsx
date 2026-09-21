// File: frontend/app/admin/products/category/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { getCategories } from "@/src/services/categorys";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/src/components/admin/layout/admin-page-header";
import { AdminButton } from "@/src/components/admin/layout/admin-button";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import VisualCategoryView from "@/components/admin/category/VisualCategoryView";

export default async function CreatePageCategory() {
  const categories = await getCategories();

  return (
    <AdminPageContainer maxWidth="default" spacing="default">
      <AdminPageHeader
        actions={
          <AdminButton asChild variant="primary" icon={Plus}>
            <Link href="/admin/products/category/new">Nueva Categoría</Link>
          </AdminButton>
        }
      />

      {!categories || categories.length === 0 ? (
        <AdminCardWrapper padding="lg">
          <div className="py-12 text-center space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              No hay categorías registradas
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Crea tu primera categoría principal para empezar a organizar el catálogo comercial.
            </p>
            <div className="pt-2">
              <AdminButton asChild variant="outline" size="sm" icon={Plus}>
                <Link href="/admin/products/category/new">Crear Categoría</Link>
              </AdminButton>
            </div>
          </div>
        </AdminCardWrapper>
      ) : (
        <VisualCategoryView categories={categories} />
      )}
    </AdminPageContainer>
  );
}
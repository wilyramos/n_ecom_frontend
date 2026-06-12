import EditCategoryForm from "@/components/admin/category/EditCategoryForm";
import { getCategory, getPatternCategories } from "@/src/services/categorys";
import DeleteCategoryButton from "@/components/admin/category/DeleteCategoryButton";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

type Params = Promise<{ id: string }>;

export default async function CategoryPageDetails({ params }: { params: Params }) {
    const { id } = await params;
    const category = await getCategory(id);
    const patternCategories = await getPatternCategories();

    return (
        <AdminPageWrapper
            title={`Editar: ${category.nombre}`}
            
            actions={
                <div className="flex gap-2">
                  
                    <DeleteCategoryButton categoryId={category._id} />
                </div>
            }
        >
            {/* Formulario envuelto en tarjeta */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <EditCategoryForm 
                    category={category}
                    categories={patternCategories}
                />
            </div>
        </AdminPageWrapper>
    );
}
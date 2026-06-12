import { getCategories } from "@/src/services/categorys";
import CreateCategoryForm from "@/components/admin/category/CreateCategoryForm";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default async function NewCategoryPage() {
    const categories = await getCategories();

    return (
        <AdminPageWrapper
            title="Crear nueva categoría"
           
        >
            <div className="bg-card border border-border rounded-xl p-6">
                <CreateCategoryForm categories={categories} />
            </div>
        </AdminPageWrapper>
    );
}
import { LinesClient } from "./components/lines-client";
import { linesService } from "@/src/services/lines.service";
import { getBrands } from "@/src/services/brands";
import { getCategories } from "@/src/services/categorys";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default async function LinesPage() {
    const [linesData, brandsData, categoriesData] = await Promise.all([
        linesService.getAll().catch((err) => {
            console.error("Error fetching lines:", err);
            return [];
        }),
        getBrands().catch((err) => {
            console.error("Error fetching brands:", err);
            return [];
        }),
        getCategories().catch((err) => {
            console.error("Error fetching categories:", err);
            return [];
        }),
    ]);

    return (
        <AdminPageWrapper
            title="Líneas de Producto"
        >
            <LinesClient
                initialData={linesData}
                brands={brandsData}
                categories={categoriesData}
            />
        </AdminPageWrapper>
    );
}
// app/admin/lines/page.tsx
import { LinesClient } from "./components/lines-client";
import { linesService } from "@/src/services/lines.service";
import { getBrands } from "@/src/services/brands";
import { getCategories } from "@/src/services/categorys";

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
        <div className="flex-1 space-y-4 p-8 pt-6">
            <LinesClient
                initialData={linesData}
                brands={brandsData}
                categories={categoriesData}
            />
        </div>
    );
}
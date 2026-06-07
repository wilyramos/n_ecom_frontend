//File: frontend/app/admin/sections/[id]/edit/page.tsx

import { getSectionById } from "@/src/services/section-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import EditSectionClient from "@/components/admin/sections/EditSectionClient";
import { notFound } from "next/navigation";

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSectionPage({ params }: EditPageProps) {
    const { id } = await params;
    
    let sectionData;
    try {
        sectionData = await getSectionById(id);
    } catch {
        return notFound();
    }

    return (
        <AdminPageWrapper
            title="Configuración de la Sección"
            breadcrumbItems={[{ label: "Panel", href: "/admin" }, { label: "Secciones", href: "/admin/sections" }]}
            breadcrumbCurrent="Editar"
            showBackButton={true}
        >
            <div className="py-2">
                <EditSectionClient sectionData={sectionData} />
            </div>
        </AdminPageWrapper>
    );
}
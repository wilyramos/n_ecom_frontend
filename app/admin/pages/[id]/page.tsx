// File: frontend/app/admin/pages/[id]/page.tsx

import { notFound } from "next/navigation";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import EditPageForm from "@/components/admin/pages/EditPageForm";
import { PageService } from "@/src/services/page-service";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: Props) {
    const { id } = await params;
    let pageData;

    try {
        pageData = await PageService.getPageById(id);
    } catch (error) {
        console.error("Error fetching page data:", error);
        return notFound();
    }

    return (
        <AdminPageWrapper 
            title={`Editar Página: ${pageData.title}`}
            breadcrumbItems={[
                { label: "Panel", href: "/admin" },
                { label: "Páginas", href: "/admin/pages" }
            ]}
            showBackButton={true}
        >
            <div className="max-w-screen-2xl mx-auto p-6">
                <EditPageForm id={id} initialData={pageData} />
            </div>
        </AdminPageWrapper>
    );
}
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import NewSectionClient from "@/components/admin/sections/NewSectionClient";

export default function NewSectionPage() {
    return (
        <AdminPageWrapper
            title="Nueva Sección"
            breadcrumbItems={[{ label: "Panel", href: "/admin" }, { label: "Secciones", href: "/admin/sections" }]}
            breadcrumbCurrent="Nueva"
            showBackButton={true}
        >
            <div className="py-2">
                <NewSectionClient />
            </div>
        </AdminPageWrapper>
    );
}
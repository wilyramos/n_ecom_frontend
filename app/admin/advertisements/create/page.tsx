import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import NewAdvertisementClient from "@/components/admin/advertisements/NewAdvertisementClient";

export default function NewAdvertisementPage() {
    return (
        <AdminPageWrapper
            title="Nueva Campaña"
            breadcrumbItems={[
                { label: "Panel", href: "/admin" }, 
                { label: "Avisos", href: "/admin/advertisements" }
            ]}
            breadcrumbCurrent="Nueva"
            showBackButton={true}
        >
            <div className="py-2">
                <NewAdvertisementClient />
            </div>
        </AdminPageWrapper>
    );
}
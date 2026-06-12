//File: frontend/app/admin/sections/new/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import NewSectionClient from "@/components/admin/sections/NewSectionClient";

export default function NewSectionPage() {
    return (
        <AdminPageWrapper
            title="Nueva Sección"
            showBackButton={true}
        >
            <div className="py-2">
                <NewSectionClient />
            </div>
        </AdminPageWrapper>
    );
}
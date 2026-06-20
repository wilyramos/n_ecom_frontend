// File: frontend/app/admin/pages/create/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CreatePageForm from "@/components/admin/pages/CreatePageForm";

export default function NewPage() {
    return (
        <AdminPageWrapper title="Nueva Página Institucional">
            <div className="max-w-screen-2xl mx-auto p-6">
                <CreatePageForm />
            </div>
        </AdminPageWrapper>
    );
}
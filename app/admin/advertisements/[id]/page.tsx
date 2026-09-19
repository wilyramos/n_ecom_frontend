// File: frontend/app/admin/advertisements/[id]/page.tsx
import { notFound } from "next/navigation";
import { verifySession } from "@/src/auth/dal";
import { AdvertisementService } from "@/src/services/advertisement-service";
import EditAdvertisementClient from "@/components/admin/advertisements/EditAdvertisementClient";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditAdvertisementPage({ params }: PageProps) {
    const session = await verifySession();
    const { id } = await params;

    let initialData;
    try {
        initialData = await AdvertisementService.getById(id, session.token);
    } catch (error) {
        console.error("Error al recuperar el anuncio solicitado:", error);
        return notFound();
    }

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
            <EditAdvertisementClient initialData={initialData} />
        </AdminPageContainer>
    );
}
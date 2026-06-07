import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import EditAdvertisementClient from "@/components/admin/advertisements/EditAdvertisementClient";
import { verifySession } from "@/src/auth/dal";
import { AdvertisementService } from "@/src/services/advertisement-service";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditAdvertisementPage({ params }: PageProps) {
    const session = await verifySession();
    const { id } = await params;

    let initialData;
    try {
        // Recuperamos la información actual del anuncio desde el backend
        initialData = await AdvertisementService.getById(id, session.token);
    } catch (error) {
        console.error("Error al recuperar el anuncio solicitado:", error);
        return notFound();
    }

    return (
        <AdminPageWrapper
            title="Editar Campaña"
            breadcrumbItems={[
                { label: "Panel", href: "/admin" },
                { label: "Avisos", href: "/admin/advertisements" }
            ]}
            breadcrumbCurrent="Editar"
            showBackButton={true}
        >
            <div className="py-2">
                <EditAdvertisementClient initialData={initialData} />
            </div>
        </AdminPageWrapper>
    );
}
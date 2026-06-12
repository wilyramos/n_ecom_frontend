// File: frontend/app/(admin)/admin/slider/[id]/page.tsx
import { notFound } from "next/navigation";
import { SliderService } from "@/src/services/slider-service";
import EditSliderBannerForm from "@/components/admin/banner/EditSliderBannerForm";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditSliderBannerPage({ params }: Props) {
    const { id } = await params;
    const banner = await SliderService.getById(id);

    if (!banner) notFound();

    return (
        <AdminPageWrapper
            title={banner.title ?? "Editar Banner"}
            showBackButton={true}
            actions={
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded"
                    style={{
                        backgroundColor: banner.isActive ? "#dcfce7" : "#f4f4f5",
                        color: banner.isActive ? "#15803d" : "#71717a",
                    }}>
                    {banner.isActive ? "Activo" : "Inactivo"}
                </span>
            }
        >
            <EditSliderBannerForm id={id} initialData={banner} />
        </AdminPageWrapper>
    );
}
// File: frontend/app/(admin)/admin/slider/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { SliderService } from "@/src/services/slider-service";
import EditSliderBannerForm from "@/components/admin/banner/EditSliderBannerForm";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";
import { AdminStatusBadge } from "@/src/components/admin/layout/admin-status-badge";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSliderBannerPage({ params }: Props) {
  const { id } = await params;
  const banner = await SliderService.getById(id);

  if (!banner) notFound();

  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
      <AdminActionBar
        leftContent={
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-xs font-semibold text-zinc-900 truncate max-w-[260px] sm:max-w-md">
              {banner.title || "Editar Banner"}
            </span>
            <AdminStatusBadge status={banner.isActive ? "active" : "inactive"} />
          </div>
        }
      >
        <div className="flex items-center gap-1.5">
          <Link
            href={`/admin/slider/${id}/preview`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
            title="Ver preview"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ver preview</span>
          </Link>

          <Link
            href="/admin/slider"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver al listado</span>
          </Link>
        </div>
      </AdminActionBar>

      <EditSliderBannerForm id={id} initialData={banner} />
    </AdminPageContainer>
  );
}
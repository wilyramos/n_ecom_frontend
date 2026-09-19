// File: frontend/app/admin/banner/new/page.tsx

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CreateSliderBannerForm from "@/components/admin/banner/CreateSliderBannerForm";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";

export default function NewSliderPage() {
    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
            <AdminActionBar
                leftContent={
                    <span className="text-xs font-semibold text-zinc-900">
                        Nuevo Banner del Slider
                    </span>
                }
            >
                <Link
                    href="/admin/slider"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Volver al listado</span>
                </Link>
            </AdminActionBar>

            <CreateSliderBannerForm />
        </AdminPageContainer>
    );
}
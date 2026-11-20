// File: frontend/app/admin/cupones/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import SpinnerLoading from "@/components/ui/SpinnerLoading";
import CuponesTable from "@/src/modules/cupones/components/CuponesTable";
import { obtenerCupones } from "@/src/modules/cupones/services/cupones.service";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";

type SearchParams = Promise<{
  page?: string;
  limit?: string;
  search?: string;
  estado?: string;
}>;

export default async function CuponesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const estado = params.estado === "activo" || params.estado === "inactivo" ? params.estado : undefined;

  const cupones = await obtenerCupones({
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    search: params.search?.trim() || undefined,
    estado,
  });

  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
      <AdminActionBar>
        <Link
          href="/admin/cupones/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2]" />
          <span>Nuevo cupón</span>
        </Link>
      </AdminActionBar>

      <AdminCardWrapper padding="none" className="border-zinc-200/80 shadow-2xs">
        <Suspense fallback={<SpinnerLoading />}>
          <CuponesTable cupones={cupones} />
        </Suspense>
      </AdminCardWrapper>
    </AdminPageContainer>
  );
}

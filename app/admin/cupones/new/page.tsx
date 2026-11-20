// File: frontend/app/admin/cupones/new/page.tsx

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CuponForm from "@/src/modules/cupones/components/CuponForm";
import { getCategories } from "@/src/services/categorys";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/src/components/admin/layout/admin-page-header";

export default async function NuevoCuponPage() {
  const categorias = await getCategories();

  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
      <AdminPageHeader
        title="Nuevo cupón"
        description="Define el descuento, las condiciones de uso y a qué productos aplica."
        actions={
          <Link href="/admin/cupones" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a cupones
          </Link>
        }
      />
      <CuponForm categorias={categorias} />
    </AdminPageContainer>
  );
}

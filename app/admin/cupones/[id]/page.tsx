// File: frontend/app/admin/cupones/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import CuponForm from "@/src/modules/cupones/components/CuponForm";
import { obtenerCuponPorId } from "@/src/modules/cupones/services/cupones.service";
import { getCategories } from "@/src/services/categorys";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/src/components/admin/layout/admin-page-header";

export default async function EditarCuponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [cupon, categorias] = await Promise.all([obtenerCuponPorId(id), getCategories()]);
  if (!cupon) notFound();

  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
      <AdminPageHeader
        title={`Cupón ${cupon.codigo}`}
        description={`${cupon.usos ?? 0} pedido(s) lo han usado`}
        actions={
          <Link href="/admin/cupones" className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a cupones
          </Link>
        }
      />
      <CuponForm cupon={cupon} categorias={categorias} />
    </AdminPageContainer>
  );
}

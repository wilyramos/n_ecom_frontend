// File: frontend/components/admin/advertisements/AdvertisementTableList.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TAdvertisement, AD_LAYOUT_LABELS } from "@/src/schemas/advertisement.schema";
import { toggleAdStatusAction, deleteAdvertisementAction } from "@/actions/advertisement-actions";
import { Edit2, Trash2, Calendar, Eye, EyeOff, ExternalLink, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminTableEmpty,
} from "@/src/components/admin/layout/admin-table";
import { AdminStatusBadge } from "@/src/components/admin/layout/admin-status-badge";
import { AdminTablePagination } from "@/src/components/admin/layout/admin-table-pagination";

interface AdvertisementTableListProps {
  initialAds: TAdvertisement[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

export default function AdvertisementTableList({
  initialAds,
  pagination,
}: AdvertisementTableListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [ads, setAds] = useState<TAdvertisement[]>(initialAds);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (ads !== initialAds && !isPending) {
    setAds(initialAds);
  }

  const updateUrlParams = (overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setErrorMsg(null);
    setAds((prev) =>
      prev.map((ad) => (ad._id === id ? { ...ad, isActive: !currentStatus } : ad))
    );

    startTransition(async () => {
      const res = await toggleAdStatusAction(id, currentStatus);
      if (!res.ok) {
        setAds((prev) =>
          prev.map((ad) => (ad._id === id ? { ...ad, isActive: currentStatus } : ad))
        );
        setErrorMsg(res.error || "No se pudo cambiar el estado del anuncio.");
      }
    });
  };

  const handleDeleteAd = (id: string) => {
    setErrorMsg(null);
    if (!confirm("¿Deseas eliminar permanentemente esta campaña publicitaria?")) return;

    startTransition(async () => {
      const res = await deleteAdvertisementAction(id);
      if (res.ok) {
        setAds((prev) => prev.filter((ad) => ad._id !== id));
      } else {
        setErrorMsg(res.error || "Error al procesar la eliminación.");
      }
    });
  };

  return (
    <div className="w-full flex flex-col">
      {errorMsg && (
        <div className="m-3 flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-xs text-rose-700 font-medium">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <AdminTable className="min-w-[900px]">
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell width="300px">Campaña</AdminTableHeaderCell>
            <AdminTableHeaderCell width="110px">Miniatura</AdminTableHeaderCell>
            <AdminTableHeaderCell width="180px">Formato</AdminTableHeaderCell>
            <AdminTableHeaderCell width="200px">Vigencia</AdminTableHeaderCell>
            <AdminTableHeaderCell width="90px" align="center">
              Estado
            </AdminTableHeaderCell>
            <AdminTableHeaderCell width="90px" align="right">
              Acciones
            </AdminTableHeaderCell>
          </tr>
        </AdminTableHead>

        <tbody className="divide-y divide-zinc-100 bg-white">
          {ads.length === 0 ? (
            <AdminTableEmpty
              title="No hay campañas publicitarias registradas"
              description="Crea un anuncio para publicarlo en el encabezado o en ventana emergente."
              colSpan={6}
            />
          ) : (
            ads.map((ad) => {
              const hasDate = ad.startDate || ad.endDate;
              const displayTitle = ad.title || "Campaña sin título";

              return (
                <tr key={ad._id} className="hover:bg-zinc-50/60 transition-colors text-xs">
                  <AdminTableCell className="w-[300px]">
                    <div className="space-y-0.5 pr-2">
                      <p className="font-semibold text-zinc-900 truncate" title={displayTitle}>
                        {displayTitle}
                      </p>
                      {ad.subtitle && (
                        <p className="text-zinc-500 text-[11px] truncate" title={ad.subtitle}>
                          {ad.subtitle}
                        </p>
                      )}
                      {ad.linkTo && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] text-zinc-400 font-normal truncate max-w-xs">
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          {ad.linkTo}
                        </span>
                      )}
                    </div>
                  </AdminTableCell>

                  <AdminTableCell className="w-[110px]">
                    {ad.imageUrl ? (
                      <div className="relative h-9 w-14 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 shadow-2xs">
                        <Image
                          src={ad.imageUrl}
                          alt={displayTitle}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-9 w-14 flex items-center justify-center rounded-md border border-zinc-200/80 bg-zinc-50 text-zinc-300">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </AdminTableCell>

                  <AdminTableCell className="w-[180px]">
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80 whitespace-nowrap">
                      {AD_LAYOUT_LABELS[ad.layout]}
                    </span>
                  </AdminTableCell>

                  <AdminTableCell className="w-[200px]">
                    {hasDate ? (
                      <div className="flex flex-col gap-0.5 text-[11px] text-zinc-600">
                        {ad.startDate && (
                          <span>Desde: {new Date(ad.startDate).toLocaleDateString("es-PE")}</span>
                        )}
                        {ad.endDate && (
                          <span>Hasta: {new Date(ad.endDate).toLocaleDateString("es-PE")}</span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        Indefinida
                      </span>
                    )}
                  </AdminTableCell>

                  <AdminTableCell align="center" className="w-[90px]">
                    <AdminStatusBadge status={ad.isActive ? "active" : "inactive"} />
                  </AdminTableCell>

                  <AdminTableCell align="right" className="w-[90px]">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleToggleActive(ad._id, ad.isActive)}
                        title={ad.isActive ? "Pausar campaña" : "Activar campaña"}
                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {ad.isActive ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </button>

                      <Link
                        href={`/admin/advertisements/${ad._id}`}
                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors cursor-pointer"
                        title="Editar campaña"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDeleteAd(ad._id)}
                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200/60 transition-colors cursor-pointer disabled:opacity-50"
                        title="Eliminar campaña"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </AdminTableCell>
                </tr>
              );
            })
          )}
        </tbody>
      </AdminTable>

      <div className="w-full shrink-0 border-t border-zinc-200/80">
        <AdminTablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          onPageChange={(p) => updateUrlParams({ page: p })}
          onPageSizeChange={(s) => updateUrlParams({ limit: s, page: 1 })}
        />
      </div>
    </div>
  );
}
// File: app/(admin)/admin/claims/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertCircle, FileText, Calendar, Clock } from "lucide-react";

import { ClaimService } from "@/src/services/claim-service";
import ResolveForm from "@/components/admin/claims/ResolveForm";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminActionBar } from "@/src/components/admin/layout/admin-action-bar";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import { AdminDetailGroup } from "@/src/components/admin/layout/admin-detail-group";
import { cn } from "@/lib/utils";

interface DetailProps {
    params: Promise<{ id: string }>;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    Resuelto: {
        label: "Resuelto",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
    "En Proceso": {
        label: "En Proceso",
        className: "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    Pendiente: {
        label: "Pendiente",
        className: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
};

export default async function ClaimDetailPage({ params }: DetailProps) {
    const { id } = await params;
    const claim = await ClaimService.getClaimById(id).catch(() => null);

    if (!claim) notFound();

    const status = STATUS_CONFIG[claim.resolution.estado] || {
        label: claim.resolution.estado,
        className: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const isQueja = claim.detail.tipoReclamo === "Queja";

    return (
        <AdminPageContainer maxWidth="default" padding="default" spacing="compact">
            {/* Barra Superior con Identificador y Botón Volver */}
            <AdminActionBar
                leftContent={
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xs font-semibold text-zinc-900">
                            Hoja de Reclamación
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {claim.correlativo}
                        </span>
                        <span
                            className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                                status.className
                            )}
                        >
                            {status.label}
                        </span>
                    </div>
                }
            >
                <Link
                    href="/admin/claims"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Volver a Reclamaciones</span>
                </Link>
            </AdminActionBar>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                {/* Columna Izquierda: Datos del Consumidor y Suceso */}
                <div className="lg:col-span-2 space-y-3.5">
                    {/* Tarjeta 1: Información del Consumidor */}
                    <AdminCardWrapper
                        title="1. Datos del Consumidor"
                        description="Información de contacto e identificación consignada en el libro."
                        padding="default"
                    >
                        <AdminDetailGroup
                            columns={2}
                            items={[
                                {
                                    label: "Nombre / Razón Social",
                                    value: claim.consumer.nombres,
                                },
                                {
                                    label: "Documento de Identidad",
                                    value: `${claim.consumer.tipoDocumento}: ${claim.consumer.numeroDocumento}`,
                                },
                                {
                                    label: "Teléfono Móvil",
                                    value: claim.consumer.celular,
                                },
                                {
                                    label: "Correo Electrónico",
                                    value: claim.consumer.email,
                                },
                                {
                                    label: "Dirección Domiciliaria",
                                    value: claim.consumer.direccion,
                                    fullWidth: true,
                                },
                                {
                                    label: "Ciudad / Provincia",
                                    value: claim.consumer.ciudad,
                                },
                                {
                                    label: "Región / Departamento",
                                    value: claim.consumer.region,
                                },
                            ]}
                        />
                    </AdminCardWrapper>

                    {/* Tarjeta 2: Hecho e Incidencia Declarada */}
                    <AdminCardWrapper
                        title="2. Declaración del Suceso"
                        description="Especificación de la incidencia y pretensión formal del usuario."
                        padding="default"
                    >
                        <div className="space-y-4 text-xs">
                            <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-500 font-medium">Tipo:</span>
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] border",
                                            isQueja
                                                ? "bg-purple-50 text-purple-700 border-purple-200/60"
                                                : "bg-sky-50 text-sky-700 border-sky-200/60"
                                        )}
                                    >
                                        {isQueja ? (
                                            <AlertCircle className="w-3 h-3" />
                                        ) : (
                                            <FileText className="w-3 h-3" />
                                        )}
                                        {claim.detail.tipoReclamo}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-slate-500 font-medium">Fecha del hecho:</span>
                                    <span className="font-semibold text-slate-800">
                                        {new Date(claim.detail.fechaIncidencia).toLocaleDateString("es-PE")}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                                    Detalle del Reclamo / Queja
                                </span>
                                <div className="p-3.5 rounded-lg bg-slate-50/50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                                    {claim.detail.detalle}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                                    Pedido o Solicitud del Consumidor
                                </span>
                                <div className="p-3.5 rounded-lg bg-slate-50/50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                                    {claim.detail.pedido}
                                </div>
                            </div>
                        </div>
                    </AdminCardWrapper>
                </div>

                {/* Columna Derecha: Auditoría y Formulario de Resolución */}
                <div className="space-y-3.5">
                    {/* Metadatos de Auditoría */}
                    <AdminCardWrapper
                        title="Auditoría del Registro"
                        padding="default"
                    >
                        <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2 text-slate-600">
                                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-[11px] text-slate-400 font-medium">Fecha de Emisión</p>
                                    <p className="font-semibold text-slate-800">
                                        {new Date(claim.createdAt).toLocaleString("es-PE", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {claim.resolution.fechaRespuesta && (
                                <div className="flex items-start gap-2 text-slate-600 pt-2 border-t border-slate-100">
                                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-slate-400 font-medium">Última Respuesta</p>
                                        <p className="font-semibold text-slate-800">
                                            {new Date(claim.resolution.fechaRespuesta).toLocaleString("es-PE", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </AdminCardWrapper>

                    {/* Formulario de Respuesta y Resolución Oficial */}
                    <AdminCardWrapper
                        title="Resolución Oficial"
                        description="Emite la respuesta legal formal que será notificada al cliente."
                        padding="default"
                    >
                        <ResolveForm claim={claim} />
                    </AdminCardWrapper>
                </div>
            </div>
        </AdminPageContainer>
    );
}
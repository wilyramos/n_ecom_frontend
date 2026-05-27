// File: app/(admin)/admin/claims/[id]/page.tsx
import { ClaimService } from "@/src/services/claim-service";
import { notFound } from "next/navigation";
import ResolveForm from "@/components/admin/claims/ResolveForm";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

interface DetailProps {
    params: Promise<{ id: string }>;
}

export default async function ClaimDetailPage({ params }: DetailProps) {
    const { id } = await params;
    const claim = await ClaimService.getClaimById(id).catch(() => null);

    if (!claim) notFound();

    const breadcrumbs = [
        { label: "Dashboard", href: "/admin" },
        { label: "Reclamaciones", href: "/admin/claims" },
    ];

    // Mapeo exacto basado en las utilidades de color de tu tema CSS
    const getBadgeStyles = (estado: string) => {
        switch (estado) {
            case "Resuelto":
                return "text-success border-success bg-background-secondary";
            case "En Proceso":
                return "text-warning border-warning bg-background-secondary";
            default:
                return "text-[var(--destructivered)] border-[var(--destructivered)] bg-background-secondary";
        }
    };

    // Renderizamos la etiqueta de estado directamente en la sección de acciones del wrapper
    const actionBadge = (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyles(claim.resolution.estado)}`}>
            {claim.resolution.estado}
        </span>
    );

    return (
        <AdminPageWrapper
            title={`Hoja de Reclamación ${claim.correlativo}`}
            breadcrumbItems={breadcrumbs}
            breadcrumbCurrent={claim.correlativo}
            showBackButton={true}
            actions={actionBadge}
        >
            <div className="bg-card text-card-foreground rounded-lg border border-border p-6 space-y-6 shadow-sm">
                <header className="border-b border-border pb-4">
                    <h2 className="text-sm font-semibold">Auditoría del Ticket</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Registrado oficialmente el: {new Date(claim.createdAt).toLocaleString("es-PE")}
                    </p>
                </header>

                {/* Bloque: Datos del Reclamante */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1 bg-background-secondary p-4 rounded-lg border border-border">
                        <h3 className="font-semibold mb-2 text-foreground">1. Información Personal</h3>
                        <p><span className="text-muted-foreground font-medium">Nombre / Razón Social:</span> {claim.consumer.nombres}</p>
                        <p><span className="text-muted-foreground font-medium">{claim.consumer.tipoDocumento}:</span> {claim.consumer.numeroDocumento}</p>
                        <p><span className="text-muted-foreground font-medium">Celular:</span> {claim.consumer.celular}</p>
                        <p><span className="text-muted-foreground font-medium">Email:</span> {claim.consumer.email}</p>
                    </div>
                    <div className="space-y-1 bg-background-secondary p-4 rounded-lg border border-border">
                        <h3 className="font-semibold mb-2 text-foreground">2. Ubicación y Contacto</h3>
                        <p><span className="text-muted-foreground font-medium">Dirección:</span> {claim.consumer.direccion}</p>
                        <p><span className="text-muted-foreground font-medium">Ciudad / Provincia:</span> {claim.consumer.ciudad}</p>
                        <p><span className="text-muted-foreground font-medium">Región / Departamento:</span> {claim.consumer.region}</p>
                    </div>
                </section>

                {/* Bloque: Detalles del Hecho */}
                <section className="bg-background-secondary p-4 rounded-lg space-y-3 text-sm border border-border">
                    <h3 className="font-semibold text-foreground border-b border-border pb-1">3. Detalle del Suceso e Incidencia</h3>
                    <p>
                        <span className="text-muted-foreground font-medium">Tipo de Incidencia:</span>{" "}
                        <span className={`font-bold uppercase ${claim.detail.tipoReclamo === "Queja" ? "text-primary" : "text-action-cta"}`}>
                            {claim.detail.tipoReclamo}
                        </span>
                    </p>
                    <p>
                        <span className="text-muted-foreground font-medium">Fecha declarada de la incidencia:</span>{" "}
                        {new Date(claim.detail.fechaIncidencia).toLocaleDateString("es-PE")}
                    </p>

                    <div className="mt-2">
                        <span className="text-muted-foreground font-medium block mb-1">Hechos sustentados por el consumidor:</span>
                        <p className="text-foreground bg-background p-3 rounded-lg border border-border whitespace-pre-wrap text-xs leading-relaxed shadow-sm">
                            {claim.detail.detalle}
                        </p>
                    </div>

                    <div className="mt-2">
                        <span className="text-muted-foreground font-medium block mb-1">Pedido o pretensión concreta del consumidor:</span>
                        <p className="text-foreground bg-background p-3 rounded-lg border border-border whitespace-pre-wrap text-xs leading-relaxed shadow-sm">
                            {claim.detail.pedido}
                        </p>
                    </div>
                </section>

                {/* Formulario administrativo */}
                <section className="pt-2">
                    <h3 className="font-semibold text-sm mb-3 text-foreground">4. Resolución Oficial del Proveedor</h3>
                    <ResolveForm claim={claim} />
                </section>
            </div>
        </AdminPageWrapper>
    );
}
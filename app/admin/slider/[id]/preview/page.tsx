// File: app/(admin)/admin/slider/[id]/preview/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { SliderBannerSlide } from "@/components/banner/SliderBannerSlide";
import { SliderService } from "@/src/services/slider-service";
import { cn } from "@/lib/utils";

interface Props {
    params: Promise<{ id: string }>;
}

const LAYOUT_LABELS: Record<string, string> = {
    "image-only": "Solo medio",
    "background-media": "Medio de fondo con texto",
};

export default async function SliderBannerPreviewPage({ params }: Props) {
    const { id } = await params;
    const banner = await SliderService.getById(id);
    if (!banner) notFound();

    const formatDate = (date?: Date | string) => {
        if (!date) return "";
        return new Date(date).toLocaleString("es-PE", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    const isVideo = Boolean(banner.media?.videoUrl);
    const mediaUrl = banner.media?.videoUrl || banner.media?.imageUrl || "";

    return (
        <AdminPageWrapper
            title="Preview del Banner"
            actions={
                <div className="flex gap-2">
                    <Link href={`/admin/slider/${id}`} className={buttonVariants({ variant: "default" })}>
                        Editar
                    </Link>
                    <Link href="/admin/slider" className={buttonVariants({ variant: "outline" })}>
                        Listado
                    </Link>
                </div>
            }
        >
            <div className="space-y-8">
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Preview</h3>
                    <div className="overflow-hidden rounded-sm border border-border bg-black shadow-lg">
                        <SliderBannerSlide banner={banner} />
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Diseño y Medio">
                        <div className="space-y-3">
                            <Row label="Estilo" value={LAYOUT_LABELS[banner.design.layout] ?? banner.design.layout} />
                            <Row label="Tema del texto" value={banner.design.theme === "light" ? "Claro" : "Oscuro"} />
                            <Row label="Tipo de medio" value={isVideo ? "Video" : "Imagen"} />
                            {mediaUrl && <Row label="Archivo" value={mediaUrl} mono truncate />}
                        </div>
                    </Card>

                    <Card title="Contenido">
                        <div className="space-y-3">
                            <Row label="Título" value={banner.title ?? "Sin título"} />
                            {banner.subtitle && <Row label="Subtítulo" value={banner.subtitle} />}
                            {banner.destUrl && <Row label="Enlace de destino" value={banner.destUrl} mono truncate />}
                            <Row label="Apertura" value={banner.openInNewTab ? "Nueva pestaña" : "Misma pestaña"} />
                        </div>
                    </Card>

                    <Card title="Publicación">
                        <div className="space-y-3">
                            <Row label="Estado" value={banner.isActive ? "Activo" : "Inactivo"} />
                            <Row label="Orden" value={`#${banner.order}`} />
                            {banner.schedule?.startsAt && <Row label="Mostrar desde" value={formatDate(banner.schedule.startsAt)} />}
                            {banner.schedule?.endsAt && <Row label="Mostrar hasta" value={formatDate(banner.schedule.endsAt)} />}
                            {!banner.schedule?.startsAt && !banner.schedule?.endsAt && (
                                <Row label="Programación" value="Siempre visible" />
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AdminPageWrapper>
    );
}

/* ──────────────── Componentes de UI Locales ──────────────── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-sm border border-border bg-card p-5 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">{title}</h4>
            {children}
        </div>
    );
}

function Row({ label, value, mono = false, truncate = false }: { label: string; value: string; mono?: boolean; truncate?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border/20 pb-1.5 last:border-0 last:pb-0">
            <span className="text-xs shrink-0 text-muted-foreground">{label}</span>
            <span
                className={cn(
                    "text-xs text-right text-foreground font-medium",
                    mono && "font-mono",
                    truncate && "truncate max-w-[240px] md:max-w-[340px]"
                )}
                title={value}
            >
                {value}
            </span>
        </div>
    );
}

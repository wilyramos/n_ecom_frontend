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
    "image-only": "Solo Imagen",
    "default": "Default (Media Derecha)",
    "media-left": "Media Izquierda",
    "background-media": "Fondo con Media",
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
                {/* Visual Preview */}
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Preview</h3>
                    <div className="overflow-hidden rounded-sm border border-border bg-black shadow-lg">
                        <SliderBannerSlide banner={banner} />
                    </div>
                </section>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sección Diseño */}
                    <Card title="Diseño y Estructura">
                        <div className="space-y-3">
                            <Row label="Layout" value={LAYOUT_LABELS[banner.design.layout] ?? banner.design.layout} />
                            <Row label="Tema Base" value={banner.design.theme ? banner.design.theme.charAt(0).toUpperCase() + banner.design.theme.slice(1) : "Dark"} />
                            {banner.design.bgColor && <ColorRow label="Fondo Custom" color={banner.design.bgColor} />}
                            {banner.design.accentColor && <ColorRow label="Acento Custom" color={banner.design.accentColor} />}
                            {banner.design.textColor && <ColorRow label="Texto Custom" color={banner.design.textColor} />}
                            {banner.media?.objectFit && <Row label="Ajuste de Media" value={banner.media.objectFit.toUpperCase()} />}
                        </div>
                    </Card>

                    {/* Sección Contenido Principal */}
                    <Card title="Contenido de Textos">
                        <div className="space-y-3">
                            <Row label="Título Principal" value={banner.title ?? "Sin título"} />
                            {banner.subtitle && <Row label="Subtítulo" value={banner.subtitle} />}
                            {banner.description && <Row label="Descripción" value={banner.description} truncate />}
                            {banner.terms && <Row label="Términos (T&C)" value={banner.terms} truncate />}
                            {banner.destUrl && <Row label="URL Destino" value={banner.destUrl} mono truncate />}
                            <Row label="Target Pestaña" value={banner.openInNewTab ? "Nueva pestaña (_blank)" : "Mismo contenedor"} />
                        </div>
                    </Card>

                    {/* Sección Precios y Promociones (Si existen) */}
                    {(banner.price?.current !== undefined || banner.price?.compare !== undefined) && (
                        <Card title="Estructura de Precios">
                            <div className="space-y-3">
                                {banner.price?.label && <Row label="Etiqueta" value={banner.price.label} />}
                                {banner.price?.current !== undefined && <Row label="Precio Actual" value={`S/ ${banner.price.current.toFixed(2)}`} />}
                                {banner.price?.compare !== undefined && <Row label="Precio Comparativo" value={`S/ ${banner.price.compare.toFixed(2)}`} />}
                                {banner.price?.suffix && <Row label="Sufijo" value={banner.price.suffix} />}
                            </div>
                        </Card>
                    )}

                    {/* Sección Planificación y Control */}
                    <Card title="Estatus y Planificación">
                        <div className="space-y-3">
                            <Row label="Estado Maestro" value={banner.isActive ? "Activo" : "Inactivo"} />
                            <Row label="Prioridad (Order)" value={`#${banner.order}`} />
                            {banner.schedule?.startsAt && <Row label="Publicado desde" value={formatDate(banner.schedule.startsAt)} />}
                            {banner.schedule?.endsAt && <Row label="Publicado hasta" value={formatDate(banner.schedule.endsAt)} />}
                            {banner.countdown?.endsAt && (
                                <>
                                    <Row label="Fin del Countdown" value={formatDate(banner.countdown.endsAt)} />
                                    {banner.countdown.label && <Row label="Etiqueta Reloj" value={banner.countdown.label} />}
                                    <Row label="Mostrar Bloque Días" value={banner.countdown.showDays ? "Sí" : "No"} />
                                </>
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

function ColorRow({ label, color }: { label: string; color: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-border/20 pb-1.5 last:border-0 last:pb-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-sm border border-border shadow-sm" style={{ backgroundColor: color }} />
                <span className="text-xs font-mono text-foreground uppercase">{color}</span>
            </div>
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
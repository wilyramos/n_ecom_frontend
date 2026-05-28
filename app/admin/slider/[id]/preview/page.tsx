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

    return (
        <AdminPageWrapper
            title="Preview del Banner"
            breadcrumbItems={[
                { label: "Marketing", href: "/admin/marketing" },
                { label: "Slider", href: "/admin/slider" },
            ]}
            breadcrumbCurrent="Preview"
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
                {/* Preview */}
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Preview</h3>
                    <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
                        <SliderBannerSlide banner={banner} />
                    </div>
                </section>

                {/* Info Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Diseño">
                        <div className="space-y-3">
                            <Row label="Layout" value={LAYOUT_LABELS[banner.design.layout] ?? banner.design.layout} />
                            <Row label="Tema" value={banner.design.theme.charAt(0).toUpperCase() + banner.design.theme.slice(1)} />
                            {banner.design.bgColor && <ColorRow label="Fondo" color={banner.design.bgColor} />}
                            {banner.design.accentColor && <ColorRow label="Acento" color={banner.design.accentColor} />}
                            {banner.design.textColor && <ColorRow label="Texto" color={banner.design.textColor} />}
                        </div>
                    </Card>

                    <Card title="Contenido">
                        <div className="space-y-3">
                            <Row label="Nombre" value={banner.name} />
                            {banner.title && <Row label="Título" value={banner.title} />}
                            {banner.description && <Row label="Descripción" value={banner.description} truncate />}
                            {banner.destUrl && <Row label="Destino" value={banner.destUrl} mono truncate />}
                        </div>
                    </Card>
                </section>
            </div>
        </AdminPageWrapper>
    );
}

/* ──────────────── Componentes de UI Adaptados ──────────────── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</h4>
            {children}
        </div>
    );
}

function ColorRow({ label, color }: { label: string; color: string }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-border shadow-sm" style={{ backgroundColor: color }} />
                <span className="text-xs font-mono text-foreground">{color}</span>
            </div>
        </div>
    );
}

function Row({ label, value, mono = false, truncate = false }: { label: string; value: string; mono?: boolean; truncate?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs shrink-0 text-muted-foreground">{label}</span>
            <span className={cn(
                "text-xs text-right text-foreground font-medium",
                mono && "font-mono",
                truncate && "truncate max-w-[200px]"
            )} title={truncate ? value : undefined}>
                {value}
            </span>
        </div>
    );
}
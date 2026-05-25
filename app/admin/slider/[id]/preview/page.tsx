// File: frontend/app/(admin)/admin/slider/[id]/preview/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { SliderBannerSlide } from "@/components/banner/SliderBannerSlide";

import { SliderService } from "@/src/services/slider-service";

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

    const layout = banner.design.layout;
    const theme = banner.design.theme;

    return (
        <AdminPageWrapper
            title="Preview del Banner"
            breadcrumbItems={[
                { label: "Marketing", href: "/admin/marketing" },
                { label: "Slider", href: "/admin/slider" },
            ]}
            breadcrumbCurrent="Preview"
            actions={
                <>
                    <Link
                        href={`/admin/slider/${id}`}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white text-zinc-900 hover:bg-zinc-100 transition-colors"
                    >
                        Editar
                    </Link>

                    <Link
                        href="/admin/slider"
                        className="px-4 py-2 text-sm font-medium rounded-md border  hover:bg-zinc-200 transition-colors"
                    >
                        Listado
                    </Link>
                </>
            }
        >
            <div className="space-y-8">

                {/* Preview */}
                <section>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3 font-semibold">
                        Preview
                    </p>

                    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                        <SliderBannerSlide banner={banner} />
                    </div>
                </section>

                {/* Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Diseño */}
                    <Card title="Diseño">
                        <div className="space-y-2">
                            <Row
                                label="Layout"
                                value={LAYOUT_LABELS[layout] ?? layout}
                            />

                            <Row
                                label="Tema"
                                value={
                                    theme.charAt(0).toUpperCase() +
                                    theme.slice(1)
                                }
                            />

                            {banner.design.bgColor && (
                                <ColorRow
                                    label="Color Fondo"
                                    color={banner.design.bgColor}
                                />
                            )}

                            {banner.design.accentColor && (
                                <ColorRow
                                    label="Acento"
                                    color={banner.design.accentColor}
                                />
                            )}

                            {banner.design.textColor && (
                                <ColorRow
                                    label="Color Texto"
                                    color={banner.design.textColor}
                                />
                            )}
                        </div>
                    </Card>

                    {/* Contenido */}
                    <Card title="Contenido">
                        <div className="space-y-2">
                            <Row
                                label="Nombre Interno"
                                value={banner.name}
                            />

                            {banner.tags && banner.tags.length > 0 && (
                                <Row
                                    label="Etiquetas"
                                    value={banner.tags.join(", ")}
                                />
                            )}

                            {banner.title && (
                                <Row
                                    label="Título"
                                    value={banner.title}
                                />
                            )}

                            {banner.subtitle && (
                                <Row
                                    label="Subtítulo"
                                    value={banner.subtitle}
                                />
                            )}

                            {banner.description && (
                                <Row
                                    label="Descripción"
                                    value={banner.description}
                                    truncate
                                />
                            )}

                            {banner.terms && (
                                <Row
                                    label="Términos"
                                    value={banner.terms}
                                    truncate
                                />
                            )}

                            {banner.destUrl && (
                                <Row
                                    label="Destino"
                                    value={banner.destUrl}
                                    mono
                                    truncate
                                />
                            )}
                        </div>
                    </Card>

                    {/* Precio */}
                    {banner.price?.current !== undefined && banner.price.current !== null && (
                        <Card title="Precio">
                            <div className="space-y-2">
                                <Row
                                    label="Actual"
                                    value={`${banner.price.currency ?? "S/"} ${banner.price.current.toFixed(2)}`}
                                />

                                {banner.price.compare !== undefined && banner.price.compare !== null && (
                                    <Row
                                        label="Antes"
                                        value={`${banner.price.currency ?? "S/"} ${banner.price.compare.toFixed(2)}`}
                                    />
                                )}

                                {banner.price.label && (
                                    <Row
                                        label="Etiqueta"
                                        value={banner.price.label}
                                    />
                                )}

                                {banner.price.suffix && (
                                    <Row
                                        label="Sufijo"
                                        value={banner.price.suffix}
                                    />
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Programación */}
                    {(banner.schedule?.startsAt ||
                        banner.schedule?.endsAt ||
                        banner.countdown?.endsAt) ? (
                        <Card title="Programación">
                            <div className="space-y-2">

                                {banner.schedule?.startsAt && (
                                    <Row
                                        label="Inicia"
                                        value={new Date(
                                            banner.schedule.startsAt
                                        ).toLocaleString("es-PE")}
                                    />
                                )}

                                {banner.schedule?.endsAt && (
                                    <Row
                                        label="Termina"
                                        value={new Date(
                                            banner.schedule.endsAt
                                        ).toLocaleString("es-PE")}
                                    />
                                )}

                                {banner.countdown?.endsAt && (
                                    <Row
                                        label="Countdown"
                                        value={new Date(
                                            banner.countdown.endsAt
                                        ).toLocaleString("es-PE")}
                                    />
                                )}
                            </div>
                        </Card>
                    ) : null}
                </section>
            </div>
        </AdminPageWrapper>
    );
}

/* ───────────────────────────────────────────── */

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-zinc-600 p-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] ">
                {title}
            </p>

            {children}
        </div>
    );
}

function ColorRow({
    label,
    color,
}: {
    label: string;
    color: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-zinc-500">{label}</span>

            <div className="flex items-center gap-2">
                <div
                    className="w-4 h-4 rounded-sm border border-zinc-700"
                    style={{ backgroundColor: color }}
                />

                <span className="text-xs text-zinc-300 font-mono">
                    {color}
                </span>
            </div>
        </div>
    );
}

function Row({
    label,
    value,
    mono = false,
    truncate = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
    truncate?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs shrink-0 text-zinc-500">
                {label}
            </span>

            <span
                className={[
                    "text-xs  text-right text-zinc-300",
                    mono ? "font-mono" : "",
                    truncate ? "truncate max-w-[220px]" : "",
                ].join(" ")}
                title={truncate ? value : undefined}
            >
                {value}
            </span>
        </div>
    );
}
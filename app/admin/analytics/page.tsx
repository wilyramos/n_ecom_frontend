// File: frontend/app/admin/analytics/page.tsx
// Analíticas de la tienda (Vercel Web Analytics). Solo lectura, datos del servidor.

import Link from "next/link";
import { AlertTriangle, Eye, Users, TrendingUp, Settings2 } from "lucide-react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    getAnalyticsConfig,
    getDaily,
    getOverview,
    getTop,
    type AnalyticsRange,
    type DailyPoint,
    type TopRow,
} from "@/src/services/vercel-analytics";

interface Props {
    searchParams: Promise<{ range?: string }>;
}

const RANGES: AnalyticsRange[] = [7, 30];

export default async function AdminAnalyticsPage({ searchParams }: Props) {
    const params = await searchParams;
    const range: AnalyticsRange = params.range === "7" ? 7 : 30;

    return (
        <AdminPageWrapper
            title="Analíticas"
            actions={
                <div className="flex items-center gap-1 rounded-lg border border-zinc-200 p-0.5">
                    {RANGES.map((r) => (
                        <Link
                            key={r}
                            href={`/admin/analytics?range=${r}`}
                            className={cn(
                                "rounded-md px-2.5 py-1 text-xs font-medium",
                                range === r ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
                            )}
                        >
                            Últimos {r} días
                        </Link>
                    ))}
                </div>
            }
        >
            <AnalyticsContent range={range} />
        </AdminPageWrapper>
    );
}

async function AnalyticsContent({ range }: { range: AnalyticsRange }) {
    const config = getAnalyticsConfig();

    if (!config.ok) {
        return <SetupCard missing={config.missing} />;
    }

    try {
        const [overview, daily, pages, referrers, countries, devices] = await Promise.all([
            getOverview(config, range),
            getDaily(config, range),
            getTop(config, range, "requestPath"),
            getTop(config, range, "referrerHostname"),
            getTop(config, range, "country"),
            getTop(config, range, "deviceType"),
        ]);

        const avgDaily = daily.length ? Math.round(overview.pageviews / daily.length) : 0;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Kpi icon={Eye} label="Vistas de página" value={overview.pageviews} />
                    <Kpi icon={Users} label="Visitantes únicos" value={overview.visitors} />
                    <Kpi icon={TrendingUp} label="Promedio diario (vistas)" value={avgDaily} />
                </div>

                <Panel title="Tendencia diaria">
                    <DailyBars points={daily} />
                </Panel>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Panel title="Páginas más vistas">
                        <RankTable rows={pages} labelHeader="Página" />
                    </Panel>
                    <Panel title="Fuentes de tráfico">
                        <RankTable rows={referrers} labelHeader="Referencia" />
                    </Panel>
                    <Panel title="Países">
                        <RankTable rows={countries} labelHeader="País" />
                    </Panel>
                    <Panel title="Dispositivos">
                        <RankTable rows={devices} labelHeader="Dispositivo" />
                    </Panel>
                </div>

                <p className="text-[11px] text-zinc-500">
                    Datos de producción de Vercel Web Analytics. Se actualizan cada 5 minutos.
                </p>
            </div>
        );
    } catch (error) {
        return (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="space-y-1">
                    <p className="font-semibold">No se pudieron cargar las analíticas.</p>
                    <p className="text-xs">{error instanceof Error ? error.message : "Error desconocido"}</p>
                    <p className="text-xs">
                        Revisa que Web Analytics esté activado en el proyecto de Vercel y que el token tenga acceso.
                    </p>
                </div>
            </div>
        );
    }
}

function SetupCard({ missing }: { missing: string[] }) {
    return (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
                <Settings2 className="h-4 w-4" /> Configuración pendiente
            </div>
            <p className="text-xs">
                Faltan estas variables de entorno: <code className="font-mono">{missing.join(", ")}</code>.
            </p>
            <p className="text-xs">
                Añádelas en Vercel (Settings → Environment Variables) y vuelve a desplegar. El
                <code className="mx-1 font-mono">VERCEL_PROJECT_ID</code> está en Settings → General del proyecto.
            </p>
            <Link href="https://vercel.com/dashboard" target="_blank" className={buttonVariants({ variant: "outline", size: "sm" })}>
                Abrir Vercel
            </Link>
        </div>
    );
}

function Kpi({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <Icon className="h-3.5 w-3.5" /> {label}
            </div>
            <p className="mt-2 text-2xl font-bold text-zinc-900">{value.toLocaleString("es-PE")}</p>
        </div>
    );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-700">{title}</h3>
            {children}
        </section>
    );
}

function DailyBars({ points }: { points: DailyPoint[] }) {
    if (points.length === 0) {
        return <p className="py-8 text-center text-sm text-zinc-500">Sin visitas en este periodo.</p>;
    }
    const max = Math.max(...points.map((p) => p.pageviews), 1);
    return (
        <div className="flex h-44 items-end gap-1" role="img" aria-label="Vistas por día">
            {points.map((p) => {
                // Los días sin visitas se quedan en 0; el resto tiene un mínimo para que se vea.
                const height = p.pageviews > 0 ? Math.max((p.pageviews / max) * 100, 2) : 0;
                // Vercel devuelve cada día como medianoche UTC: formatear en UTC evita desfases de un día.
                const label = new Date(p.date).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", timeZone: "UTC" });
                return (
                    // h-full: sin altura definida en la columna, el height % de la barra se resuelve a 0.
                    <div key={p.date} className="group flex h-full min-w-0 flex-1 flex-col items-center gap-1">
                        <div className="relative w-full flex-1">
                            <div
                                className="absolute inset-x-0 bottom-0 rounded-t bg-indigo-500/80 transition group-hover:bg-indigo-600"
                                style={{ height: `${height}%` }}
                                title={`${label}: ${p.pageviews} vistas, ${p.visitors} visitantes`}
                            />
                            <div className="absolute inset-x-0 bottom-0 h-px bg-zinc-200" />
                        </div>
                        <span className="text-[9px] text-zinc-400">{label}</span>
                    </div>
                );
            })}
        </div>
    );
}

function RankTable({ rows, labelHeader }: { rows: TopRow[]; labelHeader: string }) {
    if (rows.length === 0) {
        return <p className="py-6 text-center text-xs text-zinc-500">Sin datos.</p>;
    }
    return (
        <table className="w-full text-xs">
            <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-1.5 font-medium">{labelHeader}</th>
                    <th className="py-1.5 text-right font-medium">Vistas</th>
                    <th className="py-1.5 text-right font-medium">Visitantes</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.key} className="border-b border-zinc-100 last:border-0">
                        <td className="max-w-[240px] truncate py-1.5 text-zinc-800" title={row.key}>{row.key}</td>
                        <td className="py-1.5 text-right tabular-nums">{row.pageviews.toLocaleString("es-PE")}</td>
                        <td className="py-1.5 text-right tabular-nums">{row.visitors.toLocaleString("es-PE")}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

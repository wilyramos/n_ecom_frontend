import { DollarSign, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type SliderBanner } from "@/src/schemas/slider.schema";

interface SectionProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
    fieldErrors?: Record<string, string[]>;
}

export default function PromoSection({ initialData, fields, fieldErrors }: SectionProps) {
    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const toDatetimeLocal = (date?: Date | string | null) => {
        if (!date) return "";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ── Precio ───────────────────────────────────────────────── */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-green-600" />
                    <CardTitle>Precio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Moneda</Label>
                            <Input
                                name="price.currency"
                                disabled
                                defaultValue={val("price.currency", initialData?.price?.currency ?? "S/")}
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Precio actual</Label>
                            <Input
                                name="price.current"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={val("price.current", initialData?.price?.current?.toString())}
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Precio comparativo</Label>
                            <Input
                                name="price.compare"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={val("price.compare", initialData?.price?.compare?.toString())}
                                className={`h-10 text-xs bg-background-secondary border rounded-sm ${err("price.compare") ? "border-destructive" : "border-border/40"}`}
                            />
                            {err("price.compare") && <p className="text-[10px] text-destructive">{err("price.compare")}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Etiqueta</Label>
                            <Input
                                name="price.label"
                                defaultValue={val("price.label", initialData?.price?.label)}
                                placeholder="Desde, Solo hoy..."
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Sufijo</Label>
                            <Input
                                name="price.suffix"
                                defaultValue={val("price.suffix", initialData?.price?.suffix)}
                                placeholder="/ mes, c/u..."
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Countdown ────────────────────────────────────────────── */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <CardTitle>Countdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label className="text-xs">Etiqueta del contador</Label>
                        <Input
                            name="countdown.label"
                            defaultValue={val("countdown.label", initialData?.countdown?.label)}
                            placeholder="La oferta termina en:"
                            className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Fecha de finalización</Label>
                        <Input
                            name="countdown.endsAt"
                            type="datetime-local"
                            defaultValue={toDatetimeLocal(initialData?.countdown?.endsAt)}
                            className={`h-10 text-xs bg-background-secondary border rounded-sm ${err("countdown.endsAt") ? "border-destructive" : "border-border/40"}`}
                        />
                        {err("countdown.endsAt") && <p className="text-[10px] text-destructive">{err("countdown.endsAt")}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="countdown.showDays"
                            value="true"
                            defaultChecked={initialData?.countdown?.showDays ?? true}
                            className="w-4 h-4 accent-blue-600"
                        />
                        <Label className="text-xs">Mostrar días</Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
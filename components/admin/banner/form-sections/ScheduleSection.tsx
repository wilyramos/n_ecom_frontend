import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { type SliderBanner } from "@/src/schemas/slider.schema";

interface SectionProps {
    initialData?: SliderBanner;
    fieldErrors?: Record<string, string[]>;
}

export default function ScheduleSection({ initialData, fieldErrors }: SectionProps) {
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const toDatetimeLocal = (date?: Date | string | null) => {
        if (!date) return "";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground/80" />
                <CardTitle>Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="space-y-1">
                    <Label className="text-xs font-bold">Orden de aparición</Label>
                    <Input
                        name="order"
                        type="number"
                        min="0"
                        defaultValue={initialData?.order ?? 0}
                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                    />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs font-bold">Publicar desde</Label>
                    <Input
                        name="schedule.startsAt"
                        type="datetime-local"
                        defaultValue={toDatetimeLocal(initialData?.schedule?.startsAt)}
                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                    />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs font-bold">Publicar hasta</Label>
                    <Input
                        name="schedule.endsAt"
                        type="datetime-local"
                        defaultValue={toDatetimeLocal(initialData?.schedule?.endsAt)}
                        className={`h-10 text-xs bg-background-secondary border rounded-sm ${err("schedule.endsAt") ? "border-destructive" : "border-border/40"}`}
                    />
                    {err("schedule.endsAt") && (
                        <p className="text-[10px] text-destructive">{err("schedule.endsAt")}</p>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <Label className="text-xs font-bold">Activo</Label>
                    <input
                        type="checkbox"
                        name="isActive"
                        value="true"
                        defaultChecked={initialData?.isActive ?? true}
                        className="w-4 h-4 accent-blue-600"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
"use client";

import { useState, useEffect } from "react";
import { Palette, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SliderLayoutEnum, SliderThemeEnum, type SliderBanner } from "@/src/schemas/slider.schema";
import { z } from "zod";

type SliderTheme = z.infer<typeof SliderThemeEnum>;
type SliderLayout = z.infer<typeof SliderLayoutEnum>;

interface ColorPalette {
    bgColor: string;
    accentColor: string;
    textColor: string;
}

interface SectionProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
}

const LAYOUT_LABELS: Record<SliderLayout, string> = {
    "image-only": "Solo imagen",
    "default": "Default (Media Derecha)",
    "media-left": "Media Izquierda",
    "background-media": "Fondo con Media",
};

// Mapeo a valores hexadecimales reales para que el <input type="color"> los pueda renderizar
const THEME_PRESETS: Record<Exclude<SliderTheme, 'custom'>, ColorPalette> = {
    dark: { bgColor: "#000000", accentColor: "#a0a0a0", textColor: "#cbcbcb" },
    light: { bgColor: "#ffffff", accentColor: "#a0a0a0", textColor: "#a0a0a0" },
};

export default function AppearanceSection({ initialData, fields }: SectionProps) {
    const [theme, setTheme] = useState<SliderTheme>(
        (fields?.["design.theme"] as SliderTheme) || initialData?.design.theme || "dark"
    );
    const [layout, setLayout] = useState<SliderLayout>(
        (fields?.["design.layout"] as SliderLayout) || initialData?.design.layout || "default"
    );
    const [colors, setColors] = useState<ColorPalette>({
        bgColor: fields?.["design.bgColor"] || initialData?.design.bgColor || THEME_PRESETS.dark.bgColor,
        accentColor: fields?.["design.accentColor"] || initialData?.design.accentColor || THEME_PRESETS.dark.accentColor,
        textColor: fields?.["design.textColor"] || initialData?.design.textColor || THEME_PRESETS.dark.textColor,
    });

    const isCustom = theme === "custom";

    useEffect(() => {
        if (!isCustom) {
            setColors(THEME_PRESETS[theme]);
        }
    }, [theme, isCustom]);

    const handleColorChange = (key: keyof ColorPalette, value: string) => {
        if (!isCustom) return;
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const resetAll = () => {
        setTheme("dark");
        setLayout("default");
        setColors(THEME_PRESETS.dark);
    };

    const COLOR_LABELS: Record<keyof ColorPalette, string> = {
        bgColor: "Fondo",
        accentColor: "Acento",
        textColor: "Texto",
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <CardTitle className="text-sm">Apariencia</CardTitle>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={resetAll}>
                    <RotateCcw className="w-3.5 h-3.5" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Layout */}
                <div className="space-y-1">
                    <Label className="text-[11px] font-bold">Layout</Label>
                    <Select name="design.layout" value={layout} onValueChange={(v: SliderLayout) => setLayout(v)}>
                        <SelectTrigger className="h-9 text-xs bg-background-secondary border-border/40 rounded-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border rounded-sm">
                            {SliderLayoutEnum.options.map((opt) => (
                                <SelectItem key={opt} value={opt} className="text-xs">{LAYOUT_LABELS[opt]}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Tema */}
                <div className="space-y-1">
                    <Label className="text-[11px] font-bold">Tema</Label>
                    <Select name="design.theme" value={theme} onValueChange={(v: SliderTheme) => setTheme(v)}>
                        <SelectTrigger className="h-9 text-xs bg-background-secondary border-border/40 rounded-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border rounded-sm">
                            {SliderThemeEnum.options.map((opt) => (
                                <SelectItem key={opt} value={opt} className="text-xs capitalize">{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Colores */}
                {/* Colores */}
                <div className="space-y-3 pt-2">
                    {(Object.keys(colors) as Array<keyof ColorPalette>).map((key) => (
                        <div key={key} className="space-y-1">
                            <Label className="text-[9px] uppercase text-muted-foreground font-semibold">{COLOR_LABELS[key]}</Label>

                            {/* ESTO ES LO NUEVO: Campo oculto que asegura que el valor se envíe al formulario */}
                            <input type="hidden" name={`design.${key}`} value={colors[key]} />

                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={colors[key]}
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    disabled={!isCustom}
                                    className="h-8 text-[11px] font-mono uppercase bg-background-secondary border-border/40 rounded-sm"
                                    maxLength={7}
                                />
                                <div className="relative w-10 h-8 shrink-0 rounded border overflow-hidden">
                                    <input
                                        type="color"
                                        value={colors[key]}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        disabled={!isCustom}
                                        className="absolute inset-0 w-full h-full cursor-pointer scale-150 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
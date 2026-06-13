// File: frontend/components/admin/attendance/AttendanceFilters.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { es as localeEs } from "react-day-picker/locale";
import { Calendar as CalendarIcon, X, Loader2, AlertCircle } from "lucide-react";
// Usamos useDebouncedCallback que está diseñado explícitamente para funciones seguras
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { AttendanceQuery } from "@/src/schemas/attendance.schema";

interface AttendanceFiltersProps {
    current: AttendanceQuery & { search?: string };
}

export default function AttendanceFilters({ current }: AttendanceFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // ── ESTADOS LOCALES DE UI ─────────────────────────────────────────────────
    const [startDate, setStartDate] = useState<Date | undefined>(
        current.startDate ? parseISO(current.startDate) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        current.endDate ? parseISO(current.endDate) : undefined
    );
    const [search, setSearch] = useState(current.search ?? "");

    // ── 1. SINCRONIZACIÓN SEGURA (ROMPE EL BUCLE) ─────────────────────────────
    useEffect(() => {
        // Solo mutamos el estado si el valor string es GENUINAMENTE distinto.
        if (current.search !== search) {
            setSearch(current.search ?? "");
        }

        const currentStartStr = startDate ? format(startDate, "yyyy-MM-dd") : undefined;
        if (current.startDate !== currentStartStr) {
            setStartDate(current.startDate ? parseISO(current.startDate) : undefined);
        }

        const currentEndStr = endDate ? format(endDate, "yyyy-MM-dd") : undefined;
        if (current.endDate !== currentEndStr) {
            setEndDate(current.endDate ? parseISO(current.endDate) : undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current.startDate, current.endDate, current.search]);

    const isInvalidRange = startDate && endDate && startDate > endDate;

    // ── 2. ACTUALIZADOR NÚCLEO DE LA URL ──────────────────────────────────────
    const pushUpdate = (newStart: Date | undefined, newEnd: Date | undefined, textSearch: string) => {
        if (newStart && newEnd && newStart > newEnd) return;

        const params = new URLSearchParams(searchParams.toString());

        if (newStart) params.set("startDate", format(newStart, "yyyy-MM-dd"));
        else params.delete("startDate");

        if (newEnd) params.set("endDate", format(newEnd, "yyyy-MM-dd"));
        else params.delete("endDate");

        if (textSearch.trim()) params.set("search", textSearch.trim());
        else params.delete("search");

        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    // ── 3. MANEJADORES DE EVENTOS DEL USUARIO ─────────────────────────────────

    // Función memorizada nativa, inmune a los re-renderizados
    const debouncedPushUpdate = useDebouncedCallback((text: string) => {
        pushUpdate(startDate, endDate, text);
    }, 500);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val); // UI refleja el texto instantáneamente
        debouncedPushUpdate(val); // API se llama después de 500ms
    };

    const handleSelectStartDate = (date: Date | undefined) => {
        setStartDate(date);
        pushUpdate(date, endDate, search);
    };

    const handleSelectEndDate = (date: Date | undefined) => {
        setEndDate(date);
        pushUpdate(startDate, date, search);
    };

    const handleClear = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setSearch("");

        startTransition(() => {
            router.push(pathname, { scroll: false });
        });
    };

    const hasActiveFilters = current.startDate || current.endDate || current.search || isInvalidRange;

    // ── RENDER ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-2">
            <div className="p-4 gap-4 grid grid-cols-1 md:grid-cols-4 items-end relative">

                {/* Selector de Fecha de Inicio */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Fecha Inicio
                    </label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50",
                                    !startDate && "text-muted-foreground",
                                    isInvalidRange && "border-rose-300 bg-rose-50/20 text-rose-900"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                                {startDate ? format(startDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={handleSelectStartDate}
                                locale={localeEs}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Selector de Fecha de Fin */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Fecha Fin
                    </label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50",
                                    !endDate && "text-muted-foreground",
                                    isInvalidRange && "border-rose-300 bg-rose-50/20 text-rose-900"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                                {endDate ? format(endDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={handleSelectEndDate}
                                locale={localeEs}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Input de Búsqueda Global */}
                <div className="flex flex-col gap-1.5 relative">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        Buscar Colaborador
                    </label>
                    <div className="relative w-full">
                        <Input
                            type="text"
                            placeholder="Nombre, correo o documento..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full border-zinc-200 bg-zinc-50/50 focus-visible:ring-zinc-900 focus-visible:bg-white transition pr-8 text-sm"
                        />
                        {isPending && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Botón de Limpieza de Filtros */}
                <div className="w-full">
                    {hasActiveFilters ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClear}
                            disabled={isPending}
                            className="w-full  text-xs"
                        >
                            <X className="h-4 w-4" />
                            Limpiar Filtros
                        </Button>
                    ) : (
                        <div className="text-center text-[11px] text-zinc-400 font-medium pb-2.5 select-none italic" />
                    )}
                </div>
            </div>

            {isInvalidRange && (
                <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>La fecha de inicio no puede ser posterior a la fecha de fin.</span>
                </div>
            )}
        </div>
    );
}
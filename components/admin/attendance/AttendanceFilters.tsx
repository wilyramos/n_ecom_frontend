// File: frontend/components/admin/attendance/AttendanceFilters.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import {
    format,
    parseISO,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    addDays,
    addMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, X, Loader2, AlertCircle, Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

import { DateRangePicker, Range, RangeKeyDict, createStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Button } from "@/components/ui/button";
import { AdminInput } from "@/src/components/admin/layout/admin-form-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { AttendanceQuery } from "@/src/schemas/attendance.schema";

interface AttendanceFiltersProps {
    current: AttendanceQuery & { search?: string };
}

const customStaticRanges = createStaticRanges([
    {
        label: "Hoy",
        range: () => ({
            startDate: new Date(),
            endDate: new Date(),
        }),
    },
    {
        label: "Ayer",
        range: () => ({
            startDate: addDays(new Date(), -1),
            endDate: addDays(new Date(), -1),
        }),
    },
    {
        label: "Esta semana",
        range: () => ({
            startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
            endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
        }),
    },
    {
        label: "Última semana",
        range: () => ({
            startDate: startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
            endDate: endOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
        }),
    },
    {
        label: "Últimos 7 días",
        range: () => ({
            startDate: addDays(new Date(), -6),
            endDate: new Date(),
        }),
    },
    {
        label: "Este mes",
        range: () => ({
            startDate: startOfMonth(new Date()),
            endDate: endOfMonth(new Date()),
        }),
    },
    {
        label: "Último mes",
        range: () => ({
            startDate: startOfMonth(addMonths(new Date(), -1)),
            endDate: endOfMonth(addMonths(new Date(), -1)),
        }),
    },
    {
        label: "Últimos 30 días",
        range: () => ({
            startDate: addDays(new Date(), -29),
            endDate: new Date(),
        }),
    },
    {
        label: "Este año",
        range: () => ({
            startDate: startOfYear(new Date()),
            endDate: endOfYear(new Date()),
        }),
    },
]);

export default function AttendanceFilters({ current }: AttendanceFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [startDate, setStartDate] = useState<Date | undefined>(
        current.startDate ? parseISO(current.startDate) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        current.endDate ? parseISO(current.endDate) : undefined
    );
    const [search, setSearch] = useState(current.search ?? "");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkWidth = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    useEffect(() => {
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

    const rangeState: Range = {
        startDate: startDate || new Date(),
        endDate: endDate || new Date(),
        key: "selection",
    };

    const isInvalidRange = startDate && endDate && startDate > endDate;

    const pushUpdate = (
        newStart: Date | undefined,
        newEnd: Date | undefined,
        textSearch: string
    ) => {
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

    const debouncedPushUpdate = useDebouncedCallback((text: string) => {
        pushUpdate(startDate, endDate, text);
    }, 400);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        debouncedPushUpdate(val);
    };

    const handleSelectRange = (rangesByKey: RangeKeyDict) => {
        const selection = rangesByKey.selection;
        if (!selection) return;

        setStartDate(selection.startDate);
        setEndDate(selection.endDate);
        pushUpdate(selection.startDate, selection.endDate, search);
    };

    const handleClear = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setSearch("");
        setIsPopoverOpen(false);
        startTransition(() => {
            router.push(pathname, { scroll: false });
        });
    };

    const hasActiveFilters = Boolean(
        current.startDate || current.endDate || current.search || isInvalidRange
    );

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs">
            <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-800">
                    Filtros de Asistencia
                </span>
                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        disabled={isPending}
                        className="h-6 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer px-2"
                    >
                        <X className="mr-1 h-3 w-3" /> Limpiar filtros
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                {/* Selector de Rango de Fechas */}
                <div className="col-span-1 md:col-span-5 lg:col-span-4">
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal text-xs h-8 truncate bg-white border-slate-200 text-slate-800 hover:bg-slate-50",
                                    !startDate && "text-slate-400",
                                    isInvalidRange && "border-rose-300 bg-rose-50 text-rose-700"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
                                {startDate ? (
                                    endDate ? (
                                        <span className="truncate">
                                            {format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}
                                        </span>
                                    ) : (
                                        <span>Desde: {format(startDate, "dd/MM/yyyy")}</span>
                                    )
                                ) : (
                                    <span>Seleccionar rango de fechas</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto p-0 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 max-w-[95vw] max-h-[85vh] overflow-y-auto"
                            align="start"
                        >
                            <DateRangePicker
                                ranges={[rangeState]}
                                onChange={handleSelectRange}
                                months={isMobile ? 1 : 2}
                                direction={isMobile ? "vertical" : "horizontal"}
                                locale={es}
                                moveRangeOnFirstSelection={false}
                                staticRanges={customStaticRanges}
                                inputRanges={[]}
                                rangeColors={["#0f172a"]}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Input de Búsqueda de Colaborador */}
                <div className="col-span-1 md:col-span-7 lg:col-span-8 relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                    <AdminInput
                        type="text"
                        placeholder="Buscar por colaborador, correo o documento..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-8 h-8 text-xs placeholder:text-slate-400"
                    />
                    {isPending && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <Loader2 className="h-3 w-3 animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            {isInvalidRange && (
                <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>La fecha inicial no puede superar a la fecha final.</span>
                </div>
            )}
        </div>
    );
}
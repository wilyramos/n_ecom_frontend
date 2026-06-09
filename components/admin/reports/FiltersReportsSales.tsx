"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DateRangeDropdown() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");

    const [range, setRange] = useState<Range[]>([
        {
            startDate: start ? new Date(start) : new Date(),
            endDate: end ? new Date(end) : new Date(),
            key: "selection",
        },
    ]);

    const [isMobile, setIsMobile] = useState(false);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRangeChange = (ranges: RangeKeyDict) => {
        const selection = ranges.selection as Range;

        const { startDate, endDate } = selection;

        if (!startDate || !endDate) return;

        setRange([selection]);

        const params = new URLSearchParams(searchParams.toString());
        params.set("startDate", format(startDate, "yyyy-MM-dd"));
        params.set("endDate", format(endDate, "yyyy-MM-dd"));
        router.push(`${pathname}?${params.toString()}`);
    };

    const startDate = range[0].startDate ? format(range[0].startDate, "dd MMM yyyy", { locale: es }) : "";
    const endDate = range[0].endDate ? format(range[0].endDate, "dd MMM yyyy", { locale: es }) : "";

    return (
        <div className="relative z-50" ref={dropdownRef}>
            {/* Botón activador */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(!open)}
                className="h-8 text-xs font-bold gap-2 bg-card w-full sm:w-auto"
            >
                <CalendarIcon className="w-3.5 h-3.5" />
                {startDate} - {endDate}
            </Button>

            {/* Contenedor del Dropdown */}
            {open && (
                <div
                    className={cn(
                        "absolute right-0 mt-2 bg-card border border-border shadow-2xl rounded-xl z-[999]",
                        "w-[320px] sm:w-[640px]", // Ancho fijo para 1 mes (móvil) y 2 meses (desktop)
                        "max-h-[80vh] overflow-y-auto sm:overflow-hidden" // Scroll solo en móvil
                    )}
                >
                    <DateRange
                        ranges={range}
                        onChange={handleRangeChange}
                        moveRangeOnFirstSelection={false}
                        // Forzamos el número de meses y dirección basados en isMobile
                        months={isMobile ? 1 : 2}
                        direction={isMobile ? "vertical" : "horizontal"}
                        locale={es}
                        // ESTILOS CRÍTICOS: Eliminamos restricciones de ancho y altura de las clases de la librería
                        className="!w-full !max-w-none" 
                    />
                </div>
            )}
        </div>
    );
}
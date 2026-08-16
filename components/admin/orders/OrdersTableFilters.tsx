// File: frontend/components/admin/orders/OrdersTableFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
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
import { DateRangePicker, Range, RangeKeyDict, createStaticRanges } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { CalendarIcon, X, Search, DollarSign, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface OrdersTableFiltersProps {
  initialFecha?: string;
  initialFechaFin?: string;
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

export default function OrdersTableFilters({
  initialFecha = "",
  initialFechaFin = "",
}: OrdersTableFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [filters, setFilters] = useState({
    pedido: searchParams.get("pedido") || "",
    fecha: searchParams.has("fecha") ? searchParams.get("fecha") || "" : initialFecha,
    fechaFin: searchParams.has("fechaFin") ? searchParams.get("fechaFin") || "" : initialFechaFin,
    estadoPago: searchParams.get("estadoPago") || "",
    estadoEnvio: searchParams.get("estadoEnvio") || "",
    montoMin: searchParams.get("montoMin") || "",
    montoMax: searchParams.get("montoMax") || "",
  });

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const rangeState: Range = {
    startDate: filters.fecha ? parseISO(filters.fecha) : new Date(),
    endDate: filters.fechaFin ? parseISO(filters.fechaFin) : new Date(),
    key: "selection",
  };

  const updateURL = useDebouncedCallback((newFilters: typeof filters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value.toString().trim() !== "") {
        params.set(key, value);
      }
    });
    router.push(`/admin/orders?${params.toString()}`);
  }, 350);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleSelectChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value === "todos" ? "" : value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleSelectRange = (rangesByKey: RangeKeyDict) => {
    const selection = rangesByKey.selection;
    if (!selection) return;

    const fecha = selection.startDate ? format(selection.startDate, "yyyy-MM-dd") : "";
    const fechaFin = selection.endDate ? format(selection.endDate, "yyyy-MM-dd") : "";

    const newFilters = { ...filters, fecha, fechaFin };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleClear = () => {
    const cleared = {
      pedido: "",
      fecha: "",
      fechaFin: "",
      estadoPago: "",
      estadoEnvio: "",
      montoMin: "",
      montoMax: "",
    };
    setFilters(cleared);
    setIsPopoverOpen(false);
    router.push("/admin/orders?fecha=&fechaFin=");
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-admin-card border border-admin-border rounded-xl p-4 space-y-3 shadow-xs">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-admin-fg-heading">Filtrar Pedidos</span>
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 text-xs text-admin-danger hover:text-admin-danger-foreground hover:bg-admin-danger-muted cursor-pointer"
          >
            <X className="mr-1.5 h-3.5 w-3.5" /> Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Búsqueda por ID o Código */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-fg-subtle" />
          <Input
            name="pedido"
            placeholder="N° Pedido o ID..."
            value={filters.pedido}
            onChange={handleInputChange}
            className="pl-8 text-xs h-9 bg-admin-card border-admin-border text-admin-fg-body placeholder:text-admin-fg-muted focus-visible:border-admin-border-focus"
          />
        </div>

        {/* Date Range Picker Responsivo con Presets */}
        <div className="w-full">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal text-xs h-9 w-full truncate bg-admin-card border-admin-border text-admin-fg-body hover:bg-admin-sidebar-hover cursor-pointer",
                  !filters.fecha && "text-admin-fg-muted"
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-admin-fg-subtle" />
                {filters.fecha ? (
                  filters.fechaFin ? (
                    <span className="truncate">
                      {format(parseISO(filters.fecha), "dd/MM/yyyy")} - {format(parseISO(filters.fechaFin), "dd/MM/yyyy")}
                    </span>
                  ) : (
                    <span>Desde: {format(parseISO(filters.fecha), "dd/MM/yyyy")}</span>
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
                rangeColors={["#2563eb"]}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Estado Pago */}
        <Select
          value={filters.estadoPago || "todos"}
          onValueChange={(v) => handleSelectChange("estadoPago", v)}
        >
          <SelectTrigger className="text-xs h-9 bg-admin-card border-admin-border text-admin-fg-body hover:bg-admin-sidebar-hover">
            <CreditCard className="mr-2 h-3.5 w-3.5 text-admin-fg-subtle" />
            <SelectValue placeholder="Estado Pago" />
          </SelectTrigger>
          <SelectContent className="bg-admin-card border-admin-border text-admin-fg-body shadow-md">
            <SelectItem value="todos" className="text-xs hover:bg-admin-sidebar-hover">Todos los pagos</SelectItem>
            <SelectItem value="pending" className="text-xs hover:bg-admin-sidebar-hover">Pendiente</SelectItem>
            <SelectItem value="approved" className="text-xs hover:bg-admin-sidebar-hover">Aprobado</SelectItem>
            <SelectItem value="rejected" className="text-xs hover:bg-admin-sidebar-hover">Rechazado</SelectItem>
          </SelectContent>
        </Select>

        {/* Estado Envío */}
        <Select
          value={filters.estadoEnvio || "todos"}
          onValueChange={(v) => handleSelectChange("estadoEnvio", v)}
        >
          <SelectTrigger className="text-xs h-9 bg-admin-card border-admin-border text-admin-fg-body hover:bg-admin-sidebar-hover">
            <Truck className="mr-2 h-3.5 w-3.5 text-admin-fg-subtle" />
            <SelectValue placeholder="Estado Envío" />
          </SelectTrigger>
          <SelectContent className="bg-admin-card border-admin-border text-admin-fg-body shadow-md">
            <SelectItem value="todos" className="text-xs hover:bg-admin-sidebar-hover">Todos los envíos</SelectItem>
            <SelectItem value="processing" className="text-xs hover:bg-admin-sidebar-hover">Procesando</SelectItem>
            <SelectItem value="shipped" className="text-xs hover:bg-admin-sidebar-hover">Enviado</SelectItem>
            <SelectItem value="delivered" className="text-xs hover:bg-admin-sidebar-hover">Entregado</SelectItem>
          </SelectContent>
        </Select>

        {/* Monto Mínimo */}
        <div className="relative">
          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-fg-subtle" />
          <Input
            type="number"
            name="montoMin"
            placeholder="Monto mín."
            value={filters.montoMin}
            onChange={handleInputChange}
            className="pl-8 text-xs h-9 bg-admin-card border-admin-border text-admin-fg-body placeholder:text-admin-fg-muted focus-visible:border-admin-border-focus"
          />
        </div>

        {/* Monto Máximo */}
        <div className="relative">
          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-fg-subtle" />
          <Input
            type="number"
            name="montoMax"
            placeholder="Monto máx."
            value={filters.montoMax}
            onChange={handleInputChange}
            className="pl-8 text-xs h-9 bg-admin-card border-admin-border text-admin-fg-body placeholder:text-admin-fg-muted focus-visible:border-admin-border-focus"
          />
        </div>
      </div>
    </div>
  );
}
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { format } from "date-fns";
import { CalendarIcon, X, Search, DollarSign, Truck, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function OrdersTableFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        pedido: searchParams.get("pedido") || "",
        fecha: searchParams.get("fecha") || "",
        fechaFin: searchParams.get("fechaFin") || "",
        estadoPago: searchParams.get("estadoPago") || "",
        estadoEnvio: searchParams.get("estadoEnvio") || "",
        montoMin: searchParams.get("montoMin") || "",
        montoMax: searchParams.get("montoMax") || "",
    });

    const updateURL = useDebouncedCallback((newFilters: typeof filters) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value.toString().trim() !== "") params.set(key, value);
        });
        router.push(`/admin/orders?${params.toString()}`);
    }, 400);

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

    const handleDateChange = (name: "fecha" | "fechaFin", date: Date | undefined) => {
        const dateString = date ? format(date, "yyyy-MM-dd") : "";
        const newFilters = { ...filters, [name]: dateString };
        setFilters(newFilters);
        updateURL(newFilters);
    };

    const handleClear = () => {
        const cleared = { pedido: "", fecha: "", fechaFin: "", estadoPago: "", estadoEnvio: "", montoMin: "", montoMax: "" };
        setFilters(cleared);
        router.push("/admin/orders");
    };

    const hasFilters = Object.values(filters).some((v) => v !== "");

    return (
        <div className="bg-card p-4 rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Filtros Avanzados</h3>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-destructive hover:text-destructive">
                        <X className="mr-2 h-4 w-4" /> Limpiar
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Búsqueda */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input name="pedido" placeholder="ID Pedido" value={filters.pedido} onChange={handleInputChange} className="pl-9" />
                </div>

                {/* Fechas */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("justify-start text-left font-normal", !filters.fecha && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.fecha ? filters.fecha : "Fecha inicio"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={filters.fecha ? new Date(filters.fecha) : undefined} onSelect={(d) => handleDateChange("fecha", d)} />
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" disabled={!filters.fecha} className={cn("justify-start text-left font-normal", !filters.fechaFin && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.fechaFin ? filters.fechaFin : "Fecha fin"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={filters.fechaFin ? new Date(filters.fechaFin) : undefined} onSelect={(d) => handleDateChange("fechaFin", d)} />
                    </PopoverContent>
                </Popover>

                {/* Estado Pago */}
                <Select value={filters.estadoPago || "todos"} onValueChange={(v) => handleSelectChange("estadoPago", v)}>
                    <SelectTrigger><CreditCard className="mr-2 h-4 w-4" /><SelectValue placeholder="Estado Pago" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos los pagos</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="approved">Aprobado</SelectItem>
                        <SelectItem value="rejected">Rechazado</SelectItem>
                    </SelectContent>
                </Select>

                {/* Estado Envío */}
                <Select value={filters.estadoEnvio || "todos"} onValueChange={(v) => handleSelectChange("estadoEnvio", v)}>
                    <SelectTrigger><Truck className="mr-2 h-4 w-4" /><SelectValue placeholder="Estado Envío" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos los envíos</SelectItem>
                        <SelectItem value="processing">Procesando</SelectItem>
                        <SelectItem value="shipped">Enviado</SelectItem>
                        <SelectItem value="delivered">Entregado</SelectItem>
                    </SelectContent>
                </Select>

                {/* Montos */}
                <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="number" name="montoMin" placeholder="Monto mín." value={filters.montoMin} onChange={handleInputChange} className="pl-9" />
                </div>
                <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="number" name="montoMax" placeholder="Monto máx." value={filters.montoMax} onChange={handleInputChange} className="pl-9" />
                </div>
            </div>
        </div>
    );
}
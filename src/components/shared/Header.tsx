"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCashStore } from "@/src/store/useCashStore";
import { Power } from "lucide-react";
import { CashClosingModal } from "@/src/components/pos/CashClosingModal";
import type { User } from "@/src/schemas";

export const Header = ({ user }: { user: User }) => {
    const pathname = usePathname();
    const { isOpen, toggleModal, currentShiftId } = useCashStore();
    const [showClosingModal, setShowClosingModal] = useState(false);

    const rawSection = pathname.split("/").filter(Boolean).pop() || "Dashboard";
    const sectionMap: Record<string, string> = {
        terminal: "Terminal de Ventas",
        inventory: "Gestión de Almacén",
        sales: "Historial de Operaciones",
        receipts: "Comprobantes",
        "daily-summary": "Resumen del Día",
        "cash-history": "Historial de Cajas",
        reports: "Reportes",
        settings: "Configuración",
        "cash-shift": "Caja Actual",
    };

    const currentTitle = sectionMap[rawSection] || rawSection;

    return (
        <>
            <header className="flex h-12 w-full shrink-0 items-center justify-between border-b border-border bg-card px-8 z-40 text-card-foreground">
                {/* Left: Título de Sección */}
                <h2 className="text-base font-black uppercase tracking-tight text-foreground">
                    {currentTitle}
                </h2>

                {/* Right: Gestión de Cajas */}
                <div className="flex items-center gap-2">
                    {!isOpen ? (
                        <button
                            onClick={() => toggleModal(true)}
                            className="flex items-center gap-2 rounded-sm border border-brand-action bg-brand-action px-4 py-2 text-brand-charcoal transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
                                Abrir Caja
                            </span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 rounded-sm border border-border bg-muted px-3 py-1.5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hidden sm:inline">
                                Caja abierta
                            </span>
                            <button
                                onClick={() => setShowClosingModal(true)}
                                className="flex h-6 w-6 items-center justify-center rounded-sm border border-destructive/20 bg-background text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                                title="Cerrar caja"
                            >
                                <Power size={12} strokeWidth={3} />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {isOpen && showClosingModal && currentShiftId && user._id && (
                <CashClosingModal
                    userId={user._id}
                    shiftId={currentShiftId}
                    onClose={() => setShowClosingModal(false)}
                />
            )}
        </>
    );
};
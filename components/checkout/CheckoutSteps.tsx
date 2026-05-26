"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
    { label: "Datos y Envío", path: "/checkout" },
    { label: "Pago",          path: "/checkout/payment" },
];

export default function CheckoutSteps() {
    const pathname = usePathname();
    const currentStepIndex = steps.findIndex((s) => s.path === pathname);

    return (
        <nav className="w-full max-w-xl mx-auto px-4 py-3">
            <div className="relative flex items-center justify-between w-full">
                
                {/* Línea conectora de fondo fija */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-surface-secondary z-0" />

                {/* Línea conectora de progreso activa */}
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-action-primary transition-all duration-500 ease-in-out z-0"
                    style={{ 
                        width: `${currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` 
                    }}
                />

                {steps.map((step, index) => {
                    const isActive = pathname === step.path;
                    const isCompleted = currentStepIndex > index;

                    const StepIndicator = (
                        <div className="flex flex-col items-center relative z-10 group">
                            {/* Círculo */}
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2",
                                    isCompleted
                                        ? "bg-surface-inverse border-surface-inverse text-fg-inverse"
                                        : isActive
                                            ? "bg-surface-primary border-action-primary text-action-primary shadow-[0_0_0_4px_var(--color-surface-secondary)]"
                                            : "bg-surface-primary border-border-default text-fg-muted"
                                )}
                            >
                                {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
                            </div>

                            {/* Etiqueta */}
                            <span
                                className={cn(
                                    "absolute top-10 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap transition-colors hidden sm:block",
                                    isActive || isCompleted
                                        ? "text-fg-primary"
                                        : "text-fg-muted"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );

                    return (
                        <div key={step.path}>
                            {isCompleted ? (
                                <Link href={step.path} className="cursor-pointer hover:opacity-80 transition-opacity block">
                                    {StepIndicator}
                                </Link>
                            ) : (
                                <div className="cursor-default block">
                                    {StepIndicator}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Espaciador exclusivo para diseño móvil ya que las etiquetas absolutas se ocultan */}
            <div className="h-2 sm:hidden" />
        </nav>
    );
}
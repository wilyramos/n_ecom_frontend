import { XCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "error" | "warning" | "success" | "info";
type Mode    = "inline" | "banner";

interface ErrorMessageProps {
    children: ReactNode;
    variant?: Variant;
    mode?: Mode;
    onDismiss?: () => void;
    className?: string;
}

const CONFIG = {
    error: {
        icon: XCircle,
        inline: "text-destructive",
        banner: "bg-destructive/10 border-destructive text-destructive",
    },
    warning: {
        icon: AlertTriangle,
        inline: "text-accent-vivid",
        banner: "bg-accent-vivid-muted border-accent-vivid text-accent-vivid",
    },
    success: {
        icon: CheckCircle,
        inline: "text-brand-gris",
        banner: "bg-surface-secondary border-brand-gris text-brand-charcoal",
    },
    info: {
        icon: Info,
        inline: "text-brand-charcoal",
        banner: "bg-surface-secondary border-border-default text-brand-charcoal",
    },
};

export default function ErrorMessage({
    children,
    variant  = "error",
    mode     = "inline",
    onDismiss,
    className,
}: ErrorMessageProps) {
    const config = CONFIG[variant];
    const Icon = config.icon;

    if (mode === "inline") {
        return (
            <div className={cn("flex items-center gap-1 text-[11px] font-medium leading-none", config.inline, className)}>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{children}</span>
            </div>
        );
    }

    return (
        <div
            role="alert"
            className={cn(
                "flex items-center justify-between gap-3 px-3 py-2 rounded-md border text-xs font-medium transition-all",
                config.banner,
                className
            )}
        >
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{children}</span>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    aria-label="Cerrar"
                    className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}
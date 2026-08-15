import React from "react";
import { cn } from "@/lib/utils";

interface AdminStatusIndicatorProps {
  status?: "online" | "offline" | "syncing" | "error";
  label?: string;
  className?: string;
}

export function AdminStatusIndicator({
  status = "online",
  label,
  className,
}: AdminStatusIndicatorProps) {
  const statusConfig = {
    online: {
      color: "bg-emerald-500",
      ping: "bg-emerald-400",
      defaultLabel: "Sistema Online",
    },
    offline: {
      color: "bg-slate-400",
      ping: null,
      defaultLabel: "Sin Conexión",
    },
    syncing: {
      color: "bg-amber-500 animate-pulse",
      ping: null,
      defaultLabel: "Sincronizando...",
    },
    error: {
      color: "bg-rose-500",
      ping: "bg-rose-400",
      defaultLabel: "Error API",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs font-medium text-slate-600",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {config.ping && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              config.ping
            )}
          />
        )}
        <span
          className={cn("relative inline-flex rounded-full h-2 w-2", config.color)}
        />
      </span>
      <span className="text-[11px] font-semibold text-slate-600">
        {label || config.defaultLabel}
      </span>
    </div>
  );
}
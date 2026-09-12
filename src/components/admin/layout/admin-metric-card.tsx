import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminMetricCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
        label?: string;
    };
    description?: string;
    className?: string;
}

export function AdminMetricCard({
    title,
    value,
    icon: Icon,
    trend,
    description,
    className,
}: AdminMetricCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 shadow-xs",
                className
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500">
                    {title}
                </span>
                {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-xl font-semibold tracking-tight text-slate-900">
                    {value}
                </span>
                {trend && (
                    <div className="flex items-center gap-1 text-[11px] font-medium shrink-0">
                        {trend.isPositive ? (
                            <span className="inline-flex items-center text-emerald-700 bg-emerald-50/80 px-1.5 py-0.5 rounded-md border border-emerald-200/50">
                                <TrendingUp className="w-3 h-3 mr-1 shrink-0" />
                                {trend.value}
                            </span>
                        ) : (
                            <span className="inline-flex items-center text-rose-700 bg-rose-50/80 px-1.5 py-0.5 rounded-md border border-rose-200/50">
                                <TrendingDown className="w-3 h-3 mr-1 shrink-0" />
                                {trend.value}
                            </span>
                        )}
                        {trend.label && (
                            <span className="text-slate-400 font-normal">{trend.label}</span>
                        )}
                    </div>
                )}
            </div>

            {description && (
                <p className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                    {description}
                </p>
            )}
        </div>
    );
}
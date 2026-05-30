//File: frontend/components/admin/AdminPageWrapper.tsx

import React from "react";
import BackButton from "@/components/ui/BackButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type BreadcrumbItem = {
    label: string;
    href: string;
};

type AdminPageWrapperProps = {
    title: string;
    children: React.ReactNode;
    breadcrumbItems?: BreadcrumbItem[];
    breadcrumbCurrent?: string;
    showBackButton?: boolean;
    actions?: React.ReactNode;
};

export default function AdminPageWrapper({
    title,
    children,
    breadcrumbItems = [],
    breadcrumbCurrent,
    showBackButton = true,
    actions,
}: AdminPageWrapperProps) {
    const hasBreadcrumb = breadcrumbItems.length > 0 || breadcrumbCurrent;

    return (
        // bg-stone-50 proporciona un fondo neutro y limpio para separar las tarjetas
        <div className="flex flex-col min-h-screen bg-stone-50">
            {/* ── HEADER ── */}
            {/* Borde inferior naranja para delimitar el área de trabajo administrativa */}
            <header className="shrink-0 border-b-2 border-[var(--color-accent-vivid)] bg-[var(--color-surface-primary)] px-6 py-6 md:px-8 shadow-sm">
                <div className="max-w-[1400px] mx-auto space-y-4">
                    
                    {/* Breadcrumb */}
                    {hasBreadcrumb && (
                        <Breadcrumbs
                            items={breadcrumbItems}
                            current={breadcrumbCurrent}
                        />
                    )}

                    {/* Title & Actions */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            {/* Marcador vertical naranja para dar vivacidad al título */}
                            <div className="w-1.5 h-8 bg-[var(--color-accent-vivid)] rounded-full shrink-0" />
                            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[var(--color-fg-primary)]">
                                {title}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {actions && (
                                <div className="flex items-center gap-2">{actions}</div>
                            )}
                            {actions && showBackButton && (
                                <div className="h-6 w-px bg-[var(--color-border-default)] mx-1 hidden md:block" />
                            )}
                            {showBackButton && <BackButton />}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── CONTENT ── */}
            <main className="flex-1 px-6 py-8 md:px-8">
                <div className="max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
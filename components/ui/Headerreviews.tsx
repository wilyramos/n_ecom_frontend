"use client";

import React from "react";
import Link from "next/link";
import type { ButtonGroupProps } from "react-multi-carousel";

interface Props extends ButtonGroupProps {
    title?: React.ReactNode;
    viewAllHref?: string;
}

function GoogleLogo() {
    return (
        <span className="text-[15px] font-bold tracking-tight select-none leading-none">
            <span style={{ color: "#4285F4" }}>G</span>
            <span style={{ color: "#EA4335" }}>o</span>
            <span style={{ color: "#FBBC04" }}>o</span>
            <span style={{ color: "#4285F4" }}>g</span>
            <span style={{ color: "#34A853" }}>l</span>
            <span style={{ color: "#EA4335" }}>e</span>
        </span>
    );
}

export default function HeaderReviews({ title, viewAllHref }: Props) {
    return (
        <div className="w-full mb-4 select-none flex items-center justify-between gap-2">

            {/* Título */}
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-fg-muted">
                {title}
            </h2>

            {/* Botón Ver en Google */}
            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-default bg-surface-primary hover:bg-surface-secondary transition-colors whitespace-nowrap shrink-0"
                >
                    <GoogleLogo />
                    {/* Separador vertical */}
                    <span className="w-px h-3.5 bg-border-default" />
                    {/* Texto desktop */}
                    <span className="hidden md:inline text-xs font-medium text-fg-secondary">
                        Ver reseñas
                    </span>
                    {/* Texto mobile */}
                    <span className="md:hidden text-xs font-medium text-fg-secondary">
                        Ver
                    </span>
                    {/* Ícono externo */}
                    <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-fg-muted shrink-0"
                    >
                        <path
                            d="M2 10L10 2M10 2H5M10 2V7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            )}
        </div>
    );
}
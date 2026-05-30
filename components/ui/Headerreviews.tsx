"use client";

import React from "react";
import Link from "next/link";
import type { ButtonGroupProps } from "react-multi-carousel";

interface Props extends ButtonGroupProps {
    title?: React.ReactNode;
    viewAllHref?: string;
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
                    {/* Texto desktop */}
                    <span className="hidden md:inline text-xs font-medium text-fg-muted hover:text-fg-secondary">
                        Ver reseñas
                    </span>
                    {/* Texto mobile */}
                    <span className="md:hidden text-xs font-medium text-fg-secondary hover:text-fg-primary">
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
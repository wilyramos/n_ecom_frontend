"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ButtonGroupProps } from "react-multi-carousel";

interface Props extends ButtonGroupProps {
    title?: React.ReactNode;
    viewAllHref?: string;
}

export default function HeaderConTituloConControles({ title, viewAllHref }: Props) {
    return (
        <div className="w-full mb-4 text-fg-primary select-none flex items-center justify-between gap-2">

            {/* Título */}
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-fg-primary">
                {title}
            </h2>

            {/* Desktop */}
            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    className="hidden md:flex items-center gap-1 text-sm font-semibold text-fg-primary hover:text-fg-secondary transition-colors whitespace-nowrap"
                >
                    Ver más
                </Link>
            )}

            {/* Mobile */}
            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    className="md:hidden flex items-center gap-0.5 text-xs font-medium text-fg-primary hover:text-fg-secondary transition-colors whitespace-nowrap shrink-0"
                >
                    Ver todo <ChevronRight size={12} strokeWidth={2.5} />
                </Link>
            )}
        </div>
    );
}
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ButtonGroupProps } from "react-multi-carousel";

interface Props extends ButtonGroupProps {
    title: React.ReactNode;
    viewAllHref?: string;
}

export default function HeaderConTituloConControles({ title, viewAllHref }: Props) {
    return (
        <div className="w-full flex flex-col gap-1 mb-6 bg-surface-primary text-fg-primary select-none">
            <div className="flex items-center justify-between w-full">
                
                {/* Título */}
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-fg-primary">
                    {title}
                </h2>

                {/* Link Desktop */}
                <div className="flex items-center gap-4">
                    {viewAllHref && (
                        <Link 
                            href={viewAllHref} 
                            className="hidden md:flex items-center gap-1 text-sm font-semibold text-fg-primary hover:text-fg-secondary transition-colors"
                        >
                            Ver más
                        </Link>
                    )}
                </div>
            </div>

            {/* Link para Mobile */}
            {viewAllHref && (
                <Link 
                    href={viewAllHref} 
                    className="md:hidden text-xs font-semibold text-fg-primary flex items-center gap-0.5 mt-1 hover:text-fg-secondary transition-colors"
                >
                    Ver todo <ChevronRight size={12} strokeWidth={2.5} />
                </Link>
            )}
        </div>
    );
}
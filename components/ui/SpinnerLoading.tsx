"use client";

import * as React from "react"

export default function SpinnerLoading() {
    return (
        <div className="flex items-center justify-center min-h-[400px] bg-surface-primary">
            <div className="h-7 w-7 animate-spin rounded-full border-[1.5px] border-border-default border-t-brand-charcoal" />
        </div>
    )
}
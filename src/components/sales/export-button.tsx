"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Dispara la descarga del CSV llamando al Route Handler interno.
 * Mantiene los filtros actuales de la URL automáticamente.
 */
export function ExportButton() {
    const searchParams = useSearchParams();
    const [isExporting, setIsExporting] = React.useState(false);

    const handleExport = () => {
        setIsExporting(true);

        const query = searchParams.toString();
        const downloadUrl = `/api/sales/export${query ? `?${query}` : ""}`;

        window.location.assign(downloadUrl);

        setTimeout(() => setIsExporting(false), 2000);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="h-11 gap-2 border-border bg-card hover:bg-muted text-foreground rounded-sm transition-colors cursor-pointer"
        >
            {isExporting ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : (
                <Download className="size-4 text-foreground" />
            )}
            <span className="hidden md:inline font-bold text-xs uppercase tracking-wider">Exportar CSV</span>
        </Button>
    );
}
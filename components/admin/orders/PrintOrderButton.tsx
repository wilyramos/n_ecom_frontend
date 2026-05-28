"use client";

import { useState } from "react";
import { FaPrint, FaDownload } from "react-icons/fa";

interface Props {
    orderId: string;
}

export default function PrintOrderButton({ orderId }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleViewPdf = () => {
        setIsLoading(true);
        window.open(`/api/orders/${orderId}/pdf?action=view`, "_blank");
        setIsLoading(false);
    };

    const handleDownloadPdf = () => {
        setIsLoading(true);
        const link = document.createElement("a");
        link.href = `/api/orders/${orderId}/pdf?action=download`;
        link.setAttribute("download", `Orden-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        setIsLoading(false);
    };

    return (
        <div className="flex gap-2">
            <button 
                onClick={handleViewPdf}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-background border border-border text-foreground rounded-md hover:bg-muted transition-colors shadow-sm disabled:opacity-50"
                title="Ver e Imprimir PDF"
            >
                <FaPrint className="text-muted-foreground" /> 
                Imprimir
            </button>

            <button 
                onClick={handleDownloadPdf}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-background border border-border text-foreground rounded-md hover:bg-muted transition-colors shadow-sm disabled:opacity-50"
                title="Descargar PDF"
            >
                <FaDownload className="text-muted-foreground" />
                Descargar
            </button>
        </div>
    );
}
"use client";

import { useState } from "react";
import { FaTags } from "react-icons/fa";

interface Props {
    orderId: string;
}

export default function PrintLabelButton({ orderId }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePrintLabel = () => {
        setIsLoading(true);
        window.open(`/api/orders/${orderId}/label?action=view`, "_blank");
        setIsLoading(false);
    };

    return (
        <button 
            onClick={handlePrintLabel}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            title="Imprimir Etiqueta de Envío"
        >
            <FaTags className="text-primary-foreground/80" /> 
            Etiqueta
        </button>
    );
}
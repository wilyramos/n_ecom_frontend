// File: frontend/components/checkout/CopyButton.tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="text-fg-muted hover:text-fg-primary transition-colors p-1 rounded hover:bg-surface-secondary"
            title="Copiar"
        >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
        </button>
    );
}
// File: frontend/components/home/PaymentMethods.tsx

import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
    size?: "sm" | "md";
    className?: string;
};

export default function PaymentMethods({ size = "md", className }: Props) {
    const methods = [
        { src: "/payments/cuotealo.webp", alt: "Cutealo" },
        { src: "/payments/bcp.png", alt: "BCP" },
        { src: "/payments/interbank.png", alt: "Interbank" },
        { src: "/payments/scotiabank.png", alt: "Scotiabank" },
        { src: "/payments/bbva.webp", alt: "BBVA" },
        { src: "/payments/diners.png", alt: "Diners Club" },
    ];

    const isSmall = size === "sm";

    return (
        <div className={cn("flex items-center", isSmall ? "gap-1.5" : "gap-2 md:gap-4", className)}>
            {methods.map(({ src, alt }) => (
                <div
                    key={alt}
                    className={cn("relative shrink-0", isSmall ? "w-7 h-4" : "w-12 h-8")}
                >
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-contain"
                        sizes={isSmall ? "28px" : "48px"}
                        unoptimized
                    />
                </div>
            ))}
        </div>
    );
}

//File: frontend/components/home/PaymentMethods.tsx

import Image from "next/image";

export default function PaymentMethods() {
    const methods = [
        { src: "/payments/cuotealo.webp", alt: "Cutealo" },
        { src: "/payments/bcp.png", alt: "BCP" },
        { src: "/payments/interbank.png", alt: "Interbank" },
        { src: "/payments/scotiabank.png", alt: "Scotiabank" },
        { src: "/payments/diners.png", alt: "Diners Club" },
    ];

    return (
        <div className="flex items-center gap-2 md:gap-4">
            {methods.map(({ src, alt }) => (
                <div key={alt} className="relative w-12 h-8 shrink-0">
                    <Image src={src} alt={alt} fill className="object-contain" sizes="28px" unoptimized />
                </div>
            ))}
        </div>
    );
}
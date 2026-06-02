import Image from "next/image";

export default function PaymentMethods() {
    const methods = [
        { src: "/payments/visa.png", alt: "Visa" },
        { src: "/payments/mastercard.png", alt: "Mastercard" },
        { src: "/payments/amex.png", alt: "American Express" },
        { src: "/payments/mp.png", alt: "Mercado Pago" },
        // { src: "/payments/yape.svg", alt: "Yape" },
    ];

    return (
        <div className="flex items-center gap-2">
            {methods.map(({ src, alt }) => (
                <div key={alt} className="relative w-7 h-4 shrink-0">
                    <Image src={src} alt={alt} fill className="object-contain" sizes="28px" />
                </div>
            ))}
        </div>
    );
}
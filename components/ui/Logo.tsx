// frontend/components/ui/Logo.tsx
import Image from "next/image";
import { CSSProperties } from "react";

type LogoProps = {
    color?: "black" | "white";
    className?: string;
    style?: CSSProperties; // ← Añade esto
};

export default function Logo({ 
    color = "black", 
    className = "h-10 w-auto",
    style // ← Destructura el style
}: LogoProps) {
    const logoSrc = color === "black" 
        ? "/logosvg.svg" 
        : "/logosvg.svg";

    return (
        <div 
            className={`
                relative flex items-center select-none shrink-0 
                ${className}
            `}
            style={{
                // Estilos base para Safari
                WebkitFontSmoothing: 'antialiased',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                WebkitTransformZ: 0,
                transform: 'translateZ(0)',
                // Merge con estilos pasados como prop
                ...style
            } as CSSProperties}
        >
            <Image
                src={logoSrc}
                alt="NEOSHOP Importaciones Logo"
                fill
                priority
                quality={100}
                className="object-contain object-left"
                unoptimized
                draggable={false}
            />
        </div>
    );
}
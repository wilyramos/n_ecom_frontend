import Image from "next/image";
import { CSSProperties } from "react";

type LogoProps = {
    color?: "black" | "white";
    className?: string;
    style?: CSSProperties;
    version?: "completa" | "icono";
};

export default function Logo({
    color = "black",
    className,
    style,
    version = "completa"
}: LogoProps) {
    const logoSrc = version === "icono"
        ? "/miniaturagris.png"
        : color === "black"
            ? "/logo-new.svg"
            : "/logo-new.svg";

    // Clases dimensionales base según la versión si no se sobreescriben explícitamente
    const defaultDimensions = version === "icono"
        ? "h-7 w-7"
        : "h-7 w-36"; // w-36 o w-40 para darle un ancho base real

    return (
        <div
            className={`
        relative flex items-center select-none shrink-0 
        ${className ?? defaultDimensions}
      `}
            style={{
                WebkitFontSmoothing: 'antialiased',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                WebkitTransformZ: 0,
                transform: 'translateZ(0)',
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
// frontend/components/ui/Logo.tsx
import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
    size?: number; // El size define la altura (height) en píxeles y escala proporcionalmente
};

export default function Logo({ color = "black", size = 28 }: LogoProps) {
    const logoSrc = color === "black" ? "/logo_fondo_blanco.svg" : "/logo_fondo_blanco.svg";

    const logoHeight = size;
    const logoWidth = size * 3;

    return (
        <div
            className="flex items-center justify-start select-none shrink-0"
            style={{ height: logoHeight, width: logoWidth }}
        >
            <Image
                src={logoSrc}
                alt="NEOSHOP Distribuidor Oficial"
                width={logoWidth}
                height={logoHeight}
                quality={50} // Optimizado para evitar pixelación en tamaños grandes
                priority
                className="w-full h-full object-contain"
            />
        </div>
    );
}
// frontend/components/ui/Logo.tsx
import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
    size?: number; // El size define la altura (height) en píxeles y escala proporcionalmente
};

export default function Logo({ color = "black", size = 28 }: LogoProps) {
    const logoSrc = color === "black" ? "/logo_neo_largo.svg" : "/logo_blanco_completo.png";
    
    // Mantiene la relación de aspecto exacta 3:1 (120/40 = 3) de forma dinámica sin importar la escala
    const logoHeight = size;
    const logoWidth = size * 3; 

    return (
        <div 
            className="flex items-center justify-start select-none shrink-0"
            style={{ height: logoHeight, width: logoWidth }}
        >
            <Image
                src={logoSrc}
                alt="GoPhone Distribuidor Oficial"
                width={logoWidth}
                height={logoHeight}
                quality={85} // Optimizado para evitar pixelación en tamaños grandes
                priority
                className="w-full h-full object-contain"
            />
        </div>
    );
}
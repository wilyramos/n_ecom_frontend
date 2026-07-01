// frontend/components/ui/Logo.tsx
import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
    className?: string; 
};

export default function Logo({ color = "black", className = "h-full w-full" }: LogoProps) {
    const logoSrc = color === "black" 
        ? "/logo_fondo_blanco.svg" 
        : "/logo_fondo_blanco.svg";

    return (
        <div className={`flex items-center justify-start select-none shrink-0 ${className}`}>
            <div className="relative w-full h-full min-h-[40px]">
                <Image
                    src={logoSrc}
                    alt="NEOSHOP Importaciones Logo"
                    fill
                    priority
                    className="object-contain object-left"
                    unoptimized
                />
            </div>
        </div>
    );
}
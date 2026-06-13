// frontend/components/ui/Logo.tsx
import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
    className?: string; 
};

export default function Logo({ color = "black", className = "h-8 w-auto" }: LogoProps) {
    // 1. Corrección de rutas de imagen (Asegúrate de cambiar la ruta del blanco según tus assets)
    const logoSrc = color === "black" 
        ? "/logo_fondo_blanco.svg" 
        : "/logo_fondo_blanco.svg";

    return (
        <div className={`flex items-center justify-start select-none shrink-0 ${className}`}>
            <Image
                src={logoSrc}
                alt="NEOSHOP Importaciones Logo"
                width={150} 
                height={50}
                priority
                className="w-auto h-full object-contain"
            />
        </div>
    );
}
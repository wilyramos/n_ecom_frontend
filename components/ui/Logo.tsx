// frontend/components/ui/Logo.tsx
import Image from "next/image";

type LogoProps = {
    color?: "black" | "white";
    className?: string; 
};

export default function Logo({ color = "black", className = "h-10 w-auto" }: LogoProps) {
    const logoSrc = color === "black" 
        ? "/logosvg.svg" 
        : "/logosvg.svg";

    return (
        <div className={`relative flex items-center select-none shrink-0 ${className}`}>
            <Image
                src={logoSrc}
                alt="NEOSHOP Importaciones Logo"
                fill
                priority
                className="object-contain object-left"
                unoptimized
            />
        </div>
    );
}
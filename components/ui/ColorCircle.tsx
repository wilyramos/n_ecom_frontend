import { cn } from "@/lib/utils";
import { diccionarioColores } from "@/src/utils/constants/colores";

export default function ColorCircle({
    color,
    size,
}: {
    color: string;
    size?: number;
}) {
    const normalizedColor = color?.trim().toLowerCase() ?? "";
    const isHex = normalizedColor.startsWith("#");
    const bgClass = !isHex ? (diccionarioColores[normalizedColor] ?? "bg-gray-200") : "";

    return (
        <div
            title={color}
            style={{
                width: size ? `${size}px` : "100%",
                height: size ? `${size}px` : "100%",
                backgroundColor: isHex ? normalizedColor : undefined,
            }}
            className={cn(
                "rounded-full shrink-0 transition-colors duration-150",
                // "border border-black/10",
                // "shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]",
                bgClass
            )}
        />
    );
}
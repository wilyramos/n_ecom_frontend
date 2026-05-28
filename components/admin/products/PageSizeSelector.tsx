//File: frontend/components/admin/products/PageSizeSelector.tsx

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PageSizeSelector({ currentLimit }: { currentLimit: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", value);
        params.set("page", "1"); // Resetear a la primera página al cambiar el límite
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Mostrar:</span>
            <Select value={currentLimit.toString()} onValueChange={handleChange}>
                <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {[10, 20, 50, 100].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                            {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
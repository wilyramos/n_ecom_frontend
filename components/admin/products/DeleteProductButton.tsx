"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import DeleteProductDialog from "./DeleteProductDialog";

export default function DeleteProductButton({ productId }: { productId: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 rounded-lg transition-colors cursor-pointer"
                title="Eliminar producto"
            >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Eliminar</span>
            </button>

            <DeleteProductDialog
                productId={productId}
                open={open}
                onOpenChange={setOpen}
                onSuccess={() => router.push("/admin/products")}
            />
        </>
    );
}
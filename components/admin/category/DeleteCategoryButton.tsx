"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { DeleteCategoryAction } from "@/actions/category/delete-category-action";
import { AdminButton } from "@/src/components/admin/layout/admin-button";

export default function DeleteCategoryButton({
    categoryId,
}: {
    categoryId: string;
}) {
    const router = useRouter();
    const deleteCategoryWithId = DeleteCategoryAction.bind(null, categoryId);
    const [state, dispatch, isPending] = useActionState(deleteCategoryWithId, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach((error) => toast.error(error));
        }
        if (state.success) {
            toast.success(state.success);
            router.push("/admin/products/category");
        }
    }, [state, router]);

    return (
        <form action={dispatch}>
            <AdminButton
                type="submit"
                variant="destructive"
                size="sm"
                icon={Trash2}
                disabled={isPending}
                title="Eliminar esta categoría permanentemente"
            >
                {isPending ? "Eliminando..." : "Eliminar"}
            </AdminButton>
        </form>
    );
}
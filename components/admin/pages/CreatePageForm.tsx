// File: frontend/src/components/admin/page/CreatePageForm.tsx

"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createPageAction } from "@/actions/page-actions";
import PageFormFields from "./PageFormFields";
import type { ActionState } from "@/actions/page-actions";
import type { Page } from "@/src/schemas/page.schema";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

const INITIAL_STATE: ActionState<Page> = {
    success: false,
    message: "",
};

export default function CreatePageForm() {
    const router = useRouter();
    const [state, dispatch, isPending] = useActionState(createPageAction, INITIAL_STATE);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Página creada correctamente.");
            router.push("/admin/pages");
            return;
        }

        if (!state.success && state.message) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="flex flex-col gap-4 w-full mt-6" noValidate>
            <PageFormFields
                fields={state.success ? undefined : state.fields}
                fieldErrors={state.success ? undefined : state.fieldErrors}
            />

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-50 border-t border-zinc-100 sticky bottom-0 z-10 mt-8 rounded-b-lg">
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9 px-5 text-xs text-zinc-600 bg-white hover:bg-zinc-50 font-medium"
                >
                    <Link href="/admin/pages">
                        Cancelar
                    </Link>
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    size="sm"
                    className="h-9 px-8 bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 disabled:bg-zinc-300 gap-1.5"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="w-3.5 h-3.5" />
                            Crear Página
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
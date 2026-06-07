"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSectionAction, FormActionState } from "@/actions/section-action";
import SectionFormUI from "./SectionFormUI";
import { toast } from "sonner";

const initialState: FormActionState = { ok: false };

export default function NewSectionClient() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createSectionAction, initialState);

    useEffect(() => {
        if (state.ok) {
            toast.success("Sección añadida correctamente");
            router.push("/admin/sections");
            router.refresh();
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <SectionFormUI
            formAction={formAction}
            state={state}
            isPending={isPending}
            titleLabel="Nueva Sección de Tienda"
            subtitleLabel=" "
        />
    );
}
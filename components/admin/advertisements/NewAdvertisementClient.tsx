"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAdvertisementAction, AdFormActionState } from "@/actions/advertisement-actions";
import AdvertisementFormUI from "./AdvertisementFormUI";
import { toast } from "sonner";

const initialState: AdFormActionState = { ok: false };

export default function NewAdvertisementClient() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createAdvertisementAction, initialState);

    useEffect(() => {
        if (state.ok) {
            toast.success("Anuncio creado correctamente");
            router.push("/admin/advertisements");
            router.refresh();
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <AdvertisementFormUI
            formAction={formAction}
            state={state}
            isPending={isPending}
            titleLabel="Nueva Campaña Publicitaria"
            subtitleLabel=" "
        />
    );
}
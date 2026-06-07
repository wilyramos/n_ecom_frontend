"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateAdvertisementAction, AdFormActionState } from "@/actions/advertisement-actions";
import { TAdvertisement } from "@/src/schemas/advertisement.schema";
import AdvertisementFormUI from "./AdvertisementFormUI";
import { toast } from "sonner";

interface EditAdvertisementClientProps {
    initialData: TAdvertisement;
}

const initialState: AdFormActionState = { ok: false };

export default function EditAdvertisementClient({ initialData }: EditAdvertisementClientProps) {
    const router = useRouter();

    // Vinculamos permanentemente el ID del aviso a la ejecución del Server Action
    const updateAdWithId = updateAdvertisementAction.bind(null, initialData._id);

    const [state, formAction, isPending] = useActionState(updateAdWithId, initialState);

    useEffect(() => {
        if (state.ok) {
            toast.success("Anuncio actualizado correctamente");
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
            initialData={initialData}
            titleLabel="Modificar Campaña Publicitaria"
            subtitleLabel=" "
        />
    );
}
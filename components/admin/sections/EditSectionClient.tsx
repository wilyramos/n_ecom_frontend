"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateSectionAction, FormActionState } from "@/actions/section-action";
import { SectionResponse } from "@/src/schemas/section.schema";
import SectionFormUI from "./SectionFormUI";
import { toast } from "sonner";

interface EditSectionClientProps {
    sectionData: SectionResponse;
}

const initialState: FormActionState = { ok: false };

export default function EditSectionClient({ sectionData }: EditSectionClientProps) {
    const router = useRouter();
    
    const updateActionWithId = updateSectionAction.bind(null, sectionData._id);
    const [state, formAction, isPending] = useActionState(updateActionWithId, initialState);

    useEffect(() => {
        if (state.ok) {
            toast.success("Sección modificada correctamente");
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
            initialData={sectionData}
            titleLabel={`Editar Sección: ${sectionData.title}`}
            subtitleLabel="Flujo asincrónico nativo de edición"
        />
    );
}
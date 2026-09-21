// File: app/(admin)/admin/claims/[id]/components/ResolveForm.tsx
"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";
import { resolveClaimAction, ActionState } from "@/actions/claim-action";
import type { Claim } from "@/src/schemas/claim.schema";
import { AdminFormGroup, AdminSelect } from "@/src/components/admin/layout/admin-form-group";
import { AdminButton } from "@/src/components/admin/layout/admin-button";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface ResolveFormProps {
    claim: Claim;
}

export default function ResolveForm({ claim }: ResolveFormProps) {
    const initialState: ActionState<Claim> = {
        success: false,
        errors: {},
        message: "",
    };

    const resolveActionWithId = resolveClaimAction.bind(null, claim._id);
    const [state, formAction, isPending] = useActionState(resolveActionWithId, initialState);

    return (
        <form action={formAction} className="space-y-4 text-xs">
            {state.message && (
                <ErrorMessage variant={state.success ? "success" : "error"} mode="banner">
                    {state.message}
                </ErrorMessage>
            )}

            <AdminFormGroup label="Estado Comercial *">
                <AdminSelect
                    name="estado"
                    defaultValue={claim.resolution.estado}
                    disabled={isPending}
                    className="text-slate-800 font-medium"
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Resuelto">Resuelto (Cerrar caso)</option>
                </AdminSelect>
            </AdminFormGroup>

            <AdminFormGroup label="Respuesta Institucional Proveedor *">
                <textarea
                    id="respuestaProveedor"
                    name="respuestaProveedor"
                    rows={6}
                    disabled={isPending}
                    defaultValue={claim.resolution.respuestaProveedor || ""}
                    placeholder="Escribe de manera clara y sustentada la respuesta de la empresa que será enviada al consumidor..."
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:border-slate-400 transition-colors resize-y placeholder:text-slate-400 disabled:opacity-50"
                />
                {state.errors?.respuestaProveedor && (
                    <div className="mt-1">
                        <ErrorMessage variant="error" mode="inline">
                            {state.errors.respuestaProveedor[0]}
                        </ErrorMessage>
                    </div>
                )}
            </AdminFormGroup>

            <div className="pt-2">
                <AdminButton
                    type="submit"
                    variant="primary"
                    size="default"
                    icon={isPending ? Loader2 : Check}
                    disabled={isPending}
                    className="w-full"
                >
                    {isPending ? "Guardando cambios..." : "Guardar Resolución"}
                </AdminButton>
            </div>
        </form>
    );
}
// File: app/(admin)/admin/claims/[id]/components/ResolveForm.tsx
"use client";

import { useActionState } from "react";
import { resolveClaimAction, ActionState } from "@/actions/claim-action";
import { Claim } from "@/src/schemas/claim.schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface ResolveFormProps {
    claim: Claim;
}

export default function ResolveForm({ claim }: ResolveFormProps) {
    const initialState: ActionState<Claim> = {
        success: false,
        errors: {},
        message: ""
    };

    // Ajustamos la acción de cierre inyectándole el ID del reclamo de forma segura
    const resolveActionWithId = resolveClaimAction.bind(null, claim._id);
    const [state, formAction, isPending] = useActionState(resolveActionWithId, initialState);

    return (
        <form action={formAction} className="space-y-4 bg-white border p-4 rounded-lg">
            {state.message && (
                <ErrorMessage variant={state.success ? "success" : "error"} mode="banner">
                    {state.message}
                </ErrorMessage>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="estado">Modificar Estado Comercial</Label>
                    <Select 
                        name="estado" 
                        defaultValue={claim.resolution.estado}
                        disabled={isPending}
                    >
                        <SelectTrigger id="estado">
                            <SelectValue placeholder="Seleccione Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="En Proceso">En Proceso</SelectItem>
                            <SelectItem value="Resuelto">Resuelto (Cerrar Caso)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="respuestaProveedor">Respuesta Formal Institucional</Label>
                <Textarea
                    id="respuestaProveedor"
                    name="respuestaProveedor"
                    rows={5}
                    placeholder="Escribe de manera clara y sustentada la respuesta de la empresa que será notificada al usuario..."
                    defaultValue={claim.resolution.respuestaProveedor}
                    disabled={isPending}
                    className="resize-none"
                />
                {state.errors?.respuestaProveedor && (
                    <ErrorMessage variant="error" mode="inline">
                        {state.errors.respuestaProveedor[0]}
                    </ErrorMessage>
                )}
            </div>

            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Guardando cambios..." : "Guardar Resolución Oficial"}
                </Button>
            </div>
        </form>
    );
}
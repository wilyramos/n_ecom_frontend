// File: frontend/components/store/ChangePasswordForm.tsx

"use client";

import { useActionState, startTransition, useEffect } from "react";
import { changeOwnPasswordAction } from "@/actions/users-actions";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ChangePasswordForm() {
    const [state, formAction, isPending] = useActionState(
        changeOwnPasswordAction,
        { success: false }
    );

    useEffect(() => {
    if (state.success) {
        toast.success("Contraseña actualizada correctamente");
        const form = document.getElementById("change-password-form") as HTMLFormElement | null;
        form?.reset();
    } else if (state.error) {
        toast.error(state.error);
    }
}, [state]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <div className="bg-card p-8 max-w-3xl mx-auto border border-border rounded-[var(--radius-lg)] text-card-foreground">
            <form 
                id="change-password-form"
                onSubmit={handleSubmit} 
                className="flex flex-col gap-5" 
                noValidate
            >
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="currentPassword">
                        Contraseña actual
                    </Label>
                    <Input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password">
                        Nueva contraseña
                    </Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Mínimo 6 caracteres"
                        required
                        disabled={isPending}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirmPassword">
                        Confirmar nueva contraseña
                    </Label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Repita la nueva contraseña"
                        required
                        disabled={isPending}
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button 
                        type="submit" 
                        disabled={isPending} 
                        className="w-full md:w-auto bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold px-6"
                    >
                        {isPending ? "Actualizando..." : "Actualizar contraseña"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
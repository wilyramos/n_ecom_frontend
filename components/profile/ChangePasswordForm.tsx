"use client";

import { useActionState, startTransition, useEffect } from "react";
import { changeOwnPasswordAction } from "@/actions/users-actions";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changeOwnPasswordAction, {
    success: false,
  });

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
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xs">
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Seguridad de la cuenta</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Te sugerimos utilizar una contraseña única que combine letras y números.
        </p>
      </div>

      <form
        id="change-password-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currentPassword" className="text-xs font-medium text-foreground">
            Contraseña actual
          </Label>
          <Input
            type="password"
            id="currentPassword"
            name="currentPassword"
            placeholder="••••••••"
            required
            disabled={isPending}
            className="h-10 text-xs bg-background border-border focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-xs font-medium text-foreground">
            Nueva contraseña
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Mínimo 6 caracteres"
            required
            disabled={isPending}
            className="h-10 text-xs bg-background border-border focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
            Confirmar nueva contraseña
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Repite la nueva contraseña"
            required
            disabled={isPending}
            className="h-10 text-xs bg-background border-border focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-border mt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 px-6 text-xs font-medium bg-brand-black hover:bg-neutral-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            {isPending ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        </div>
      </form>
    </div>
  );
}
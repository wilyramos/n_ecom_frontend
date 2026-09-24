"use client";

import type { User } from "@/src/schemas";
import { useActionState, useEffect } from "react";
import { EditUserAction } from "@/actions/user/edit-user-action";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Lock } from "lucide-react";

export default function ProfileForm({ user }: { user: User }) {
  const EditUserWithId = EditUserAction.bind(null);
  const [state, dispatch, isPending] = useActionState(EditUserWithId, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error));
    }
    if (state.success) {
      toast.success(state.success);
    }
  }, [state]);

  if (!user) {
    return (
      <div className="bg-card p-8 rounded-2xl border border-border max-w-3xl mx-auto text-center">
        <p className="text-sm text-destructive">No se ha encontrado el usuario.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Datos personales</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Información utilizada para tus comprobantes y entregas de pedidos.
        </p>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-5" noValidate action={dispatch}>
        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nombre" className="text-xs font-medium text-foreground">
            Nombre
          </Label>
          <Input
            type="text"
            id="nombre"
            name="nombre"
            defaultValue={user?.nombre}
            className="h-10 text-xs bg-background border-border focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        {/* Apellidos */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="apellidos" className="text-xs font-medium text-foreground">
            Apellidos
          </Label>
          <Input
            type="text"
            id="apellidos"
            name="apellidos"
            defaultValue={user?.apellidos || ""}
            className="h-10 text-xs bg-background border-border focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        {/* Tipo de documento */}
        <div className="flex flex-col gap-1.5 w-full">
          <Label htmlFor="tipoDocumento" className="text-xs font-medium text-foreground">
            Tipo de documento
          </Label>
          <Select name="tipoDocumento" defaultValue={user?.tipoDocumento || "DNI"}>
            <SelectTrigger className="h-10 text-xs bg-background border-border focus:ring-1 focus:ring-foreground w-full">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-xs">
              <SelectItem value="DNI">DNI</SelectItem>
              <SelectItem value="RUC">RUC</SelectItem>
              <SelectItem value="CE">Carnet de Extranjería</SelectItem>
              <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Número de documento */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="numeroDocumento" className="text-xs font-medium text-foreground">
            Número de documento
          </Label>
          <Input
            type="text"
            id="numeroDocumento"
            name="numeroDocumento"
            defaultValue={user?.numeroDocumento || ""}
            className="h-10 text-xs bg-background border-border focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="telefono" className="text-xs font-medium text-foreground">
            Teléfono móvil
          </Label>
          <Input
            type="tel"
            id="telefono"
            name="telefono"
            maxLength={9}
            defaultValue={user?.telefono || ""}
            className="h-10 text-xs bg-background border-border focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="email" className="text-xs font-medium text-foreground">
              Correo electrónico
            </Label>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Lock className="w-3 h-3 text-muted-foreground/70" /> Cuenta vinculada
            </span>
          </div>
          <Input
            type="email"
            id="email"
            name="email"
            defaultValue={user?.email}
            readOnly
            tabIndex={-1}
            className="h-10 text-xs bg-secondary text-muted-foreground border-border cursor-not-allowed select-none"
          />
        </div>

        <div className="md:col-span-2 flex justify-end pt-3 border-t border-border">
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 px-6 text-xs font-medium bg-brand-black hover:bg-neutral-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
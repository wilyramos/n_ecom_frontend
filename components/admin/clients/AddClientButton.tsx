"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserAction } from "@/actions/user/create-user-action";
import { toast } from "sonner";
import { LuUserRoundPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ErrorMessage from "@/components/ui/ErrorMessage";

type Props = {
    role: 'client' | 'admin';
};

export default function AddClientButton({ role }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    // Ajuste de título según el rol
    const title = role === 'admin' ? "Nuevo Administrador/Vendedor" : "Nuevo Cliente";

    const [state, dispatch, isPending] = useActionState(createUserAction, {
        errors: [],
        success: null,
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.success.message);
            setOpen(false);
            router.refresh();
        }
    }, [state.success, router]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    <LuUserRoundPlus className="mr-2 h-4 w-4" />
                    <span>Agregar {role === 'admin' ? 'Usuario' : 'Cliente'}</span>
                </Button>
            </SheetTrigger>

            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>

                <form action={dispatch} className="mt-6 space-y-5 text-sm">
                    {/* Campo oculto para pasar el rol al servidor */}
                    <input type="hidden" name="role" value={role} />

                    <div className="space-y-1.5">
                        <Label htmlFor="tipoDocumento">Tipo de documento</Label>
                        <Select name="tipoDocumento" defaultValue="DNI">
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DNI">DNI</SelectItem>
                                <SelectItem value="RUC">RUC</SelectItem>
                                <SelectItem value="CE">Carné de extranjería</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="numeroDocumento">N° de documento</Label>
                        <Input id="numeroDocumento" name="numeroDocumento" placeholder="Ej: 12345678" disabled={isPending} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input id="nombre" name="nombre" disabled={isPending} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="apellidos">Apellidos</Label>
                            <Input id="apellidos" name="apellidos" disabled={isPending} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" disabled={isPending} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input id="telefono" name="telefono" type="tel" disabled={isPending} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Procesando..." : `Guardar ${role === 'admin' ? 'usuario' : 'cliente'}`}
                    </Button>

                    {state.errors?.map((err, i) => (
                        <ErrorMessage key={i} variant="error">{err}</ErrorMessage>
                    ))}
                </form>
            </SheetContent>
        </Sheet>
    );
}
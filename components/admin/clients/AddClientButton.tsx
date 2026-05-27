// File: components/admin/clients/AddClientButton.tsx
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserAction } from "@/actions/user/create-user-action";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { toast } from "sonner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { LuUserRoundPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddClientButton() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

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
                <Button className="flex items-center gap-2 cursor-pointer">
                    <LuUserRoundPlus className="h-4 w-4" />
                    <span>Nuevo</span>
                </Button>
            </SheetTrigger>

            <SheetContent className="bg-card text-card-foreground overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-foreground">Nuevo Cliente</SheetTitle>
                </SheetHeader>

                <form action={dispatch} className="mt-6 space-y-5 text-sm">
                    {/* Tipo de documento */}
                    <div className="space-y-1.5">
                        <Label htmlFor="tipoDocumento">Tipo de documento</Label>
                        <Select name="tipoDocumento" defaultValue="DNI">
                            <SelectTrigger id="tipoDocumento">
                                <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DNI">DNI</SelectItem>
                                <SelectItem value="RUC">RUC</SelectItem>
                                <SelectItem value="CE">Carné de extranjería</SelectItem>
                                <SelectItem value="PAS">Pasaporte</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* N° de documento */}
                    <div className="space-y-1.5">
                        <Label htmlFor="numeroDocumento">N° de documento</Label>
                        <Input
                            id="numeroDocumento"
                            type="text"
                            name="numeroDocumento"
                            placeholder="Ingrese el número de identidad"
                            disabled={isPending}
                        />
                    </div>

                    {/* Campos dinámicos */}
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                type="text"
                                name="nombre"
                                placeholder="Ej: Juan"
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="apellidos">Apellidos</Label>
                            <Input
                                id="apellidos"
                                type="text"
                                name="apellidos"
                                placeholder="Ej: Pérez"
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="usuario@correo.com"
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                                id="telefono"
                                type="tel"
                                name="telefono"
                                placeholder="Ej: 987654321"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-11 font-semibold cursor-pointer"
                        >
                            {isPending ? "Agregando..." : "Agregar cliente"}
                        </Button>
                    </div>

                    {/* Panel de Errores con tu componente ErrorMessage */}
                    {state.errors && state.errors.length > 0 && (
                        <div className="space-y-2 pt-2">
                            {state.errors.map((error: string, index: number) => (
                                <ErrorMessage key={index} variant="error" mode="inline">
                                    {error}
                                </ErrorMessage>
                            ))}
                        </div>
                    )}
                </form>
            </SheetContent>
        </Sheet>
    );
}
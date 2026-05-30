// File: frontend/components/admin/users/NuevoClienteModal.tsx

"use client";

import { useActionState, startTransition, useState, useEffect } from "react";
import { createClientAction } from "@/actions/users-actions";
import { TipoDocumentoSchema } from "@/src/schemas/user.schema";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function NuevoClienteModal() {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(
        createClientAction,
        { success: false }
    );

    useEffect(() => {
        if (state.success) {
            setOpen(false);
        }
    }, [state.success]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-[var(--radius-sm)]">
                    Nuevo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                    <DialogDescription>
                        Ingrese los datos personales del cliente. El rol asignado por defecto será de tipo cliente.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="nombre">Nombre *</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                placeholder="Ej. Juan"
                                required
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="apellidos">Apellidos</Label>
                            <Input
                                id="apellidos"
                                name="apellidos"
                                placeholder="Ej. Pérez"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email">Correo Electrónico *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="juan.perez@example.com"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            placeholder="Ej. 987654321"
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="tipoDocumento">Tipo Documento</Label>
                            <Select name="tipoDocumento" disabled={isPending}>
                                <SelectTrigger id="tipoDocumento">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TipoDocumentoSchema.options.map((tipo) => (
                                        <SelectItem key={tipo} value={tipo}>
                                            {tipo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="numeroDocumento">Número Documento</Label>
                            <Input
                                id="numeroDocumento"
                                name="numeroDocumento"
                                placeholder="N° Documento"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {state.error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-[var(--radius-sm)]">
                            <p className="text-sm font-bold text-destructive text-center select-none">
                                {state.error}
                            </p>
                        </div>
                    )}

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            variant="default"
                        >
                            {isPending ? "Guardando..." : "Registrar Cliente"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
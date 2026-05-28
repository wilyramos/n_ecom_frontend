"use client";

import type { User } from "@/src/schemas";
import { useActionState, useEffect } from "react";
import { EditUserAction } from "@/actions/user/edit-user-action";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function ProfileForm({ user }: { user: User }) {

    const EditUserWithId = EditUserAction.bind(null);
    const [state, dispatch] = useActionState(EditUserWithId, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach(error => {
                toast.error(error);
            });
        }
        if (state.success) {
            toast.success(state.success);
        }
    }, [state]);

    if (!user) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
                <p className="text-red-500">No se ha encontrado el usuario.</p>
            </div>
        );
    }

    return (
        <div className="p-8 mx-auto">
            <form 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                noValidate
                action={dispatch}
            >
                {/* Nombre */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="nombre" className="text-sm text-gray-600 font-old">Nombre</Label>
                    <Input
                        type="text"
                        id="nombre"
                        name="nombre"
                        defaultValue={user?.nombre}
                    />
                </div>

                {/* Apellidos */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="apellidos" className="text-sm text-gray-600 font-old">Apellidos</Label>
                    <Input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        defaultValue={user?.apellidos || ""}
                    />
                </div>

                {/* Tipo de documento */}
                <div className="flex flex-col gap-1 w-full">
                    <Label htmlFor="tipoDocumento" className="text-sm text-gray-600 font-old">Tipo de documento</Label>
                    <Select name="tipoDocumento" defaultValue={user?.tipoDocumento || "DNI"} >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="RUC">RUC</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Número de documento */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="numeroDocumento" className="text-sm text-gray-600 font-old">Número de documento</Label>
                    <Input
                        type="text"
                        id="numeroDocumento"
                        name="numeroDocumento"
                        defaultValue={user?.numeroDocumento || ""}
                    />
                </div>

                {/* Teléfono */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="telefono" className="text-sm text-gray-600 font-old">Teléfono</Label>
                    <Input
                        type="text"
                        id="telefono"
                        name="telefono"
                        defaultValue={user?.telefono || ""}
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="email" className="text-sm text-gray-600 font-old">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={user?.email}
                    />
                </div>

                {/* Botón */}
                <Button type="submit">
                    Guardar cambios
                </Button>
            </form>
        </div>
    );
}
"use client";

import * as React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadImageBrand } from "@/actions/brand/upload-image-action";
import Image from "next/image";
import { useState, useRef } from "react";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
    image?: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
};

export function ImageUploadDialog({ image, inputRef }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(image);
    const [isUploading, setIsUploading] = useState(false);
    const [open, setOpen] = useState(false);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Por favor, selecciona un archivo de imagen válido.");
            return;
        }
        if (file.size > 1 * 1024 * 1024) {
            toast.error("El tamaño de la imagen no debe superar los 1MB.");
            return;
        }

        setIsUploading(true);
        const form = new FormData();
        form.append("file", file);

        try {
            const result = await uploadImageBrand(form);
            if (result?.image) {
                setUploadedUrl(result.image);
                if (inputRef.current) inputRef.current.value = result.image;
                setOpen(false);
            }
        } finally {
            setIsUploading(false);
        }
    }

    function handleRemove() {
        setUploadedUrl(undefined);
        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex flex-col items-start gap-2 w-full cursor-pointer">
                    <Button type="button" variant="outline" className="w-full justify-start">
                        {uploadedUrl ? "Cambiar imagen" : "Subir imagen"}
                    </Button>

                    <div className="w-24 h-24 border border-border rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden relative">
                        {uploadedUrl ? (
                            <Image
                                src={uploadedUrl}
                                alt="Category"
                                className="object-cover"
                                fill
                                sizes="96px"
                            />
                        ) : (
                            <span className="text-muted-foreground text-[10px]">Sin imagen</span>
                        )}
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Subir imagen de categoría</DialogTitle>
                    <DialogDescription>
                        Selecciona una imagen representativa para esta categoría.
                    </DialogDescription>
                </DialogHeader>

                <div
                    className={cn(
                        "relative border-2 border-dashed border-border rounded-xl h-44 flex items-center justify-center bg-muted/30 hover:bg-muted/50 cursor-pointer transition overflow-hidden",
                        isUploading && "opacity-60 cursor-not-allowed"
                    )}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <SpinnerLoading />
                    ) : uploadedUrl ? (
                        <Image
                            src={uploadedUrl}
                            alt="Category"
                            fill
                            className="object-contain p-2"
                        />
                    ) : (
                        <span className="text-muted-foreground text-sm">Haz clic para seleccionar</span>
                    )}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                <DialogFooter className="flex justify-between items-center sm:justify-between">
                    {uploadedUrl && !isUploading ? (
                        <Button type="button" variant="ghost" onClick={handleRemove} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                            Eliminar
                        </Button>
                    ) : <div />}
                    <Button variant="secondary" onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
// File: frontend/components/admin/products/MediaLibraryDialog.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { CheckCircle2, UploadCloud, ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/actions/product/upload-image-action";
import { toast } from "sonner";

interface MediaLibraryProps {
    selectedImages: string[];
    globalImagesPool: string[];
    onConfirmSelection: (images: string[]) => void;
    onUploadSuccess: (newImages: string[]) => void;
    allowMultiple?: boolean;
    triggerLabel?: string;
    triggerVariant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
    size?: "sm" | "md" | "lg";
}

export default function MediaLibraryDialog({
    selectedImages,
    globalImagesPool,
    onConfirmSelection,
    onUploadSuccess,
    allowMultiple = true,
    triggerLabel = "Gestionar Multimedia",
    triggerVariant = "outline",
    size = "sm",
}: MediaLibraryProps) {
    const [tempSelection, setTempSelection] = useState<string[]>(selectedImages);
    const [isUploading, setIsUploading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setTempSelection(selectedImages);
    }, [selectedImages]);

    const onDrop = useCallback(
        async (files: File[]) => {
            setIsUploading(true);
            const formData = new FormData();

            const totalImages = tempSelection.length + files.length;
            if (totalImages > 15) {
                toast.error(`No se pueden subir más de 15 imágenes. Tienes ${tempSelection.length} seleccionadas.`);
                setIsUploading(false);
                return;
            }

            files.forEach((f) => formData.append("images", f));

            try {
                const result = await uploadImage(formData);
                onUploadSuccess(result.images);
                setTempSelection((prev) =>
                    allowMultiple ? [...prev, ...result.images] : [result.images[0]]
                );
                toast.success(`${result.images.length} imagen(es) subida(s) correctamente`);
            } catch (error) {
                console.error("Error al subir imágenes:", error);
                toast.error("Error al subir imágenes. Intenta de nuevo.");
            } finally {
                setIsUploading(false);
            }
        },
        [onUploadSuccess, allowMultiple, tempSelection.length]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
            "image/avif": [".avif"],
            "image/gif": [".gif"],
            "image/svg+xml": [".svg"],
            "image/heic": [".heic"],
            "image/heif": [".heif"],
            "image/bmp": [".bmp"],
            "image/tiff": [".tiff", ".tif"],
        },
        disabled: isUploading,
        multiple: true,
    });

    const toggleSelection = (url: string) => {
        setTempSelection((prev) => {
            if (prev.includes(url)) return prev.filter((i) => i !== url);
            return allowMultiple ? [...prev, url] : [url];
        });
    };

    const handleConfirm = () => {
        onConfirmSelection(tempSelection);
        setIsOpen(false);
    };

    const sizeClasses = {
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={triggerVariant}
                    size="sm"
                    className="gap-1.5 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                    type="button"
                >
                    <ImageIcon className={sizeClasses[size]} />
                    <span>{triggerLabel}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 border-slate-200 bg-white shadow-xl rounded-2xl overflow-hidden">
                <DialogHeader className="p-5 pb-3 border-b border-slate-100">
                    <DialogTitle className="text-base font-semibold text-slate-900">
                        Biblioteca Multimedia
                    </DialogTitle>
                    <p className="text-xs text-slate-500">
                        {allowMultiple
                            ? "Carga archivos o selecciona las fotos que deseas asociar."
                            : "Selecciona una imagen del catálogo."}
                    </p>
                </DialogHeader>

                <div className="flex-1 flex flex-col overflow-hidden p-5 gap-4">
                    {/* Zona Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                            isDragActive
                                ? "border-slate-900 bg-slate-50"
                                : "border-slate-200 hover:border-slate-400 bg-slate-50/50"
                        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
                    >
                        <input {...getInputProps()} />
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-1.5">
                                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                                <p className="text-xs font-medium text-slate-600">Subiendo imágenes...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1.5">
                                <UploadCloud className="w-8 h-8 text-slate-400" />
                                <p className="text-xs font-medium text-slate-700">
                                    Arrastra imágenes aquí o haz clic para examinar
                                </p>
                                <p className="text-[11px] text-slate-400">JPG, PNG, WEBP o AVIF</p>
                            </div>
                        )}
                    </div>

                    {/* Selector de imágenes */}
                    <ScrollArea className="flex-1 border border-slate-200 rounded-xl bg-slate-50/30 p-3">
                        {globalImagesPool.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-slate-400 text-xs">
                                No hay imágenes disponibles en este producto.
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                                {globalImagesPool.map((url) => {
                                    const isSelected = tempSelection.includes(url);
                                    return (
                                        <div
                                            key={url}
                                            onClick={() => toggleSelection(url)}
                                            className={`group relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 bg-white transition-all ${
                                                isSelected
                                                    ? "border-slate-900 ring-2 ring-slate-900/10"
                                                    : "border-transparent hover:border-slate-300"
                                            }`}
                                        >
                                            <Image
                                                src={url}
                                                alt="Media"
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                            {isSelected && (
                                                <div className="absolute top-1 right-1 bg-slate-900 text-white rounded-full p-0.5 shadow-sm">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200">
                    <div className="flex items-center justify-between w-full gap-2">
                        <p className="text-xs text-slate-500">
                            {tempSelection.length} seleccionada{tempSelection.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex items-center gap-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-slate-600 hover:text-slate-900"
                                >
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleConfirm}
                                disabled={tempSelection.length === 0}
                                className="text-xs bg-slate-900 hover:bg-slate-800 text-white"
                            >
                                Aplicar Selección
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
"use client";

// Logo de marca. Usa el módulo de medios (biblioteca + subida) y emite `logo` como
// input oculto. Mantiene la misma interfaz para BrandDialog y NewBrandDialog.

import { useState } from "react";
import { MediaPickerField } from "@/src/modules/media";

export default function UploadBrandImage({ defaultImage }: { defaultImage?: string }) {
    const [logo, setLogo] = useState<string[]>(defaultImage ? [defaultImage] : []);

    return (
        <MediaPickerField
            name="logo"
            kind="image"
            folder="brands"
            max={1}
            value={logo}
            onChange={setLogo}
            label="Logo de la marca"
            helpText="JPG, PNG, WebP o AVIF"
            emptyText="Sin logo"
            emitEmpty
        />
    );
}

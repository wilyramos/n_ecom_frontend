// File: frontend/components/home/StoreLocationSection.tsx
// Server Component: lee las imágenes de la galería de ubicación desde la sección activa
// de tipo "image_gallery" (configurada en Admin → Secciones) y las pasa al componente visual.
// Si no hay sección o falla la API, StoreLocation usa sus fotos por defecto.

import { getActiveSections } from "@/src/services/section-service";
import StoreLocation from "./StoreLocation";

export default async function StoreLocationSection() {
    let images: string[] = [];

    try {
        const sections = await getActiveSections();
        const gallery = sections.find((section) => section.type === "image_gallery");
        images = (gallery?.blocks ?? [])
            .map((block) => block.imageUrl)
            .filter((url): url is string => typeof url === "string" && url.trim().length > 0);
    } catch (error) {
        console.error("Ubicación: no se pudieron cargar las imágenes configuradas", error);
    }

    return <StoreLocation images={images} />;
}

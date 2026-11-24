"use server";

import getToken from "@/src/auth/token";
import { createProductSchema, especificacionSchema } from "@/src/schemas";
import type { TApiVariant, TEspecificacion } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: string;
};

export async function createProduct(prevState: ActionStateType, formData: FormData) {

    // 1. Atributos
    const atributosString = formData.get('atributos') as string;
    let atributos: Record<string, string> = {};
    if (atributosString) {
        try {
            atributos = JSON.parse(atributosString);
        } catch (error) {
            console.error("Error parsing atributos:", error);
            return { errors: ["Error al procesar atributos. Formato JSON inválido."], success: "" };
        }
    }

    // 2. Especificaciones
    const especificacionesString = formData.get('especificaciones') as string;
    let especificaciones: TEspecificacion[] = [];
    if (especificacionesString) {
        try {
            const parsed = JSON.parse(especificacionesString);
            especificaciones = especificacionSchema.array().parse(parsed);
        } catch (error) {
            console.error("Error parsing especificaciones:", error);
            return { errors: ["Las especificaciones son inválidas."], success: "" };
        }
    }

    // 3. Precio comparativo
    const precioCompString = formData.get('precioComparativo') as string;
    const precioComparativo =
        precioCompString && precioCompString.trim() !== ''
            ? Number(precioCompString)
            : undefined;

    // 4. Variantes
    const rawVariants = formData.get("variants")
        ? JSON.parse(formData.get("variants") as string)
        : [];

    const cleanedVariants = rawVariants.map((variant: TApiVariant) => {
        const filteredAttributes: Record<string, string> = {};
        Object.entries(variant.atributos).forEach(([key, value]) => {
            if (value.trim() !== "") filteredAttributes[key] = value;
        });
        return { ...variant, atributos: filteredAttributes };
    });

    // 5. Tags — getAll igual que imagenes[]
    const tagsRaw = formData.get('tags') as string;
    const tags: string[] = tagsRaw ? JSON.parse(tagsRaw) : [];
    // 6. Dimensions — campos planos
    const dimLength = formData.get('dimensions.length') as string;
    const dimWidth = formData.get('dimensions.width') as string;
    const dimHeight = formData.get('dimensions.height') as string;
    const dimensions =
        dimLength || dimWidth || dimHeight
            ? {
                length: dimLength ? Number(dimLength) : 0,
                width: dimWidth ? Number(dimWidth) : 0,
                height: dimHeight ? Number(dimHeight) : 0,
            }
            : undefined;

    // 7. Complementarios — getAll igual que edit action
    const complementarios = formData.getAll('complementarios') as string[];

    // 8. Construir productData
    const productData = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: Number(formData.get('precio')),
        precioComparativo,
        costo: Number(formData.get('costo')),
        stock: Number(formData.get('stock')),
        categoria: formData.get('categoria'),
        brand: formData.get('brand') || undefined,
        line: formData.get('line') || undefined,
        sku: formData.get('sku') || undefined,
        barcode: formData.get('barcode') || undefined,
        imagenes: formData.getAll('imagenes[]') as string[],
        videos: formData.getAll('videos[]') as string[],
        variantAxes: formData.getAll('variantAxes[]') as string[],
        atributos,
        especificaciones,
        variants: cleanedVariants,
        complementarios,
        esDestacado: formData.get('esDestacado') === 'true',
        esNuevo: formData.get('esNuevo') === 'true',
        isActive: formData.get('isActive') === 'true',
        isFrontPage: formData.get('isFrontPage') === 'true',
        diasEnvio: formData.get('diasEnvio') ? Number(formData.get('diasEnvio')) : undefined,
        tags,
        weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
        dimensions,
        metaTitle: formData.get('metaTitle') || undefined,
        metaDescription: formData.get('metaDescription') || undefined,
    };

    // 9. Validar con Zod
    const result = createProductSchema.safeParse(productData);
    if (!result.success) {
        console.log("Error de validación Zod:", result.error.format());
        return {
            errors: result.error.issues.map((issue) => issue.message),
            success: ""
        };
    }

    // 10. Enviar al Backend
    try {
        const token = await getToken();
        const response = await fetch(`${process.env.API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(result.data)
        });

        const json = await response.json();
        if (!response.ok) {
            // El backend envía `errors` con todos los problemas; `message` es el primero.
            const messages = Array.isArray(json.errors) && json.errors.length > 0
                ? json.errors
                : [json.message || "Error al crear el producto."];
            return { errors: messages, success: "" };
        }

        return { errors: [], success: "Producto creado exitosamente" };

    } catch (error) {
        console.error("Error en la petición fetch:", error);
        return { errors: ["Error de conexión con el servidor."], success: "" };
    }
}
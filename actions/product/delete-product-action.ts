"use server";

import { revalidatePath } from "next/cache";
import getToken from "@/src/auth/token";
import { ErrorResponse, SuccessResponse } from "@/src/schemas";

export type DeleteProductState = {
    errors: string[];
    success: string;
};

export async function DeleteProduct(
    productId: string,
    _prevState: DeleteProductState
): Promise<DeleteProductState> {
    try {
        const token = await getToken();
        const url = `${process.env.API_URL}/products/${productId}`;

        const req = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const json = await req.json().catch(() => null);

        if (!req.ok) {
            const parsedError = ErrorResponse.safeParse(json);
            const message = parsedError.success
                ? parsedError.data.message
                : "No se pudo eliminar el producto.";
            return {
                errors: [message],
                success: "",
            };
        }

        const parsedSuccess = SuccessResponse.safeParse(json);
        const message = parsedSuccess.success
            ? parsedSuccess.data.message
            : "Producto eliminado correctamente.";

        revalidatePath("/admin/products");

        return {
            errors: [],
            success: message,
        };
    } catch {
        return {
            errors: ["Ocurrió un error inesperado al conectar con el servidor."],
            success: "",
        };
    }
}
// actions/category/delete-category-action.ts
"use server";

import getToken from "@/src/auth/token";
import { ErrorResponse, SuccessResponse } from "@/src/schemas";

type ActionStateType = {
    errors: string[],
    success: string
};

export async function DeleteCategoryAction(categoryId: string, prevState: ActionStateType) {
    const token = await getToken();
    const url = `${process.env.API_URL}/category/${categoryId}`;
    const req = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const json = await req.json();
    if (!req.ok) {
        const error = ErrorResponse.parse(json);
        return {
            errors: [error.message],
            success: ""
        }
    }

    const success = SuccessResponse.parse(json);
    
    // No se incluye revalidatePath por instrucción
    
    return {
        errors: [],
        success: success.message
    }
}
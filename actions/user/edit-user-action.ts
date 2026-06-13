"use server"

import getToken from "@/src/auth/token"
// import { ErrorResponse } from "@/src/schemas" // TODO
import { revalidatePath } from "next/cache"
import { UserEditSchema } from "@/src/schemas"



type ActionStateType = {
    errors: string[],
    success: string
}


export async function EditUserAction(prevState: ActionStateType, formData: FormData) {


    const userData = {
        nombre: formData.get("nombre"),
        apellidos: formData.get("apellidos"),
        tipoDocumento: formData.get("tipoDocumento"),
        numeroDocumento: formData.get("numeroDocumento"),
        telefono: formData.get("telefono"),
    }

    console.log("userData", userData)

    const parsed = UserEditSchema.safeParse(userData);
    if (!parsed.success) {
        return {
            errors: parsed.error.errors.map(err => err.message),
            success: ""
        }
    }

    console.log("Parsed userData:", parsed.data)

    const token = await getToken()
    if (!token) {
        return {
            errors: ["No se ha encontrado el token de autenticación"],
            success: ""
        }
    }
    // Prepare the request

    const url = `${process.env.API_URL}/auth/edit-profile`;
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data)
    })

    console.log('Response status:', req.status)

    const json = await req.json()

    console.log('Response JSON:', json)


    if (!req.ok) {
        return {
            errors: [json.message],
            success: ""
        }
    }





    // Revalidate the path to update the user profile
    revalidatePath("/profile")

    return {
        errors: [],
        success: json.message
    }

}
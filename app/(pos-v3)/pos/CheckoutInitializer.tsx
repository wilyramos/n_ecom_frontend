/* File: app/(pos-v3)/terminaltres/CheckoutInitializer.tsx 
    @Author: whramos 
    @Description: Client-side bridge to hydrate CheckoutStore.
*/

"use client";

import { useEffect } from "react";
import { useCheckoutStore } from "@/src/store/useCheckoutStore";

interface Props {
    userId: string;
    shiftId: string;
}

export const CheckoutInitializer = ({ userId, shiftId }: Props) => {
    const setSession = useCheckoutStore((state) => state.setSession);

    useEffect(() => {
        // Solo sincronizar si los datos son válidos
        if (userId && shiftId) {
            setSession(userId, shiftId);
            
            // Log de auditoría en desarrollo
            if (process.env.NODE_ENV === 'development') {
                console.log(`[neoshop-v3] Sesión de Checkout Vinculada:`);
                console.table({ Empleado: userId, Turno: shiftId });
            }
        }
    }, [userId, shiftId, setSession]);

    return null; // Componente puramente lógico
};
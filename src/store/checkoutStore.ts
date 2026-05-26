import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { TShippingAddress } from '../schemas';

type TipoDocumento = 'DNI' | 'Pasaporte' | 'CE' | 'RUC';

export type CheckoutData = {
    // Contacto
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
    // Envío
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    numero?: string;
    pisoDpto?: string;
    referencia: string;
}

interface CheckoutState {
    data: CheckoutData | null;
    setData: (data: CheckoutData) => void;
    clearCheckout: () => void;
    // Compatibilidad con código existente
    profile: CheckoutData | null;
    shipping: TShippingAddress | null;
}

export const useCheckoutStore = create<CheckoutState>()(devtools(persist((set, ) => ({
    data: null,
    profile: null,
    shipping: null,

    setData: (data) => set({
        data,
        profile: data,
        shipping: {
            departamento: data.departamento,
            provincia: data.provincia,
            distrito: data.distrito,
            direccion: data.direccion,
            numero: data.numero,
            pisoDpto: data.pisoDpto,
            referencia: data.referencia,
        }
    }),

    clearCheckout: () => set({ data: null, profile: null, shipping: null }),
}), {
    name: 'checkout-storage_ecom',
})));
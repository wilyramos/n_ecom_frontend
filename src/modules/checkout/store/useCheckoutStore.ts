// src/modules/checkout/store/useCheckoutStore.ts
import { create } from 'zustand';

interface CheckoutState {
    paymentProvider: 'mercadopago' | 'culqi' | 'powerpay' | 'transferencia' | null;
    setPaymentProvider: (provider: CheckoutState['paymentProvider']) => void;
    isProcessingPayment: boolean;
    setIsProcessingPayment: (status: boolean) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
    paymentProvider: null,
    setPaymentProvider: (provider) => set({ paymentProvider: provider }),
    isProcessingPayment: false,
    setIsProcessingPayment: (status) => set({ isProcessingPayment: status }),
}));
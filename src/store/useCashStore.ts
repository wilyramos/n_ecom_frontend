//File: src/store/useCashStore.ts

import { create } from 'zustand';

interface CashState {
    isOpen: boolean;
    currentShiftId: string | null;
    isModalOpen: boolean; // <-- Nuevo: controla la visibilidad del modal
    setOpen: (isOpen: boolean, shiftId?: string | null) => void;
    toggleModal: (show: boolean) => void; // <-- Nuevo: acción para mostrar/ocultar
    reset: () => void;
}

export const useCashStore = create<CashState>((set) => ({
    isOpen: false,
    currentShiftId: null,
    isModalOpen: false,
    setOpen: (isOpen, shiftId) => set({ 
        isOpen, 
        currentShiftId: shiftId || null,
        isModalOpen: false // Cerramos modal automáticamente al abrir caja
    }),
    toggleModal: (show) => set({ isModalOpen: show }),
    reset: () => set({ 
        isOpen: false, 
        currentShiftId: null,
        isModalOpen: false 
    }),
}));
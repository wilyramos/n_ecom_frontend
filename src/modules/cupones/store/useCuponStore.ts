// File: frontend/src/modules/cupones/store/useCuponStore.ts

'use client';

import { create } from 'zustand';
import type { IResultadoCupon } from '../types/cupon.types';

interface CuponState {
  /** Cupón validado por el servidor para el carrito actual */
  cupon: IResultadoCupon | null;
  aplicar: (cupon: IResultadoCupon) => void;
  quitar: () => void;
}

export const useCuponStore = create<CuponState>((set) => ({
  cupon: null,
  aplicar: (cupon) => set({ cupon }),
  quitar: () => set({ cupon: null }),
}));

/** Descuento vigente del cupón (0 si no hay cupón aplicado) */
export const selectDescuentoCupon = (state: CuponState) => state.cupon?.descuento ?? 0;

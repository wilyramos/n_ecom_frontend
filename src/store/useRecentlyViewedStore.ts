/* File: src/store/useRecentlyViewedStore.ts */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductWithCategoryResponse } from '@/src/schemas';

interface RecentlyViewedState {
    history: ProductWithCategoryResponse[];
    addProduct: (product: ProductWithCategoryResponse) => void;
    clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        (set) => ({
            history: [],
            addProduct: (product) => set((state) => {
                const filtered = state.history.filter((p) => p.slug !== product.slug);
                const updated = [product, ...filtered].slice(0, 5);
                return { history: updated };
            }),
            clearHistory: () => set({ history: [] }),
        }),
        { name: 'neoshop-recent-v3' } // LocalStorage Key
    )
);
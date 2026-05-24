//File:

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
    CartItem,
    ProductWithCategoryResponse,
    VariantCart,
    TReceiptType,
    receiptTypeSchema,
    type TApiProduct,
} from '@/src/schemas';
import { saveCartToDB } from '@/lib/api/cart';


interface Store {
    cart: CartItem[];
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;

    saleCompleted: boolean;
    setSaleCompleted: (value: boolean) => void;
    saleId: string | null;
    setSaleId: (id: string | null) => void;
    resetSale: () => void;

    total: number;
    dni: string | undefined;
    comprobante: TReceiptType;
    setComprobante: (comprobante: TReceiptType) => void;

    addToCart: (item: TApiProduct | ProductWithCategoryResponse, variant?: VariantCart) => void;
    updateQuantity: (id: string, quantity: number, variantId?: string) => void;
    removeFromCart: (id: string, variantId?: string) => void;

    clearCart: () => void;
    saveCart: () => Promise<void>;
    calculateTotal: () => void;

    setDni: (dni: string) => void;
    clearDni: () => void;
    clearComprobante: () => void;
}

export const useCartStore = create<Store>()(
    devtools(
        persist(
            (set, get) => ({
                cart: [],
                isCartOpen: false,
                saleCompleted: false,
                saleId: null,
                total: 0,
                dni: undefined,
                comprobante: receiptTypeSchema.parse('TICKET'),

                setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
                setComprobante: (comprobante) => set({ comprobante }),
                setSaleCompleted: (value) => set({ saleCompleted: value }),
                setSaleId: (id) => set({ saleId: id }),
                resetSale: () =>
                    set({
                        saleCompleted: false,
                        saleId: null,
                        cart: [],
                        total: 0,
                        dni: undefined,
                        comprobante: 'TICKET',
                    }),

                addToCart: (item, variant) => {
                    const cart = get().cart;

                    const productInCart = cart.find((cartItem) =>
                        variant
                            ? cartItem._id === item._id && cartItem.variant?._id === variant._id
                            : cartItem._id === item._id && !cartItem.variant
                    );

                    const stock = variant?.stock ?? item.stock ?? 0;
                    const precio = variant?.precio ?? item.precio ?? 0;
                    const imagenes =
                        variant?.imagenes && variant.imagenes.length > 0
                            ? variant.imagenes
                            : item.imagenes ?? [];

                    if (productInCart) {
                        if (productInCart.cantidad >= stock) return;
                        set({
                            cart: cart.map((cartItem) =>
                                cartItem === productInCart
                                    ? {
                                        ...cartItem,
                                        cantidad: cartItem.cantidad + 1,
                                        subtotal: (cartItem.cantidad + 1) * cartItem.precio,
                                    }
                                    : cartItem
                            ),
                        });
                    } else {
                        set({
                            cart: [
                                ...cart,
                                {
                                    _id: item._id,
                                    nombre: item.nombre,
                                    precio,
                                    cantidad: 1,
                                    subtotal: precio,
                                    stock,
                                    imagenes,
                                    variant: variant
                                        ? {
                                            _id: variant._id,
                                            nombre: variant.nombre,
                                            precio: variant.precio,
                                            atributos: variant.atributos ?? {},
                                            stock: variant.stock,
                                            imagenes:
                                                variant.imagenes && variant.imagenes.length > 0
                                                    ? variant.imagenes
                                                    : undefined,
                                        }
                                        : undefined,
                                },
                            ],
                        });
                    }

                    get().calculateTotal();
                },

                updateQuantity: (id, quantity, variantId) => {
                    const cart = get().cart;
                    const productInCart = cart.find((cartItem) =>
                        variantId
                            ? cartItem._id === id && cartItem.variant?._id === variantId
                            : cartItem._id === id && !cartItem.variant
                    );

                    if (!productInCart) return;
                    if (quantity < 1) return;
                    if (quantity > (productInCart.stock ?? 0)) return;

                    set({
                        cart: cart.map((cartItem) =>
                            cartItem === productInCart
                                ? { ...cartItem, cantidad: quantity, subtotal: quantity * cartItem.precio }
                                : cartItem
                        ),
                    });

                    get().calculateTotal();
                },

                removeFromCart: (id, variantId) => {
                    const cart = get().cart;
                    set({
                        cart: cart.filter((cartItem) =>
                            variantId
                                ? !(cartItem._id === id && cartItem.variant?._id === variantId)
                                : !(cartItem._id === id && !cartItem.variant)
                        ),
                    });
                    get().calculateTotal();
                },

                calculateTotal: () => {
                    const total = get().cart.reduce((acc, item) => acc + item.subtotal, 0);
                    set({ total });
                },

                clearCart: () => set({ cart: [], total: 0 }),
                saveCart: async () => {
                    await saveCartToDB(get().cart);
                },
                setDni: (dni) => set({ dni }),
                clearDni: () => set({ dni: undefined }),
                clearComprobante: () => set({ comprobante: 'TICKET' }),
            }),
            { name: 'cart-storage-neoshop' }
        )
    )
);

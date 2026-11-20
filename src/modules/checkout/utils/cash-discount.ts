// File: frontend/src/modules/checkout/utils/cash-discount.ts

/** Descuento fijo por unidad de iPhone al pagar en efectivo o transferencia */
export const CASH_DISCOUNT_IPHONE = 100;
export const CASH_PROVIDER = 'efectivo';

type CartLike = { categoriaNombre?: string | null; cantidad: number };

const normalize = (value?: string | null) =>
  (value ?? '').toLowerCase().replace(/[\s\-_]+/g, '');

export const esCategoriaIphone = (categoriaNombre?: string | null) =>
  normalize(categoriaNombre).includes('iphone');

/** Unidades de productos iPhone en el carrito */
export const contarUnidadesIphone = (cart: CartLike[]) =>
  cart.reduce((acc, item) => (esCategoriaIphone(item.categoriaNombre) ? acc + item.cantidad : acc), 0);

/** Monto a descontar si el pago es en efectivo */
export const calcularDescuentoEfectivo = (cart: CartLike[]) =>
  contarUnidadesIphone(cart) * CASH_DISCOUNT_IPHONE;

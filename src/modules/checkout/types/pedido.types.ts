// File: frontend/src/modules/checkout/types/pedido.types.ts

export type TipoDocumento = 'DNI' | 'CE' | 'RUC' | 'PASAPORTE' | 'OTRO';
export type TipoComprobante = 'boleta' | 'factura';
export type MetodoEntrega = 'shipping' | 'pickup';

export type EstadoPedido =
    | 'awaiting_payment'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'canceled'
    | 'paid_but_out_of_stock';

export type EstadoPago = 'pending' | 'approved' | 'rejected' | 'refunded';

export interface IPerfilCliente {
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
}

export interface IDireccionEnvio {
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    numero?: string;
    pisoDpto?: string;
    referencia?: string;
}

export interface IInfoFacturacion {
    type: TipoComprobante;
    documentNumber: string;
    businessName?: string;
    address?: string;
}

export interface IItemPedido {
    productId: string;
    variantId?: string;
    variantAttributes?: Record<string, string>;
    quantity: number;
    price: number;
    nombre: string;
    imagen?: string;
}

export interface IInfoPago {
    provider: string;
    method?: string;
    gatewayOrderId?: string;
    transactionId?: string;
    paymentCode?: string;
    status: EstadoPago;
    paidAt?: string;
}

export interface IPedido {
    _id: string;
    orderNumber: string;
    user?: string;
    customerProfile: IPerfilCliente;
    deliveryMethod: MetodoEntrega;
    invoiceInfo?: IInfoFacturacion;
    items: IItemPedido[];
    subtotal: number;
    igv: number;
    shippingCost: number;
    recargoFinanciero: number;
    totalPrice: number;
    currency: string;
    status: EstadoPedido;
    shippingAddress: IDireccionEnvio;
    payment: IInfoPago;
    createdAt: string;
    updatedAt: string;
}

export interface ICrearPedidoResponse {
  success: boolean;
  message?: string;
  data?: {
    pedido: IPedido;
    initPoint?: string | null;
    culqiOrderId?: string | null;
  };
}
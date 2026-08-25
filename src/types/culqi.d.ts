export interface ICulqiToken {
  id: string;
  type: string;
  email: string;
  creation_date?: number;
  card_number?: string;
  last_four?: string;
  active?: boolean;
}

export interface ICulqiError {
  type: string;
  merchant_message: string;
  user_message: string;
  param?: string;
}

export interface ICulqiSettings {
  title: string;
  currency: 'PEN' | 'USD';
  amount: number;
  order?: string;
  x_culqi_order?: string;
}

export interface ICulqiClient {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface ICulqiPaymentMethods {
  tarjeta: boolean;
  yape: boolean;
  billetera: boolean;
  bancaMovil: boolean;
  agente: boolean;
  cuotealo: boolean;
}

export interface ICulqiOptions {
  lang: 'auto' | 'es' | 'en';
  installments: boolean;
  modal: boolean;
  paymentMethods: ICulqiPaymentMethods;
  paymentMethodsSort: string[];
  style?: {
    logo?: string;
    bannerColor?: string;
    buttonBackground?: string;
    menuColor?: string;
    linksColor?: string;
    buttonText?: string;
    buttonTextColor?: string;
    priceColor?: string;
  };
}

export interface CulqiCheckoutConfig {
  settings: ICulqiSettings;
  client?: ICulqiClient;
  options: ICulqiOptions;
}

export interface CulqiOrderResponse {
  id: string;
  object: string;
  amount: number;
  currency_code: string;
}

export interface ICulqiCheckoutInstance {
  open: () => void;
  close: () => void;
  culqi?: () => void;
  token?: ICulqiToken | null;
  order?: CulqiOrderResponse | null;
  error?: ICulqiError | null;
  closeEvent?: boolean | null;
}

export type CulqiCheckoutConstructor = new (
  publicKey: string,
  config: CulqiCheckoutConfig
) => ICulqiCheckoutInstance;

export interface ICulqiGlobalObject {
  publicKey?: string;
  token?: ICulqiToken | null;
  order?: CulqiOrderResponse | null;
  error?: ICulqiError | null;
  close?: () => void;
  closeEvent?: boolean | null;
  open: () => void;
  settings: (settings: ICulqiSettings) => void;
  options: (options: ICulqiOptions) => void;
}

declare global {
  interface Window {
    CulqiCheckout?: CulqiCheckoutConstructor;
    CulqiCheckout2?: CulqiCheckoutConstructor;
    Culqi?: ICulqiGlobalObject;
    CULQI_PUBLIC_KEY?: string;
    culqi?: () => void;
  }
}
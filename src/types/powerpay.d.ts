// File: frontend/types/powerpay.d.ts

import * as React from 'react';

type PowerpayCustomElementProps = React.HTMLAttributes<HTMLElement> & {
  'mo-client-id'?: string;
  'product-price'?: string | number;
};

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'mo-header': PowerpayCustomElementProps;
        'mo-banner': PowerpayCustomElementProps;
        'mo-product-page': PowerpayCustomElementProps;
        'mo-checkout': PowerpayCustomElementProps;
      }
    }
  }

  // Compatibilidad con versiones previas de JSX
  namespace JSX {
    interface IntrinsicElements {
      'mo-header': PowerpayCustomElementProps;
      'mo-banner': PowerpayCustomElementProps;
      'mo-product-page': PowerpayCustomElementProps;
      'mo-checkout': PowerpayCustomElementProps;
    }
  }
}

export {};
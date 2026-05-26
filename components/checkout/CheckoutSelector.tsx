'use client';

import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
// import { iniciarCheckoutMP } from '@/src/payments/mercadopago';

import { SiMercadopago } from 'react-icons/si';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import Image from 'next/image';

export default function CheckoutSelector() {
    const { cart } = useCartStore();
    const { shipping, profile } = useCheckoutStore();


    if (!cart || cart.length === 0) {
        return (
            <div className="flex flex-col items-center mt-6 gap-4">
                <p className="text-gray-400 text-sm">Tu carrito está vacío.</p>
            </div>
        );
    }

    if (!shipping || !profile) {
        return (
            <div className="flex flex-col items-center mt-6 gap-4">
                <p className="text-gray-400 text-sm">Completa tu información de envío y perfil antes de continuar.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 mt-8">

            <h3 className="text-sm text-gray-500">
                Elige tu método de pago
            </h3>

            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
                {/* MERCADO PAGO */}
                <button
                    // onClick={() => iniciarCheckoutMP(cart, shipping, profile)}
                    className="group w-full p-5 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 hover:ring-2 hover:ring-blue-100 transition-all duration-200 shadow-sm cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100">
                            <SiMercadopago size={24} className="text-[#009ee3]" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold text-gray-800">Pagar con MercadoPago</span>
                            <div className="flex items-center gap-3 mt-1">
                                <FaCcVisa size={28} className="text-blue-600" />
                                <FaCcMastercard size={28} className="text-red-600" />
                                <Image src="/yape.svg" alt="Yape" width={26} height={26} className="rounded-md" />
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}

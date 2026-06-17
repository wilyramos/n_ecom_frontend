"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end select-none">
            <Link
                href="https://wa.me/51902900653?text=Hola%21%20Estoy%20viendo%20su%20tienda%20y%20tengo%20una%20consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="
                    group flex items-center justify-start 
                    h-12 w-12 hover:w-36 
                    rounded-full p-3.5 gap-3
                    bg-[#25D366] text-white 
                    border border-[#128C7E]/20
                    shadow-[0_8px_30px_rgba(37,211,102,0.2)] 
                    hover:shadow-[0_8px_30px_rgba(18,140,126,0.4)]
                    hover:bg-[#128C7E]
                    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    overflow-hidden active:scale-95
                "
                aria-label="Contacto por WhatsApp"
            >
                <div className="flex items-center justify-center shrink-0">
                    <FaWhatsapp className="w-5 h-5 transition-transform duration-500 ease-out group-hover:rotate-12" />
                </div>
                
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out delay-100">
                    Asesoría
                </span>
            </Link>
        </div>
    );
}
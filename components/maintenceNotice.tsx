"use client";

import { MdBuild } from "react-icons/md";
import Link from "next/link";

export default function MaintenanceNotice({
    title = "Funcionalidad en mantenimiento",
    message = "Estamos mejorando esta sección para brindarte una mejor experiencia.",
    showHomeButton = true,
}) {



    // LISTA DE TODOS:

    // Clientes felices que confian en nosotros.
    // 

    return (
        <div className="flex flex-col items-center px-6 py-12">
            <div className="bg-gray-100 text-gray-500 p-4 rounded-full mb-6">
                <MdBuild className="text-2xl" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 max-w-xl mb-6">{message}</p>
            {showHomeButton && (
                <Link href="/" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors">
                    Volver al inicio
                </Link>
            )}
        </div>
    );
}

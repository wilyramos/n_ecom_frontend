// File: frontend/app/(store)/hc/libro-de-reclamaciones/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import ClaimForm from "@/components/claim/claimform";

export const metadata: Metadata = {
    title: "Libro de Reclamaciones | neoshop",
    description: "Formulario de Libro de Reclamaciones virtual de neoshop.",
};

export default function LibroReclamacionesPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <nav className="text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:underline">Home</Link>
                {" > "}
                <span>Libro de reclamaciones</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Libro de Reclamaciones
            </h1>

            <p className="text-gray-700 mb-8">
                Ponemos a su disposición el presente formulario, a través del cual podrá
                expresar su INSATISFACCIÓN O DISCONFORMIDAD RESPECTO DE LA ATENCIÓN RECIBIDA
                EN <strong>neoshop</strong> en el ejercicio de su función administrativa:
            </p>

            {/* Client Component: maneja useActionState internamente */}
            <ClaimForm />

            <div className="mt-12 text-sm text-gray-600 space-y-4 border-t pt-6">
                <p>
                    <strong>RECLAMO:</strong> Disconformidad relacionada con los productos o servicios.
                </p>
                <p>
                    <strong>QUEJA:</strong> Disconformidad no relacionada a los productos o servicios;
                    o, malestar o descontento respecto a la atención al público.
                </p>
                <p>
                    La formulación del reclamo no impide acudir a otras vías de solución de
                    controversias ni es requisito previo para interponer una denuncia ante INDECOPI.
                </p>
                <p>
                    El proveedor deberá dar respuesta al reclamo en un plazo no mayor a{" "}
                    <strong>quince (15) días hábiles</strong> improrrogables, conforme a la
                    normativa vigente de INDECOPI (Ley N° 31435).
                </p>
            </div>
        </div>
    );
}
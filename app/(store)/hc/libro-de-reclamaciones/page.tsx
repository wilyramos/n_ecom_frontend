// File: app/%28store%29/hc/libro-de-reclamaciones/page.tsx
import { Metadata } from "next";
import ClaimForm from "@/components/claim/ClaimForm";

export const metadata: Metadata = {
    title: "Libro de Reclamaciones Virtual",
    description:
        "Conforme a lo establecido en la Ley N.° 29571 - Código de Protección y Defensa del Consumidor y el D.S. N.° 011-2011-PCM, ponemos a su disposición nuestro Libro de Reclamaciones Virtual.",
};

export default function LibroReclamacionesPage() {
    return (
        <main className="container mx-auto max-w-4xl px-4 py-8">
            <header className="mb-8 border-b pb-4 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Libro de Reclamaciones Virtual
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                    Conforme a la Ley N.° 29571 – Código de Protección y Defensa
                    del Consumidor y al Reglamento del Libro de Reclamaciones
                    aprobado mediante D.S. N.° 011-2011-PCM.
                </p>

                <div className="mt-6 rounded-lg border bg-gray-50 p-4 text-left text-sm text-gray-700 space-y-3">
                    <p>
                        Este establecimiento cuenta con un Libro de
                        Reclamaciones Virtual a disposición de los consumidores,
                        donde podrá registrar sus reclamos o quejas respecto a
                        los productos o servicios ofrecidos.
                    </p>

                    <p>
                        <strong>Reclamo:</strong> Disconformidad relacionada con
                        los productos o servicios.
                    </p>

                    <p>
                        <strong>Queja:</strong> Disconformidad no relacionada a
                        los productos o servicios; o malestar respecto a la
                        atención al público.
                    </p>

                    <p>
                        La formulación del reclamo o queja no impide acudir a
                        otras vías de solución de controversias ni constituye
                        una denuncia ante el INDECOPI.
                    </p>

                    <p>
                        El proveedor deberá brindar respuesta al reclamo o
                        queja en un plazo máximo de quince (15) días hábiles,
                        improrrogables, conforme a la normativa vigente.
                    </p>

                    <p>
                        El tratamiento de los datos personales proporcionados se
                        realizará conforme a la Ley N.° 29733 – Ley de
                        Protección de Datos Personales.
                    </p>
                </div>
            </header>

            <ClaimForm />
        </main>
    );
}
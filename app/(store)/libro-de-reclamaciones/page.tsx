import { Metadata } from "next";
import ClaimForm from "@/components/claim/ClaimForm";

export const metadata: Metadata = {
    title: "Libro de Reclamaciones | neoshop",
    description: "Libro de Reclamaciones Virtual de neoshop conforme a la normativa vigente de INDECOPI.",
};

export default function LibroReclamacionesPage() {
    return (
        <main className="container mx-auto max-w-4xl px-4 py-12">
            {/* Cabecera Institucional */}
            <header className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                    Libro de Reclamaciones Virtual
                </h1>
                <div className="inline-block bg-blue-900 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
                    Atención al Consumidor - Conforme a Ley N.° 29571
                </div>
            </header>

            {/* Aviso Legal de Reclamo vs Queja */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Información importante antes de registrar:</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                        <strong className="text-blue-900 block mb-1">¿Qué es un Reclamo?</strong>
                        <p className="text-sm text-gray-600">Disconformidad relacionada directamente con los productos o servicios adquiridos en nuestra plataforma.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-500">
                        <strong className="text-yellow-700 block mb-1">¿Qué es una Queja?</strong>
                        <p className="text-sm text-gray-600">Malestar o disconformidad respecto a la atención al cliente, sin relación directa con el producto o servicio.</p>
                    </div>
                </div>

                <div className="text-sm text-gray-600 space-y-3 border-t pt-4">
                    <p>• La formulación del reclamo no impide acudir a otras vías de solución ni constituye una denuncia ante INDECOPI.</p>
                    <p>• <strong>Plazo de atención:</strong> Responderemos a su solicitud en un plazo máximo de <strong>quince (15) días hábiles</strong> improrrogables.</p>
                    <p>• Sus datos personales serán tratados conforme a nuestra Política de Privacidad y la Ley N.° 29733.</p>
                </div>
            </section>

            {/* Contenedor del Formulario */}
            <section className="bg-gray-50 rounded-xl p-6 md:p-10 border">
                <h3 className="text-xl font-bold mb-6">Complete el formulario a continuación:</h3>
                <ClaimForm />
            </section>
        </main>
    );
}
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Libro de Reclamaciones | neoshop",
    description: "Formulario de Libro de Reclamaciones virtual de neoshop.",
};

export default function LibroReclamacionesPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <nav className="text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:underline">
                    Home
                </Link>
                &gt; <span>Libro de reclamaciones</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">Libro de Reclamaciones</h1>

            <p className="text-gray-700 mb-8">
                Ponemos a su disposición el presente formulario, a través del cual podrá expresar su INSATISFACCIÓN O DISCONFORMIDAD RESPECTO DE LA ATENCIÓN RECIBIDA EN <strong>neoshop</strong> en el ejercicio de su función administrativa:
            </p>

            <form className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">1. Identificación del Consumidor</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellidos</label>
                            <input type="text" id="nombres" name="nombres" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
                            <select id="tipoDocumento" name="tipoDocumento" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Seleccione</option>
                                <option value="DNI">DNI</option>
                                <option value="CE">CE</option>
                                <option value="RUC">RUC</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-1">Numeración del documento</label>
                            <input type="text" id="numeroDocumento" name="numeroDocumento" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">Tu celular</label>
                            <input type="tel" id="celular" name="celular" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" name="email" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input type="text" id="direccion" name="direccion" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <input type="text" id="ciudad" name="ciudad" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Región/Provincia</label>
                            <input type="text" id="region" name="region" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">2. Detalle de la Reclamación y Pedido del Consumidor</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="block text-sm font-medium text-gray-700 mb-2">Tipo</span>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="tipoReclamo" value="Queja" required className="mr-2" />
                                    Queja
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="tipoReclamo" value="Reclamo" required className="mr-2" />
                                    Reclamo
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="fechaIncidencia" className="block text-sm font-medium text-gray-700 mb-1">Fecha de incidencia</label>
                            <input type="date" id="fechaIncidencia" name="fechaIncidencia" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="detalle" className="block text-sm font-medium text-gray-700 mb-1">Detalle</label>
                            <textarea id="detalle" name="detalle" rows={4} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="pedido" className="block text-sm font-medium text-gray-700 mb-1">Pedido (Qué solicita)</label>
                            <textarea id="pedido" name="pedido" rows={3} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm">
                    <strong>Observación:</strong> La respuesta a este reclamo o queja será enviada al correo electrónico indicado en este formulario.
                </div>

                <button type="submit" className="w-full md:w-auto bg-gray-900 text-white font-medium py-3 px-8 rounded-md hover:bg-gray-800 transition-colors">
                    Enviar
                </button>
            </form>

            <div className="mt-12 text-sm text-gray-600 space-y-4 border-t pt-6">
                <p>
                    <strong>RECLAMO:</strong> Disconformidad relacionada con los productos o servicios.
                </p>
                <p>
                    <strong>QUEJA:</strong> Disconformidad no relacionada a los productos o servicios; o, malestar o descontento respecto a la atención al público.
                </p>
                <p>
                    La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante INDECOPI.
                </p>
                <p>
                    El proveedor deberá dar respuesta al reclamo en un plazo no mayor a <strong>quince (15) días hábiles</strong> improrrogables, conforme a la normativa vigente de INDECOPI (Ley N° 31435).
                </p>
            </div>
        </div>
    );
}
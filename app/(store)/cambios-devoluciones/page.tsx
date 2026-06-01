import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Políticas de Cambios, Devoluciones y Garantías | neoshop",
    description: "Detalle completo de nuestra política de cambios, devoluciones y garantías para compras en neoshop.",
};

export default function CambiosDevolucionesPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 text-gray-800">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Políticas de Cambios y Devoluciones</h1>
            <p className="text-sm text-gray-500 mb-10">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

            <div className="space-y-8 text-gray-700">
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">1. Marco Normativo</h2>
                    <p>En <strong>neoshop</strong>, nuestras políticas cumplen con lo estipulado en la Ley N° 29571, Código de Protección y Defensa del Consumidor. Toda solicitud será atendida bajo los principios de buena fe y transparencia.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">2. Tipos de Solicitud</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Cambio por conveniencia:</strong> Derecho de arrepentimiento o cambio de opinión. Aplica dentro de los 7 días calendario.</li>
                        <li><strong>Garantía legal:</strong> Aplica por fallas de fábrica o defectos de origen dentro de los 30 días calendario.</li>
                        <li><strong>Error de despacho:</strong> Aplica cuando el producto recibido difiere del solicitado en la orden de compra.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">3. Requisitos Indispensables para la Devolución</h2>
                    <p className="mb-2 italic">Para procesar cualquier solicitud, el producto debe ser inspeccionado:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Estado físico:</strong> Sin señales de uso, maltrato, manchas, o daños cosméticos.</li>
                        <li><strong>Embalaje:</strong> El producto debe retornarse con todas las cajas, tecnopor, bolsas protectoras y etiquetas de fábrica.</li>
                        <li><strong>Accesorios:</strong> Debe incluir todos los manuales, cables, baterías, cargadores y periféricos originales.</li>
                        <li><strong>Documentación:</strong> Es obligatorio presentar el comprobante de pago electrónico (Boleta o Factura).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">4. Exclusiones y Limitaciones</h2>
                    <p>No se aceptarán devoluciones de los siguientes productos, salvo defecto de fábrica evidente:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Productos de higiene personal o contacto directo (auriculares in-ear, depiladoras, ropa interior).</li>
                        <li>Artículos personalizados o solicitados bajo configuración especial.</li>
                        <li>Software o productos digitales con licencias activadas.</li>
                        <li>Productos con empaques termo-sellados abiertos por el cliente (blister).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">5. Procedimiento de Gestión</h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li><strong>Reporte:</strong> Escribe a soporte@neoshop.com detallando el motivo y adjuntando fotos/videos del producto y el empaque.</li>
                        <li><strong>Validación:</strong> Nuestro equipo responderá en un plazo máximo de 3 días hábiles aprobando o denegando la recepción del producto para evaluación.</li>
                        <li><strong>Logística:</strong> Tras la aprobación, te enviaremos una guía de envío. <strong>Nota:</strong> Si el producto no llega a nuestro almacén en las condiciones acordadas, neoshop no se hace responsable por daños durante el transporte.</li>
                        <li><strong>Diagnóstico:</strong> Tras la recepción en almacén, contamos con 5 días hábiles para confirmar el estado del producto y emitir una resolución.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">6. Responsabilidad Logística (Costo de Retorno)</h2>
                    <table className="w-full border-collapse border border-gray-300 mt-3 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Motivo</th>
                                <th className="border p-2">Costo de Envío</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border p-2">Falla de fábrica / Error de neoshop</td>
                                <td className="border p-2">Asumido por neoshop</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Cambio de opinión / Error del cliente</td>
                                <td className="border p-2">Asumido por el cliente</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">7. Tiempos de Reembolso</h2>
                    <p>Los reembolsos se realizarán únicamente al titular de la compra. Si el pago fue realizado mediante pasarela (tarjeta), los tiempos de reversión dependen exclusivamente de la entidad bancaria del usuario y la pasarela de pagos, oscilando entre 15 a 30 días hábiles. Las transferencias directas serán procesadas en un máximo de 7 días hábiles.</p>
                </section>
            </div>
        </div>
    );
}
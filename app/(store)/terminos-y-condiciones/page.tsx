import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Términos y Condiciones | neoshop",
    description: "Términos, condiciones de venta, garantías y políticas de servicio de neoshop.",
};

export default function TerminosPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 text-gray-800">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Términos y Condiciones</h1>
            <p className="text-sm text-gray-500 mb-10">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

            {/* Secciones integradas */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-2">1. Marco Legal y Aceptación</h2>
                <p>Al realizar una compra en neoshop, usted acepta los presentes términos. Nuestra operación se ciñe a la Ley N° 29571 (Código de Protección y Defensa del Consumidor) y a las normas vigentes de comercio electrónico en el Perú.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-2">2. Validez de Precios y Promociones</h2>
                <p>Las ofertas y promociones tienen vigencia limitada. Los precios en la web pueden variar sin previo aviso debido a ajustes de mercado o actualizaciones de stock. En caso de error tipográfico evidente en el precio de un producto, neoshop se reserva el derecho de cancelar la orden y realizar la devolución total del pago.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-2">3. Proceso de Cambio y Garantía (Específico)</h2>
                <p>Todo cambio por garantía está sujeto a una evaluación técnica previa (máximo 48 horas hábiles). </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Condiciones físicas:</strong> El producto debe devolverse sin daños estéticos, con sus empaques, manuales y accesorios originales completos.</li>
                    <li><strong>Exclusiones:</strong> La garantía no cubre desgaste natural, daño por líquidos, golpes, mala manipulación, uso de software no autorizado o intervención por terceros.</li>
                    <li><strong>Baterías y Consumibles:</strong> Las baterías tienen una garantía reducida según lo estipulado por el fabricante (especificar duración si aplica).</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-2">4. Protección de Datos Personales</h2>
                <p>En cumplimiento con la Ley N° 29733, garantizamos que los datos recolectados (nombre, DNI, correo, dirección) serán usados únicamente para el procesamiento de pedidos, despacho y fines de marketing solo si el usuario aceptó explícitamente recibir comunicaciones. Sus datos nunca serán vendidos a terceros.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-2">5. Libro de Reclamaciones</h2>
                <p>Atendiendo a la normativa de INDECOPI, contamos con un Libro de Reclamaciones Virtual diseñado para resolver cualquier disconformidad en un plazo máximo de 15 días hábiles.</p>
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-600">
                    <Link href="/libro-de-reclamaciones" className="text-blue-700 font-bold hover:underline">
                        → Clic aquí para acceder al Libro de Reclamaciones oficial
                    </Link>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-2">6. Limitación de Responsabilidad</h2>
                <p>neoshop no se hace responsable por la pérdida de información personal almacenada en dispositivos si el Cliente no realizó una copia de seguridad antes de entregarlo para servicio técnico. Asimismo, no somos responsables por demoras logísticas causadas por factores de fuerza mayor o eventos externos (bloqueos, condiciones climáticas extremas).</p>
            </section>
        </div>
    );
}
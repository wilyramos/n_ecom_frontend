import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Políticas de Privacidad | neoshop importaciones",
    description: "Política de privacidad y protección de datos personales de neoshop importaciones, conforme a la Ley N° 29733.",
};

export default function PoliticasPrivacidadPage() {
    return (
        <section className="max-w-3xl mx-auto py-12 px-4 text-gray-800 leading-relaxed">
            <header className="mb-12 border-b pb-8">
                <h1 className="text-4xl font-bold text-black mb-4">Políticas de Privacidad</h1>
                <p className="text-gray-600">
                    Última actualización: 02 de junio de 2026. <br />
                    En <strong>neoshop importaciones</strong>, estamos comprometidos con la protección de tu información personal, garantizando el cumplimiento de la <strong>Ley N° 29733 (Ley de Protección de Datos Personales)</strong> y su Reglamento vigente en el Perú.
                </p>
            </header>

            <div className="space-y-8">
                <section>
                    <h2 className="text-lg font-bold mb-3">1. Información del Responsable del Tratamiento</h2>
                    <p className="text-sm">
                        Tus datos personales son gestionados por <strong>neoshop importaciones</strong>, con RUC N° <strong>20613242784</strong>, con domicilio legal en <strong>Pasaje Nicolás Alcázar 182, Pueblo Libre, Lima, Lima, Perú</strong>.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold mb-3">2. Información que recopilamos</h2>
                    <p className="text-sm mb-2">Para brindarte nuestros servicios, recolectamos:</p>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                        <li><strong>Datos identificativos:</strong> Nombres, apellidos, DNI o Carnet de Extranjería.</li>
                        <li><strong>Datos de contacto:</strong> Correo electrónico, teléfono móvil (922 049 463) y dirección exacta para el despacho de pedidos.</li>
                        <li><strong>Datos transaccionales:</strong> Historial de compras, preferencias de productos y detalles de pagos (procesados a través de pasarelas seguras).</li>
                        <li><strong>Datos de navegación:</strong> Información técnica capturada mediante cookies (dirección IP, navegador y comportamiento en nuestro sitio).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold mb-3">3. Finalidad del Tratamiento</h2>
                    <p className="text-sm">Utilizamos tu información exclusivamente para:</p>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>Procesar, gestionar y realizar el seguimiento de tus pedidos hasta su entrega final.</li>
                        <li>Atender tus consultas, solicitudes de soporte técnico y reclamos a través de nuestros canales oficiales.</li>
                        <li>Cumplir con las obligaciones legales contables y tributarias exigidas por la SUNAT.</li>
                        <li>Realizar actividades de marketing, envío de promociones o boletines informativos (solo previa obtención de tu consentimiento explícito).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold mb-3">4. Derechos ARCO</h2>
                    <p className="text-sm mb-2">
                        Como usuario, tienes el derecho de ejercer en cualquier momento tus derechos <strong>ARCO</strong> (Acceso, Rectificación, Cancelación y Oposición):
                    </p>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                        <li><strong>Acceso:</strong> Solicitar conocer qué datos personales tenemos registrados sobre ti.</li>
                        <li><strong>Rectificación:</strong> Solicitar la corrección o actualización de tus datos personales si están incompletos o son erróneos.</li>
                        <li><strong>Cancelación (Supresión):</strong> Solicitar la eliminación de tus datos personales de nuestra base de datos.</li>
                        <li><strong>Oposición:</strong> Oponerte al uso de tus datos para fines comerciales o de marketing.</li>
                    </ul>
                </section>

                <div className="bg-black text-white p-8 rounded-md">
                    <h2 className="text-xl font-bold mb-4">Seguridad y Transferencia</h2>
                    <p className="text-sm text-gray-300">
                        Implementamos medidas de seguridad técnicas, físicas y organizativas de nivel estándar para proteger tu información. Tus datos personales son tratados con absoluta confidencialidad y solo son compartidos con terceros en caso de ser estrictamente necesario para la logística (empresas de transporte) o el procesamiento de pagos. <strong>No vendemos ni alquilamos bases de datos a terceros.</strong>
                    </p>
                </div>
            </div>

            <footer className="mt-16 border-t pt-12 text-center">
                <h3 className="text-sm font-bold text-black mb-4">¿Deseas ejercer tus derechos ARCO?</h3>
                <p className="text-sm text-gray-600 mb-2">Nuestro horario de atención es de <strong>11:00 am a 8:00 pm</strong>.</p>
                <p className="text-sm text-gray-600 mb-6">Puedes escribirnos al correo: <strong>neoshopimportaciones@gmail.com</strong></p>
                <Link href="/hc/contacto-y-soporte" className="text-sm font-bold bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
                    Necesitas ayuda o quieres contactarnos directamente?
                </Link>
            </footer>
        </section>
    );
}
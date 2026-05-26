import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Términos y Condiciones y Políticas de Devolución | neoshop",
    description: "Términos y condiciones, políticas de compra, envíos, y cambios o devoluciones de neoshop.",
};

export default function TerminosPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Términos, Condiciones y Políticas de neoshop</h1>
            <p className="text-sm text-gray-500 mb-10">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">1. Información General y Aceptación</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        El presente documento establece los Términos y Condiciones que regulan el acceso, navegación y uso del sitio web y plataforma de comercio electrónico de <strong>neoshop</strong> (en adelante, la Plataforma).
                    </p>
                    <p>
                        Al acceder y realizar transacciones en la Plataforma, el usuario (en adelante, el Cliente) acepta en su totalidad y sin reservas los presentes Términos y Condiciones, así como nuestras Políticas de Privacidad y Políticas de Cambios y Devoluciones. Si el Cliente no está de acuerdo con estos términos, deberá abstenerse de utilizar la Plataforma.
                    </p>
                    <p>
                        Estos términos se rigen por la normativa vigente en la República del Perú, en particular la Ley N° 29571, Código de Protección y Defensa del Consumidor, y la Ley N° 29733, Ley de Protección de Datos Personales.
                    </p>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">2. Registro de Usuario y Seguridad</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        Las compras pueden realizarse como invitado o como usuario registrado. El Cliente es responsable de la veracidad de los datos proporcionados durante el registro o compra. 
                    </p>
                    <p>
                        neoshop se compromete a mantener la confidencialidad de la información personal de los usuarios, utilizando sistemas de seguridad y protocolos de encriptación (SSL) para proteger los datos durante el proceso de pago. No almacenamos datos de tarjetas de crédito o débito en nuestros servidores.
                    </p>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">3. Precios, Medios de Pago y Facturación</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        Todos los precios de los productos publicados en neoshop están expresados en Soles (PEN) e incluyen el Impuesto General a las Ventas (IGV). Los costos de envío no están incluidos en el precio del producto y serán calculados y mostrados antes de finalizar la compra.
                    </p>
                    <p>
                        Aceptamos pagos a través de pasarelas de pago certificadas que permiten transacciones con tarjetas de crédito, débito (Visa, Mastercard, American Express, Diners Club) y otros medios de pago electrónicos habilitados.
                    </p>
                    <p>
                        Toda transacción está sujeta a la validación de la pasarela de pago y de la entidad bancaria del Cliente. neoshop se reserva el derecho de anular transacciones que sean catalogadas como riesgosas o fraudulentas por nuestros sistemas de seguridad. Una vez procesado el pago, se emitirá el comprobante de pago electrónico (Boleta o Factura) al correo brindado por el Cliente.
                    </p>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">4. Despacho y Entrega de Productos</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        El despacho de los productos se realizará a la dirección indicada por el Cliente. Es responsabilidad exclusiva del Cliente garantizar que la dirección de entrega sea correcta y cuente con referencias claras.
                    </p>
                    <p>
                        Los plazos de entrega se contarán en días hábiles a partir de la confirmación del pago. Si no se encuentra a una persona mayor de edad en el domicilio para recibir el pedido, el transportista realizará un segundo intento. De fallar nuevamente, el producto retornará a nuestros almacenes y se coordinará un nuevo envío con un costo adicional a cargo del Cliente.
                    </p>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">5. Política de Cambios y/o Devoluciones</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        En neoshop garantizamos la satisfacción de nuestros Clientes. Si no estás conforme con tu producto, puedes solicitar un cambio o devolución cumpliendo los siguientes lineamientos:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Plazo:</strong> El Cliente tiene un plazo de hasta siete (7) días calendario contados desde la recepción del producto para solicitar un cambio o devolución sin expresión de causa (Derecho de Restitución), o hasta treinta (30) días por defectos de fábrica (Garantía).
                        </li>
                        <li>
                            <strong>Condiciones del Producto:</strong> El producto debe ser devuelto en perfectas condiciones, sin señales de uso, suciedad o desgaste. Debe incluir todos sus empaques originales, etiquetas adheridas, manuales y accesorios completos.
                        </li>
                        <li>
                            <strong>Excepciones:</strong> Por razones de higiene y salud, no se aceptan cambios ni devoluciones de ropa interior, trajes de baño, productos de cuidado personal, cosméticos, o productos personalizados/hechos a medida, salvo que presenten defectos de fábrica comprobables.
                        </li>
                        <li>
                            <strong>Procedimiento:</strong> Para iniciar el proceso, el Cliente debe contactarse con el área de Atención al Cliente presentando el comprobante de pago (Boleta/Factura) y su DNI. Tras la recepción y evaluación del producto en nuestros almacenes (Control de Calidad), se notificará la aprobación o rechazo de la solicitud.
                        </li>
                        <li>
                            <strong>Reembolsos:</strong> En caso de solicitar el reembolso del dinero, este se realizará utilizando el mismo medio de pago empleado en la compra original. Los tiempos de extorno o procesamiento dependen exclusivamente del banco emisor de la tarjeta y pueden demorar entre 15 a 30 días hábiles una vez aprobada la devolución.
                        </li>
                        <li>
                            <strong>Costos logísticos:</strong> Si la devolución es por desistimiento de compra, el costo de envío de retorno a nuestros almacenes será asumido por el Cliente. Si el cambio/devolución corresponde a un error de neoshop o defecto de fábrica, nosotros cubriremos los costos logísticos.
                        </li>
                    </ul>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">6. Libro de Reclamaciones</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        En estricto cumplimiento del Reglamento del Libro de Reclamaciones del Código de Protección y Defensa del Consumidor, neoshop pone a disposición de todos los Clientes un Libro de Reclamaciones virtual integrado nativamente en nuestra plataforma.
                    </p>
                    <p>
                        Los Clientes pueden registrar cualquier queja o reclamo respecto a nuestros productos o servicios accediendo de manera directa, sin ser redirigidos a formularios de terceros ni documentos externos. Responderemos a su solicitud en un plazo máximo de quince (15) días hábiles improrrogables, conforme a los lineamientos de INDECOPI.
                    </p>
                    <p>
                        <Link href="/libro-reclamaciones" className="text-blue-600 hover:underline font-medium">
                            Acceder al Libro de Reclamaciones Virtual aquí.
                        </Link>
                    </p>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">7. Propiedad Intelectual</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        Todos los contenidos de la Plataforma, incluyendo textos, gráficos, logotipos, imágenes, íconos, clips de audio, descargas digitales y compilaciones de datos, son propiedad exclusiva de neoshop o de sus proveedores, y se encuentran protegidos por las leyes de propiedad intelectual peruanas e internacionales. No se autoriza su reproducción, distribución o modificación sin consentimiento previo por escrito.
                    </p>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">8. Jurisdicción y Ley Aplicable</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        Los presentes Términos y Condiciones se rigen e interpretan de acuerdo con las leyes vigentes en la República del Perú. Cualquier controversia, discrepancia o reclamo derivado de la interpretación o cumplimiento de estos términos será sometida a la competencia de los Jueces y Tribunales del Distrito Judicial correspondiente según el domicilio del consumidor en el Perú.
                    </p>
                </div>
            </section>
        </div>
    );
}
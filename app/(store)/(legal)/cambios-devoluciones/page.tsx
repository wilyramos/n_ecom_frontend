import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Políticas de Cambios y Devoluciones | neoshop",
    description: "Conoce nuestra política de cambios, devoluciones y garantías en neoshop.",
};

export default function CambiosDevolucionesPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Políticas de Cambios y Devoluciones</h1>
            <p className="text-sm text-gray-500 mb-10">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

            <div className="space-y-10 text-gray-700">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">1. Consideraciones Generales</h2>
                    <div className="space-y-4">
                        <p>
                            En <strong>neoshop</strong> buscamos brindar la mejor experiencia de compra. Si el producto adquirido no cumple con tus expectativas o presenta algún defecto de fábrica, tienes el derecho de solicitar un cambio o devolución de tu dinero, sujeto a las condiciones detalladas en este documento.
                        </p>
                        <p>
                            Todo proceso de cambio o devolución está alineado con lo establecido en el Código de Protección y Defensa del Consumidor (Ley N° 29571).
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">2. Plazos para Solicitar un Cambio o Devolución</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Derecho de Restitución (Cambio de opinión):</strong> Puedes solicitar el cambio o devolución dentro de los primeros <strong>siete (7) días calendario</strong> contados a partir del día siguiente de la recepción del producto.</li>
                        <li><strong>Garantía (Fallas o defectos de fábrica):</strong> Tienes hasta <strong>treinta (30) días calendario</strong> desde la entrega para reportar un problema de calidad o defecto de fábrica.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">3. Condiciones del Producto</h2>
                    <p className="mb-4">Para que un cambio o devolución sea aprobado (excepto por fallas de fábrica comprobadas), el producto debe cumplir obligatoriamente con las siguientes condiciones:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>El producto no debe mostrar señales de uso, desgaste, lavado o suciedad.</li>
                        <li>Debe encontrarse en su empaque original, con todas sus etiquetas adheridas y sin alteraciones.</li>
                        <li>Debe incluir todos los manuales, accesorios y regalos promocionales (si los hubiera) que fueron entregados junto con el artículo.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">4. Productos no Sujetos a Cambios o Devoluciones</h2>
                    <p className="mb-4">Por motivos de higiene, salud y normativa legal, no aceptamos cambios ni devoluciones en las siguientes categorías, salvo que presenten defectos de origen:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Ropa interior, lencería y trajes de baño.</li>
                        <li>Productos de cuidado personal, cosméticos, maquillaje y perfumería que no cuenten con su sello de seguridad intacto.</li>
                        <li>Productos personalizados o fabricados a medida según las especificaciones del Cliente.</li>
                        <li>Software, licencias digitales o videojuegos que hayan sido abiertos o cuyos códigos hayan sido expuestos.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">5. Proceso de Solicitud</h2>
                    <p className="mb-4">Para iniciar una solicitud, sigue estos pasos:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Contacta a nuestro equipo de Atención al Cliente a través del correo <strong>soporte@neoshop.com</strong> o mediante nuestra plataforma en la sección de Ayuda.</li>
                        <li>Proporciona tu número de pedido, comprobante de pago (Boleta o Factura) y tu DNI.</li>
                        <li>Adjunta fotografías claras o videos del producto evidenciando su estado actual o el defecto reportado.</li>
                        <li>Una vez recibida la solicitud, evaluaremos el caso en un plazo máximo de <strong>tres (3) días hábiles</strong> y te indicaremos los pasos para el envío del producto a nuestros almacenes.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">6. Evaluación y Aprobación (Control de Calidad)</h2>
                    <div className="space-y-4">
                        <p>
                            Todo producto devuelto pasará por un proceso de inspección de Control de Calidad al ingresar a nuestros almacenes. Este proceso tomará hasta <strong>cinco (5) días hábiles</strong>.
                        </p>
                        <p>
                            Si el producto cumple con las políticas aquí descritas, se procederá con el cambio por un nuevo artículo o el reembolso del dinero, según la elección del Cliente. Si el producto no cumple con las condiciones, la solicitud será rechazada y el artículo será retornado al Cliente (los costos de envío de retorno serán asumidos por el Cliente).
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">7. Tiempos de Reembolso</h2>
                    <p className="mb-4">Si la devolución es aprobada y el Cliente opta por el reembolso del dinero:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Pagos con Tarjeta de Crédito/Débito:</strong> El extorno se realizará al mismo medio de pago. El tiempo para que el dinero se refleje en la cuenta depende exclusivamente de la entidad bancaria del Cliente y de la pasarela de pago, pudiendo demorar entre <strong>15 a 30 días hábiles</strong>.</li>
                        <li><strong>Transferencias Bancarias o Billeteras Digitales:</strong> El depósito se realizará a una cuenta bancaria a nombre del titular de la compra en un plazo máximo de <strong>siete (7) días hábiles</strong> tras la aprobación del Control de Calidad.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">8. Costos Logísticos</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Desistimiento de compra:</strong> Si el cambio o devolución es por cambio de opinión, error al elegir la talla o color, los costos de envío para retornar el producto a neoshop y para enviar el nuevo artículo serán asumidos en su totalidad por el Cliente.</li>
                        <li><strong>Garantía o Error de neoshop:</strong> Si el producto enviado tiene fallas de fábrica o no corresponde al pedido original, neoshop cubrirá todos los gastos logísticos incurridos en el proceso de retorno y reposición.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
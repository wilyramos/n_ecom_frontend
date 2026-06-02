// File: frontend/app/(store)/cambios-devoluciones/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Políticas de Cambios, Devoluciones y Garantías | neoshop importaciones",
    description:
        "Conoce de manera detallada la política de cambios, devoluciones y garantías de neoshop importaciones, conforme a la Ley N° 29571 – Código de Protección y Defensa del Consumidor del Perú.",
};

const LAST_UPDATED = "02/06/2025";

const BUSINESS = {
    name: "neoshop importaciones",
    ruc: "20613242784",
    direccion: "Psj. Nicolás Alcázar 182, Pueblo Libre",
    distrito: "Pueblo Libre",
    provincia: "Lima",
    departamento: "Lima",
    pais: "Perú",
    telefono: "922 049 463",
    email: "neoshopimportaciones@gmail.com",
    horario: "Lunes a Sábado de 11:00 a.m. a 8:00 p.m.",
};

export default function CambiosDevolucionesPage() {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-gray-800">
            {/* Encabezado */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
                Políticas de Cambios, Devoluciones y Garantías
            </h1>
            <p className="text-sm text-gray-500 mb-1">
                Última actualización: {LAST_UPDATED}
            </p>
            <p className="text-sm text-gray-500 mb-10">
                Vigente para todas las compras realizadas a través de{" "}
                <strong>neoshop importaciones</strong> — RUC {BUSINESS.ruc}
            </p>

            <div className="space-y-10 text-gray-700 leading-relaxed">

                {/* 1. Identificación del Proveedor */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        1. Identificación del Proveedor
                    </h2>
                    <p className="mb-3">
                        El presente documento regula las condiciones bajo las cuales{" "}
                        <strong>{BUSINESS.name}</strong> atiende las solicitudes de cambio,
                        devolución y garantía de los productos comercializados a través de su
                        tienda virtual. Los datos de identificación del proveedor son:
                    </p>
                    <ul className="list-none space-y-1 bg-gray-50 rounded-lg p-4 text-sm border border-gray-200">
                        <li><strong>Razón Social:</strong> {BUSINESS.name}</li>
                        <li><strong>RUC:</strong> {BUSINESS.ruc}</li>
                        <li>
                            <strong>Domicilio Fiscal:</strong> {BUSINESS.direccion},{" "}
                            {BUSINESS.distrito}, {BUSINESS.provincia},{" "}
                            {BUSINESS.departamento}, {BUSINESS.pais}
                        </li>
                        <li><strong>Teléfono / WhatsApp:</strong> {BUSINESS.telefono}</li>
                        <li>
                            <strong>Correo de Soporte:</strong>{" "}
                            <a
                                href={`mailto:${BUSINESS.email}`}
                                className="text-blue-600 underline"
                            >
                                {BUSINESS.email}
                            </a>
                        </li>
                        <li><strong>Horario de Atención:</strong> {BUSINESS.horario}</li>
                    </ul>
                </section>

                {/* 2. Marco Legal */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        2. Marco Legal Aplicable
                    </h2>
                    <p className="mb-3">
                        Las presentes políticas se rigen íntegramente por la legislación
                        peruana vigente en materia de protección al consumidor, en particular:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Ley N° 29571 – Código de Protección y Defensa del
                                Consumidor:</strong>{" "}
                            establece los derechos irrenunciables del consumidor, las
                            obligaciones del proveedor y los mecanismos de resolución de
                            controversias.
                        </li>
                        <li>
                            <strong>Artículo 49° – Derecho de Retracto:</strong> el consumidor
                            tiene derecho a retractarse de una compra dentro de los{" "}
                            <strong>7 días calendario</strong> siguientes a la recepción del
                            producto, sin necesidad de expresar causa alguna, siempre que el
                            bien no haya sido usado y se encuentre en perfectas condiciones.
                        </li>
                        <li>
                            <strong>Artículo 97° al 105° – Garantías:</strong> todo producto
                            comercializado cuenta con garantía legal mínima de{" "}
                            <strong>30 días calendario</strong> ante defectos de fabricación o
                            fallas de origen no imputables al consumidor.
                        </li>
                        <li>
                            <strong>Artículo 58° al 65° – Idoneidad del Producto:</strong> el
                            proveedor responde por la correspondencia entre lo ofertado y lo
                            entregado, incluyendo descripción, características técnicas y
                            condiciones de venta.
                        </li>
                        <li>
                            <strong>INDECOPI</strong> (Instituto Nacional de Defensa de la
                            Competencia y de la Protección de la Propiedad Intelectual) es la
                            autoridad administrativa competente para atender reclamos en caso
                            de controversia no resuelta por el proveedor.
                        </li>
                    </ul>
                </section>

                {/* 3. Tipos de Solicitud */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        3. Tipos de Solicitud Aceptados
                    </h2>
                    <p className="mb-4">
                        Reconocemos tres categorías de solicitud, cada una con plazos,
                        condiciones y responsabilidades diferenciadas:
                    </p>

                    <div className="space-y-5">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-bold text-base mb-1">
                                A) Cambio por Conveniencia (Derecho de Retracto / Arrepentimiento)
                            </h3>
                            <p>
                                El consumidor puede solicitar el cambio del producto sin necesidad
                                de alegar un defecto o falla, dentro de los{" "}
                                <strong>7 días calendario</strong> contados desde la fecha de
                                recepción del pedido. El producto debe encontrarse sin uso, con
                                todos sus accesorios y en su empaque original intacto. El costo
                                del envío de retorno es responsabilidad del cliente en este caso.
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-bold text-base mb-1">
                                B) Garantía Legal por Defecto de Fábrica
                            </h3>
                            <p>
                                Aplica cuando el producto presenta fallas de funcionamiento,
                                defectos de origen, piezas faltantes de fábrica o daños
                                estructurales no causados por el consumidor, dentro de los{" "}
                                <strong>30 días calendario</strong> desde la recepción. Ante este
                                supuesto, neoshop importaciones cubrirá los costos logísticos de
                                recojo y reenvío del producto. La resolución podrá consistir en
                                reparación, cambio por producto idéntico o reembolso, según
                                evaluación técnica y disponibilidad de stock.
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-bold text-base mb-1">
                                C) Error de Despacho (Producto Equivocado o Incompleto)
                            </h3>
                            <p>
                                Si el producto recibido no corresponde al detallado en la orden de
                                compra (modelo, color, talla, cantidad u otra característica
                                relevante), el consumidor debe reportarlo dentro de las{" "}
                                <strong>48 horas</strong> siguientes a la recepción, adjuntando
                                evidencia fotográfica o audiovisual. neoshop importaciones asumirá
                                íntegramente los costos de recojo y reenvío del producto correcto
                                en estos casos.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. Condiciones y Requisitos */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        4. Condiciones y Requisitos para Procesar la Solicitud
                    </h2>
                    <p className="mb-3">
                        Para que una solicitud de cambio o devolución sea admitida a
                        evaluación, el producto debe ser retornado cumpliendo con la totalidad
                        de los siguientes requisitos. El incumplimiento de cualquiera de ellos
                        faculta a neoshop importaciones a rechazar la solicitud:
                    </p>
                    <ul className="list-disc pl-5 space-y-3">
                        <li>
                            <strong>Estado del producto:</strong> Sin señales de uso, manipulación
                            indebida, suciedad, rayaduras, golpes, manchas ni daños cosméticos
                            posteriores a la recepción. El producto debe lucir exactamente en las
                            mismas condiciones en que fue entregado.
                        </li>
                        <li>
                            <strong>Embalaje original completo:</strong> Debe incluir la caja
                            original del fabricante, tecnopor, bolsas protectoras, plásticos de
                            seguridad, stickers y cualquier material de empaque original. El
                            embalaje no debe estar roto, doblado, mojado ni deteriorado.
                        </li>
                        <li>
                            <strong>Accesorios e insumos completos:</strong> Todos los elementos
                            que forman parte del contenido del producto deben ser retornados: cables,
                            cargadores, baterías, controles remotos, manuales de usuario,
                            certificados de garantía del fabricante, tarjetas de registro, fundas,
                            soportes y cualquier otro componente incluido en el embalaje original.
                        </li>
                        <li>
                            <strong>Comprobante de pago:</strong> Es indispensable presentar la
                            Boleta Electrónica o Factura Electrónica emitida por neoshop
                            importaciones al momento de la compra. Sin este documento, la
                            solicitud no podrá ser procesada bajo ninguna circunstancia.
                        </li>
                        <li>
                            <strong>Evidencia del problema (cuando aplique):</strong> Para
                            solicitudes por falla de fábrica o error de despacho, se requiere
                            adjuntar fotografías claras y/o video mostrando el defecto o la
                            discrepancia, al momento del primer contacto por correo electrónico.
                        </li>
                        <li>
                            <strong>Número de orden de compra:</strong> Debe indicarse el número
                            de pedido o referencia de la transacción para facilitar la
                            trazabilidad del proceso.
                        </li>
                    </ul>
                </section>

                {/* 5. Exclusiones */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        5. Productos y Situaciones Excluidos de la Política
                    </h2>
                    <p className="mb-3">
                        No se aceptarán devoluciones ni cambios en los siguientes casos,
                        salvo que medie un defecto de fabricación debidamente comprobado:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            Productos de higiene personal o de contacto íntimo: auriculares
                            in-ear o intrauriculares, depiladoras, máquinas de afeitar, ropa
                            interior, almohadas, entre otros.
                        </li>
                        <li>
                            Artículos personalizados, fabricados o importados bajo pedido especial
                            o configuración a medida del cliente.
                        </li>
                        <li>
                            Software, licencias digitales, códigos de activación o productos
                            intangibles cuya licencia haya sido activada o descargada.
                        </li>
                        <li>
                            Productos con empaque termo-sellado (blister) abierto por el cliente,
                            salvo defecto de fábrica evidente desde el exterior.
                        </li>
                        <li>
                            Artículos que hayan sido reparados, modificados o intervenidos por
                            terceros ajenos a neoshop importaciones o a un centro técnico autorizado.
                        </li>
                        <li>
                            Productos con daños ocasionados por mal uso, descuidos, humedad,
                            caídas, cortocircuito, uso de voltaje incorrecto o condiciones
                            ambientales adversas no contempladas en el manual del fabricante.
                        </li>
                        <li>
                            Solicitudes presentadas fuera de los plazos establecidos en la
                            sección 3 de este documento.
                        </li>
                    </ul>
                </section>

                {/* 6. Procedimiento */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        6. Procedimiento de Gestión Paso a Paso
                    </h2>
                    <p className="mb-4">
                        Todo el proceso se gestiona de manera remota. No es necesario
                        acercarse a nuestras instalaciones. Los pasos son los siguientes:
                    </p>
                    <ol className="list-decimal pl-5 space-y-4">
                        <li>
                            <strong>Paso 1 — Reporte Inicial:</strong> El consumidor debe
                            enviar un correo a{" "}
                            <a
                                href={`mailto:${BUSINESS.email}`}
                                className="text-blue-600 underline"
                            >
                                {BUSINESS.email}
                            </a>{" "}
                            o comunicarse al{" "}
                            <strong>{BUSINESS.telefono}</strong> (WhatsApp disponible en
                            horario de atención). El mensaje debe incluir: número de orden,
                            nombre del producto, motivo de la solicitud y evidencia fotográfica
                            o en video del producto y su embalaje.
                        </li>
                        <li>
                            <strong>Paso 2 — Evaluación Preliminar:</strong> Nuestro equipo de
                            soporte revisará la información enviada y responderá en un plazo
                            máximo de <strong>3 días hábiles</strong>, informando si la
                            solicitud es aprobada para continuar al siguiente paso o si es
                            denegada con justificación. Los días hábiles se computan de lunes a
                            sábado, excluyendo feriados nacionales.
                        </li>
                        <li>
                            <strong>Paso 3 — Coordinación Logística:</strong> Una vez aprobada
                            la solicitud, se coordinará con el cliente la forma de retorno del
                            producto. Según corresponda (ver sección 7), se enviará una guía de
                            courier prepagada o se indicará al cliente el monto y la empresa de
                            envío a utilizar. El producto debe ser embalado adecuadamente para
                            protegerlo durante el transporte: neoshop importaciones no se
                            responsabiliza por daños ocurridos durante el envío de retorno
                            cuando el embalaje sea negligente por parte del cliente.
                        </li>
                        <li>
                            <strong>Paso 4 — Recepción y Diagnóstico Técnico:</strong> Una vez
                            recibido el producto en nuestro almacén ubicado en{" "}
                            {BUSINESS.direccion}, se procederá a su revisión técnica y física.
                            Contamos con un plazo de <strong>5 días hábiles</strong> a partir
                            de la fecha de recepción para emitir una resolución definitiva al
                            cliente.
                        </li>
                        <li>
                            <strong>Paso 5 — Resolución:</strong> Dependiendo del resultado del
                            diagnóstico, se notificará al cliente la resolución adoptada, que
                            podrá consistir en: cambio del producto, reparación sin costo,
                            emisión de nota de crédito o reembolso total o parcial, según lo
                            que corresponda conforme a ley y a las condiciones del presente
                            documento.
                        </li>
                    </ol>
                </section>

                {/* 7. Responsabilidad Logística */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        7. Responsabilidad Logística y Costos de Envío de Retorno
                    </h2>
                    <p className="mb-3">
                        La responsabilidad sobre los costos de envío de retorno del producto
                        se determina según el motivo de la solicitud:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm mt-2">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-3 text-left">
                                        Motivo de la Solicitud
                                    </th>
                                    <th className="border border-gray-300 p-3 text-left">
                                        Costo de Envío de Retorno
                                    </th>
                                    <th className="border border-gray-300 p-3 text-left">
                                        Costo de Reenvío al Cliente
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 p-3">
                                        Falla de fábrica / Defecto de origen
                                    </td>
                                    <td className="border border-gray-300 p-3 text-green-700 font-medium">
                                        Asumido por neoshop
                                    </td>
                                    <td className="border border-gray-300 p-3 text-green-700 font-medium">
                                        Asumido por neoshop
                                    </td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 p-3">
                                        Error de despacho (equivocación de neoshop)
                                    </td>
                                    <td className="border border-gray-300 p-3 text-green-700 font-medium">
                                        Asumido por neoshop
                                    </td>
                                    <td className="border border-gray-300 p-3 text-green-700 font-medium">
                                        Asumido por neoshop
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-3">
                                        Cambio de opinión / Arrepentimiento del cliente
                                    </td>
                                    <td className="border border-gray-300 p-3 text-red-700 font-medium">
                                        Asumido por el cliente
                                    </td>
                                    <td className="border border-gray-300 p-3 text-red-700 font-medium">
                                        Asumido por el cliente
                                    </td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 p-3">
                                        Daño causado por mal uso del cliente
                                    </td>
                                    <td className="border border-gray-300 p-3 text-red-700 font-medium">
                                        Asumido por el cliente
                                    </td>
                                    <td className="border border-gray-300 p-3 text-red-700 font-medium">
                                        Asumido por el cliente
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        * Los envíos de retorno serán gestionados a través de la empresa de
                        courier que neoshop importaciones designe para cada caso. No se
                        aceptan envíos contra entrega (COD) sin autorización previa.
                    </p>
                </section>

                {/* 8. Tiempos de Reembolso */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        8. Tiempos y Modalidades de Reembolso
                    </h2>
                    <p className="mb-3">
                        Los reembolsos se procesarán exclusivamente a favor del titular de la
                        compra y al mismo medio de pago utilizado originalmente, salvo
                        acuerdo expreso en contrario. Los plazos estimados son los siguientes:
                    </p>
                    <ul className="list-disc pl-5 space-y-3">
                        <li>
                            <strong>Pago con tarjeta de crédito o débito (pasarela de pagos):</strong>{" "}
                            El reembolso se gestiona mediante la reversión de cargo ante la
                            pasarela de pagos y la entidad bancaria emisora. Este proceso escapa
                            al control de neoshop importaciones y puede demorar entre{" "}
                            <strong>15 a 30 días hábiles</strong> según las políticas internas de
                            cada banco. Neoshop iniciará el trámite dentro de los 2 días hábiles
                            posteriores a la resolución favorable.
                        </li>
                        <li>
                            <strong>Pago por transferencia bancaria o depósito:</strong> El
                            reembolso se realizará mediante transferencia a la cuenta del titular
                            en un plazo máximo de <strong>7 días hábiles</strong> desde la
                            resolución. El cliente deberá proporcionar sus datos bancarios
                            (nombre completo, banco, número de cuenta y CCI) al momento de
                            solicitar el reembolso.
                        </li>
                        <li>
                            <strong>Pago por billeteras digitales (Yape, Plin u otras):</strong>{" "}
                            El reembolso se efectuará al número de celular registrado en la
                            billetera digital del titular en un plazo máximo de{" "}
                            <strong>3 días hábiles</strong> desde la resolución.
                        </li>
                    </ul>
                    <p className="mt-3 text-sm text-gray-600 italic">
                        Nota: En ningún caso se realizarán reembolsos en efectivo ni a cuentas
                        de terceros distintos al titular de la compra.
                    </p>
                </section>

                {/* 9. Libro de Reclamaciones */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        9. Libro de Reclamaciones Virtual
                    </h2>
                    <p className="mb-3">
                        Conforme a lo establecido en el Decreto Supremo N° 011-2011-PCM y sus
                        modificatorias, <strong>neoshop importaciones</strong> pone a
                        disposición del consumidor su{" "}
                        <strong>Libro de Reclamaciones Virtual</strong>. Todo consumidor tiene
                        derecho a registrar su queja o reclamo, el cual será atendido en un
                        plazo no mayor de <strong>30 días hábiles</strong>.
                    </p>
                    <p className="mb-3">
                        Para presentar un reclamo formal, el consumidor puede:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            Enviar un correo a{" "}
                            <a
                                href={`mailto:${BUSINESS.email}`}
                                className="text-blue-600 underline"
                            >
                                {BUSINESS.email}
                            </a>{" "}
                            indicando en el asunto: <em>RECLAMO – [N° de orden]</em>.
                        </li>
                        <li>
                            Acercarse al domicilio fiscal: {BUSINESS.direccion},{" "}
                            {BUSINESS.distrito}, {BUSINESS.provincia}, en el horario de
                            atención indicado.
                        </li>
                    </ul>
                    <p className="mt-3 text-sm">
                        Si la controversia no es resuelta satisfactoriamente, el consumidor
                        puede acudir al{" "}
                        <strong>
                            INDECOPI – Servicio de Atención al Ciudadano
                        </strong>{" "}
                        a través del portal{" "}
                        <a
                            href="https://www.indecopi.gob.pe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            www.indecopi.gob.pe
                        </a>{" "}
                        o llamando al <strong>224-7777</strong> desde Lima, o al{" "}
                        <strong>0-800-4-4040</strong> desde provincias (llamada gratuita).
                    </p>
                </section>

                {/* 10. Modificaciones */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        10. Modificaciones a esta Política
                    </h2>
                    <p>
                        <strong>neoshop importaciones</strong> se reserva el derecho de
                        actualizar, modificar o ampliar la presente política en cualquier
                        momento, conforme a cambios en la normativa peruana o en las
                        condiciones operativas del negocio. Cualquier modificación será
                        publicada en esta misma página con la fecha de actualización
                        correspondiente. Se recomienda al consumidor revisar periódicamente
                        este documento antes de realizar una compra.
                    </p>
                </section>

                {/* 11. Contacto */}
                <section className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h2 className="text-xl font-bold mb-3">
                        ¿Tienes alguna consulta o necesitas iniciar un proceso?
                    </h2>
                    <p className="mb-3 text-sm">
                        Nuestro equipo de soporte está disponible para orientarte en cada paso:
                    </p>
                    <ul className="text-sm space-y-1">
                        <li>
                            📧 <strong>Correo:</strong>{" "}
                            <a
                                href={`mailto:${BUSINESS.email}`}
                                className="text-blue-600 underline"
                            >
                                {BUSINESS.email}
                            </a>
                        </li>
                        <li>
                            📱 <strong>WhatsApp / Teléfono:</strong> {BUSINESS.telefono}
                        </li>
                        <li>
                            🕐 <strong>Horario de Atención:</strong> {BUSINESS.horario}
                        </li>
                    </ul>
                </section>

            </div>
        </div>
    );
}
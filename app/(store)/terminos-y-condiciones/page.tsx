// File: frontend/app/(store)/terminos-y-condiciones/page.tsx

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Términos y Condiciones de Uso y Venta | neoshop importaciones",
    description:
        "Términos y condiciones generales de uso de la plataforma y de venta de productos de neoshop importaciones, conforme a la legislación peruana vigente.",
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

export default function TerminosPage() {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-gray-800">
            {/* Encabezado */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
                Términos y Condiciones Generales
            </h1>
            <p className="text-sm text-gray-500 mb-1">
                Última actualización: {LAST_UPDATED}
            </p>
            <p className="text-sm text-gray-500 mb-10">
                Aplicables a todas las transacciones realizadas a través de{" "}
                <strong>{BUSINESS.name}</strong> — RUC {BUSINESS.ruc}
            </p>

            <div className="space-y-10 text-gray-700 leading-relaxed">

                {/* 1. Identificación */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        1. Identificación del Proveedor
                    </h2>
                    <p className="mb-3">
                        El titular de la presente plataforma de comercio electrónico es:
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
                            <strong>Correo de Contacto:</strong>{" "}
                            <a href={`mailto:${BUSINESS.email}`} className="text-blue-600 underline">
                                {BUSINESS.email}
                            </a>
                        </li>
                        <li><strong>Horario de Atención:</strong> {BUSINESS.horario}</li>
                    </ul>
                </section>

                {/* 2. Marco Legal y Aceptación */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        2. Marco Legal y Aceptación de los Términos
                    </h2>
                    <p className="mb-3">
                        Al acceder, navegar o realizar una compra a través de la plataforma de{" "}
                        <strong>{BUSINESS.name}</strong>, el usuario declara haber leído,
                        comprendido y aceptado de forma expresa e irrevocable los presentes
                        Términos y Condiciones en su totalidad. Si el usuario no está de acuerdo
                        con alguna de las disposiciones aquí contenidas, deberá abstenerse de
                        utilizar la plataforma o realizar transacciones.
                    </p>
                    <p className="mb-3">
                        La presente relación comercial se rige por la legislación peruana vigente,
                        incluyendo pero no limitándose a:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Ley N° 29571 – Código de Protección y Defensa del Consumidor:</strong>{" "}
                            que establece los derechos del consumidor, las obligaciones del proveedor
                            y los principios de idoneidad, información y no discriminación.
                        </li>
                        <li>
                            <strong>Ley N° 29733 – Ley de Protección de Datos Personales</strong> y su
                            Reglamento aprobado por D.S. N° 003-2013-JUS: que regula el tratamiento,
                            almacenamiento y uso de información personal de los usuarios.
                        </li>
                        <li>
                            <strong>Ley N° 27291 – Ley que modifica el Código Civil sobre
                                manifestación de voluntad mediante medios electrónicos:</strong>{" "}
                            que valida los contratos celebrados de forma digital.
                        </li>
                        <li>
                            <strong>Ley N° 27269 – Ley de Firmas y Certificados Digitales</strong> y
                            sus normas complementarias.
                        </li>
                        <li>
                            <strong>D.S. N° 011-2011-PCM</strong> y modificatorias, que regula el
                            Libro de Reclamaciones para proveedores de bienes y servicios en el Perú.
                        </li>
                    </ul>
                    <p className="mt-3">
                        La aceptación de los presentes términos constituye un contrato vinculante
                        entre el usuario y <strong>{BUSINESS.name}</strong> en los términos del
                        artículo 1352° y siguientes del Código Civil peruano.
                    </p>
                </section>

                {/* 3. Capacidad Legal */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        3. Capacidad Legal para Contratar
                    </h2>
                    <p className="mb-3">
                        Para realizar compras en <strong>{BUSINESS.name}</strong>, el usuario
                        debe ser una persona natural o jurídica con plena capacidad legal para
                        contratar conforme al ordenamiento jurídico peruano. Se entiende que
                        cuentan con esta capacidad las personas mayores de 18 años que no se
                        encuentren incursas en ninguna causal de incapacidad prevista en el
                        Código Civil.
                    </p>
                    <p>
                        Los menores de edad solo podrán realizar compras con la supervisión,
                        autorización y responsabilidad expresa de sus padres o representantes
                        legales. Al completar el proceso de compra, el usuario declara bajo su
                        propia responsabilidad contar con la capacidad legal requerida.
                    </p>
                </section>

                {/* 4. Registro y Cuenta de Usuario */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        4. Registro y Cuenta de Usuario
                    </h2>
                    <p className="mb-3">
                        Para acceder a determinadas funcionalidades de la plataforma (historial de
                        pedidos, seguimiento, lista de deseos), el usuario podrá crear una cuenta
                        personal. Al registrarse, el usuario se obliga a:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            Proporcionar información veraz, actualizada y completa (nombre completo,
                            documento de identidad, correo electrónico, número de teléfono y
                            dirección de entrega válida).
                        </li>
                        <li>
                            Mantener la confidencialidad de sus credenciales de acceso (correo y
                            contraseña). Cualquier actividad realizada desde su cuenta es
                            responsabilidad exclusiva del usuario registrado.
                        </li>
                        <li>
                            Notificar de forma inmediata a <strong>{BUSINESS.name}</strong> ante
                            cualquier uso no autorizado de su cuenta o vulneración de su seguridad.
                        </li>
                        <li>
                            Actualizar sus datos de contacto cuando estos cambien, a fin de garantizar
                            la correcta entrega de pedidos y comunicaciones.
                        </li>
                    </ul>
                    <p className="mt-3">
                        <strong>{BUSINESS.name}</strong> se reserva el derecho de suspender o
                        eliminar cuentas que presenten información falsa, actividad fraudulenta,
                        intentos de manipulación del sistema de precios o comportamientos que
                        atenten contra la seguridad de la plataforma o de otros usuarios.
                    </p>
                </section>

                {/* 5. Proceso de Compra y Validez del Pedido */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        5. Proceso de Compra y Validez del Pedido
                    </h2>
                    <p className="mb-3">
                        El proceso de compra en la plataforma sigue las siguientes etapas, cada una
                        con sus implicancias legales:
                    </p>
                    <ol className="list-decimal pl-5 space-y-3">
                        <li>
                            <strong>Selección del producto:</strong> El usuario elige el artículo
                            deseado y lo añade al carrito. La inclusión en el carrito no constituye
                            reserva ni compromiso de compra.
                        </li>
                        <li>
                            <strong>Confirmación del pedido:</strong> Al finalizar el proceso de
                            pago, el usuario realiza una oferta de compra en los términos mostrados
                            en pantalla (precio, descripción y condiciones).
                        </li>
                        <li>
                            <strong>Aceptación por parte de neoshop:</strong> El contrato de
                            compraventa queda perfeccionado únicamente cuando{" "}
                            <strong>{BUSINESS.name}</strong> envía la confirmación del pedido y
                            el comprobante de pago electrónico (Boleta o Factura) al correo
                            registrado por el usuario.
                        </li>
                        <li>
                            <strong>Aclaración sobre stock:</strong> La disponibilidad mostrada en
                            la plataforma es referencial y puede variar. En caso de que un producto
                            confirmado no esté disponible, {BUSINESS.name} se comunicará con el
                            cliente para ofrecer una alternativa equivalente o realizar el reembolso
                            íntegro del pago en los plazos establecidos.
                        </li>
                    </ol>
                </section>

                {/* 6. Precios, Promociones y Errores Tipográficos */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        6. Precios, Promociones y Errores Tipográficos
                    </h2>
                    <p className="mb-3">
                        Todos los precios publicados en la plataforma están expresados en{" "}
                        <strong>Soles peruanos (PEN – S/)</strong> e incluyen el Impuesto General
                        a las Ventas (IGV) vigente, salvo que se indique expresamente lo contrario.
                        Los precios no incluyen los costos de envío, los cuales se detallarán de
                        manera transparente durante el proceso de pago.
                    </p>
                    <p className="mb-3">
                        Las promociones y descuentos publicados tienen una vigencia limitada y
                        están sujetos a disponibilidad de stock. <strong>{BUSINESS.name}</strong>{" "}
                        se reserva el derecho de modificar los precios en cualquier momento sin
                        previo aviso, sin que ello afecte los pedidos ya confirmados y pagados.
                    </p>
                    <p>
                        En caso de que un precio publicado contenga un error tipográfico evidente
                        (por ejemplo, un precio manifiestamente inferior al de mercado),{" "}
                        <strong>{BUSINESS.name}</strong> notificará al usuario la situación y
                        podrá cancelar el pedido, realizando el reembolso íntegro del monto
                        abonado dentro de los plazos establecidos. El usuario no tendrá derecho
                        a exigir el cumplimiento del contrato a un precio erróneo.
                    </p>
                </section>

                {/* 7. Medios de Pago */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        7. Medios de Pago Aceptados
                    </h2>
                    <p className="mb-3">
                        <strong>{BUSINESS.name}</strong> acepta los siguientes medios de pago,
                        todos procesados de forma segura:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Tarjetas de crédito y débito:</strong> Visa, Mastercard y otras
                            redes habilitadas por la pasarela de pagos, con verificación de
                            seguridad 3D Secure.
                        </li>
                        <li>
                            <strong>Transferencia bancaria o depósito:</strong> a las cuentas
                            informadas al momento del pedido. El pedido se procesará una vez
                            verificada la acreditación del pago.
                        </li>
                        <li>
                            <strong>Billeteras digitales:</strong> Yape, Plin y otros medios
                            habilitados según disponibilidad operativa.
                        </li>
                    </ul>
                    <p className="mt-3">
                        <strong>{BUSINESS.name}</strong> no almacena datos de tarjetas bancarias
                        ni información financiera sensible. Toda la información de pago es
                        procesada directamente por las pasarelas de pago certificadas, bajo sus
                        propios estándares de seguridad (PCI-DSS). El usuario es responsable de
                        verificar que los datos ingresados sean correctos al momento del pago.
                    </p>
                </section>

                {/* 8. Entrega y Plazos de Despacho */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        8. Entrega y Plazos de Despacho
                    </h2>
                    <p className="mb-3">
                        Los plazos de entrega son estimados y pueden variar según la ubicación
                        del destinatario, la disponibilidad del producto y la empresa de courier
                        asignada. Los plazos referenciales son:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Lima Metropolitana:</strong> entre 1 y 3 días hábiles desde la
                            confirmación del pago.
                        </li>
                        <li>
                            <strong>Provincias:</strong> entre 3 y 7 días hábiles según la
                            cobertura de la empresa de courier en el destino.
                        </li>
                    </ul>
                    <p className="mt-3 mb-3">
                        El usuario deberá asegurarse de proporcionar una dirección de entrega
                        completa, correcta y accesible. <strong>{BUSINESS.name}</strong> no se
                        hace responsable por demoras o extravíos ocasionados por datos de envío
                        incorrectos o incompletos suministrados por el cliente.
                    </p>
                    <p>
                        En caso de que el pedido sufra demoras significativas por causas
                        atribuibles a <strong>{BUSINESS.name}</strong>, se informará al cliente
                        oportunamente y se ofrecerán las alternativas correspondientes. Los
                        retrasos causados por fenómenos de fuerza mayor (desastres naturales,
                        huelgas, bloqueos de vías, entre otros) no generan responsabilidad para{" "}
                        <strong>{BUSINESS.name}</strong>.
                    </p>
                </section>

                {/* 9. Garantías */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        9. Garantías de los Productos
                    </h2>
                    <p className="mb-3">
                        Todos los productos comercializados por <strong>{BUSINESS.name}</strong>{" "}
                        cuentan con la garantía legal mínima de <strong>30 días calendario</strong>{" "}
                        ante defectos de fabricación o fallas de origen, conforme al artículo 97°
                        del Código de Protección y Defensa del Consumidor.
                    </p>
                    <p className="mb-3">
                        Adicionalmente, algunos productos pueden contar con garantía extendida del
                        fabricante, cuyas condiciones serán indicadas en la ficha del producto y
                        en los documentos físicos incluidos en el empaque.
                    </p>
                    <p className="mb-3 font-medium">La garantía no cubre los siguientes supuestos:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Desgaste natural por uso regular del producto.</li>
                        <li>
                            Daños ocasionados por golpes, caídas, humedad, contacto con líquidos,
                            cortocircuito o uso de voltaje incorrecto.
                        </li>
                        <li>
                            Manipulación, reparación o modificación por parte de terceros no
                            autorizados por el fabricante o por <strong>{BUSINESS.name}</strong>.
                        </li>
                        <li>
                            Uso de software no autorizado, jailbreak, root u otras intervenciones
                            que alteren el sistema original del dispositivo.
                        </li>
                        <li>
                            Daños estéticos (rayaduras, abolladuras, roturas de pantalla) no
                            presentes al momento de la entrega.
                        </li>
                        <li>
                            <strong>Baterías y consumibles:</strong> las baterías recargables están
                            sujetas a una garantía reducida conforme a las especificaciones del
                            fabricante, dado que su degradación es un proceso natural inherente al
                            uso. Se recomienda verificar las condiciones específicas en la ficha
                            técnica de cada producto.
                        </li>
                    </ul>
                    <p className="mt-3">
                        Para mayor detalle sobre el procedimiento de solicitud de garantía, el
                        usuario debe revisar nuestra{" "}
                        <Link href="/cambios-devoluciones" className="text-blue-600 underline hover:text-blue-800">
                            Política de Cambios y Devoluciones
                        </Link>
                        .
                    </p>
                </section>

                {/* 10. Protección de Datos Personales */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        10. Protección de Datos Personales
                    </h2>
                    <p className="mb-3">
                        En cumplimiento de la <strong>Ley N° 29733 – Ley de Protección de Datos
                            Personales</strong> y su Reglamento (D.S. N° 003-2013-JUS),{" "}
                        <strong>{BUSINESS.name}</strong> informa que los datos personales
                        recopilados durante el proceso de compra (nombre completo, DNI/RUC,
                        dirección, correo electrónico y número de teléfono) serán incorporados a
                        un banco de datos de titularidad del proveedor y tratados con las
                        siguientes finalidades:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Procesamiento, validación y despacho de pedidos.</li>
                        <li>
                            Emisión de comprobantes de pago electrónicos (Boleta o Factura) ante
                            la SUNAT.
                        </li>
                        <li>Comunicaciones relacionadas con el estado del pedido.</li>
                        <li>
                            Atención de solicitudes de cambio, devolución, garantía o reclamos.
                        </li>
                        <li>
                            Envío de comunicaciones de marketing, promociones y novedades,{" "}
                            <strong>únicamente si el usuario otorgó su consentimiento expreso</strong>{" "}
                            al momento del registro o compra.
                        </li>
                    </ul>
                    <p className="mt-3 mb-3">
                        <strong>{BUSINESS.name}</strong> garantiza que los datos personales de sus
                        clientes <strong>nunca serán vendidos, cedidos ni transferidos a terceros</strong>{" "}
                        con fines comerciales, salvo obligación legal expresa o requerimiento de
                        autoridad competente.
                    </p>
                    <p>
                        El usuario tiene derecho a ejercer los derechos de acceso, rectificación,
                        cancelación y oposición (derechos ARCO) sobre sus datos personales,
                        enviando una solicitud escrita al correo{" "}
                        <a href={`mailto:${BUSINESS.email}`} className="text-blue-600 underline">
                            {BUSINESS.email}
                        </a>
                        . La solicitud será atendida en un plazo máximo de 20 días hábiles.
                    </p>
                </section>

                {/* 11. Propiedad Intelectual */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        11. Propiedad Intelectual
                    </h2>
                    <p className="mb-3">
                        Todos los contenidos publicados en la plataforma de{" "}
                        <strong>{BUSINESS.name}</strong> — incluyendo, sin limitación, textos,
                        descripciones de productos, fotografías, logotipos, diseños, estructura
                        visual y elementos gráficos — son propiedad exclusiva de{" "}
                        <strong>{BUSINESS.name}</strong> o de sus respectivos titulares, y se
                        encuentran protegidos por las leyes de derechos de autor y propiedad
                        intelectual aplicables en el Perú y en el ámbito internacional.
                    </p>
                    <p>
                        Queda expresamente prohibida la reproducción, distribución, modificación,
                        comunicación pública o cualquier otra forma de explotación de dichos
                        contenidos sin autorización previa y expresa por escrito de{" "}
                        <strong>{BUSINESS.name}</strong>. El incumplimiento de esta disposición
                        podrá dar lugar a acciones legales civiles y/o penales.
                    </p>
                </section>

                {/* 12. Conducta del Usuario y Prohibiciones */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        12. Conducta del Usuario y Usos Prohibidos
                    </h2>
                    <p className="mb-3">
                        El usuario se compromete a utilizar la plataforma de forma lícita,
                        honesta y conforme a los presentes términos. Queda expresamente prohibido:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            Proporcionar datos de identidad, pago o dirección falsos o de terceros
                            sin autorización.
                        </li>
                        <li>
                            Realizar compras con tarjetas de crédito o débito que no le pertenezcan
                            o cuyo uso no haya sido autorizado por el titular.
                        </li>
                        <li>
                            Intentar acceder de forma no autorizada a los sistemas, bases de datos
                            o cuentas de otros usuarios de la plataforma.
                        </li>
                        <li>
                            Utilizar herramientas automatizadas (bots, scripts) para realizar
                            pedidos masivos, manipular precios o extraer información de la
                            plataforma.
                        </li>
                        <li>
                            Realizar devoluciones fraudulentas o abusar de las políticas de garantía
                            mediante la presentación de información falsa o productos alterados.
                        </li>
                    </ul>
                    <p className="mt-3">
                        El incumplimiento de estas prohibiciones faculta a{" "}
                        <strong>{BUSINESS.name}</strong> a cancelar pedidos, suspender o eliminar
                        cuentas y, de ser el caso, iniciar las acciones legales que correspondan.
                    </p>
                </section>

                {/* 13. Limitación de Responsabilidad */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        13. Limitación de Responsabilidad
                    </h2>
                    <p className="mb-3">
                        <strong>{BUSINESS.name}</strong> actúa como proveedor de bienes y adopta
                        medidas razonables para garantizar la calidad, veracidad de la información
                        y continuidad del servicio. No obstante, no se hace responsable por:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            La pérdida de datos, archivos o información personal almacenada en
                            dispositivos entregados para evaluación técnica o garantía, si el
                            cliente no realizó previamente una copia de seguridad (backup).
                            Se recomienda encarecidamente respaldar toda la información antes de
                            enviar un equipo.
                        </li>
                        <li>
                            Interrupciones temporales del servicio de la plataforma por
                            mantenimiento, actualizaciones o causas técnicas ajenas al control
                            de <strong>{BUSINESS.name}</strong>.
                        </li>
                        <li>
                            Demoras en la entrega de pedidos causadas por eventos de fuerza mayor
                            o caso fortuito, tales como desastres naturales, huelgas, paros
                            nacionales, bloqueos de carreteras, restricciones gubernamentales o
                            condiciones climáticas extremas.
                        </li>
                        <li>
                            El uso indebido que el cliente dé al producto una vez entregado en
                            perfectas condiciones.
                        </li>
                        <li>
                            Daños indirectos, lucro cesante o perjuicios consecuenciales derivados
                            del uso o imposibilidad de uso de los productos adquiridos.
                        </li>
                    </ul>
                    <p className="mt-3">
                        En ningún caso la responsabilidad total de <strong>{BUSINESS.name}</strong>{" "}
                        frente al usuario podrá exceder el monto efectivamente pagado por el
                        producto objeto de la controversia.
                    </p>
                </section>

                {/* 14. Modificaciones */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        14. Modificaciones a los Términos y Condiciones
                    </h2>
                    <p>
                        <strong>{BUSINESS.name}</strong> se reserva el derecho de modificar,
                        actualizar o ampliar los presentes Términos y Condiciones en cualquier
                        momento, con el fin de adaptarlos a cambios normativos, operativos o
                        tecnológicos. Las modificaciones serán publicadas en esta misma página
                        con la fecha de actualización correspondiente. El uso continuado de la
                        plataforma tras la publicación de cambios implica la aceptación de los
                        nuevos términos. Se recomienda revisar este documento periódicamente.
                    </p>
                </section>

                {/* 15. Libro de Reclamaciones */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        15. Libro de Reclamaciones Virtual
                    </h2>
                    <p className="mb-3">
                        Conforme al D.S. N° 011-2011-PCM y sus modificatorias,{" "}
                        <strong>{BUSINESS.name}</strong> pone a disposición de sus consumidores
                        el <strong>Libro de Reclamaciones Virtual</strong>. El usuario tiene
                        derecho a registrar una queja o reclamo, el cual será atendido en un
                        plazo máximo de <strong>30 días hábiles</strong> contados desde la
                        fecha de presentación.
                    </p>
                    <p className="mb-3">
                        Para presentar un reclamo, el usuario puede escribir al correo{" "}
                        <a href={`mailto:${BUSINESS.email}`} className="text-blue-600 underline">
                            {BUSINESS.email}
                        </a>{" "}
                        indicando en el asunto <em>RECLAMO – [N° de orden]</em>, o acceder
                        directamente al formulario:
                    </p>
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                        <Link
                            href="/libro-de-reclamaciones"
                            className="text-blue-700 font-bold hover:underline"
                        >
                            → Acceder al Libro de Reclamaciones Virtual
                        </Link>
                    </div>
                    <p className="mt-3 text-sm">
                        Si la controversia no es resuelta satisfactoriamente por{" "}
                        <strong>{BUSINESS.name}</strong>, el consumidor puede acudir al{" "}
                        <strong>INDECOPI</strong> a través de{" "}
                        <a
                            href="https://www.indecopi.gob.pe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            www.indecopi.gob.pe
                        </a>
                        , al teléfono <strong>224-7777</strong> (Lima) o al{" "}
                        <strong>0-800-4-4040</strong> (provincias, llamada gratuita).
                    </p>
                </section>

                {/* 16. Jurisdicción */}
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-200 pb-2">
                        16. Jurisdicción y Ley Aplicable
                    </h2>
                    <p>
                        Cualquier controversia derivada de la interpretación, ejecución o
                        incumplimiento de los presentes Términos y Condiciones será sometida
                        a la jurisdicción de los Juzgados y Tribunales competentes de la ciudad
                        de <strong>Lima, Perú</strong>, aplicando en todo caso la legislación
                        peruana vigente. Las partes renuncian expresamente a cualquier otro
                        fuero que pudiera corresponderles.
                    </p>
                </section>

                {/* Contacto */}
                <section className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h2 className="text-xl font-bold mb-3">
                        Consultas sobre estos Términos y Condiciones
                    </h2>
                    <p className="mb-3 text-sm">
                        Si tienes dudas sobre alguna disposición de este documento, contáctanos:
                    </p>
                    <ul className="text-sm space-y-1">
                        <li>
                            📧 <strong>Correo:</strong>{" "}
                            <a href={`mailto:${BUSINESS.email}`} className="text-blue-600 underline">
                                {BUSINESS.email}
                            </a>
                        </li>
                        <li>📱 <strong>WhatsApp / Teléfono:</strong> {BUSINESS.telefono}</li>
                        <li>🕐 <strong>Horario de Atención:</strong> {BUSINESS.horario}</li>
                    </ul>
                </section>

            </div>
        </div>
    );
}
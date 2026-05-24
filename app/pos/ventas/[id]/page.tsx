import { getSale } from "@/src/services/sales"
import {
    FaFilePdf,
    FaWhatsapp,
    FaEnvelope,
    FaTimesCircle, FaArrowLeft
} from "react-icons/fa"
import Image from "next/image"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

type Params = Promise<{ id: string }>

export default async function PageVenta({ params }: { params: Params }) {
    const { id } = await params
    const sale = await getSale(id)

    if (!sale) {
        return <div className="p-6 text-red-500">Venta no encontrada</div>
    }

    const pdfUrl = `/api/sales/${sale._id}/pdf`
    const whatsappUrl = `https://api.whatsapp.com/send?text=Comprobante%20de%20venta%20${sale.receiptNumber}%20${pdfUrl}`
    const emailUrl = `mailto:?subject=Comprobante%20de%20venta%20${sale.receiptNumber}&body=Adjunto%20el%20comprobante%20de%20su%20compra.%0A${pdfUrl}`

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Encabezado empresa + acciones */}

            <div className="flex items-center gap-3">
                <Link
                    href="/pos/ventas"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                    <FaArrowLeft /> Volver
                </Link>
            </div>
            <div className="flex justify-between items-start border-b pb-4">
                {/* Botón Volver */}


                {/* Empresa + acciones */}
                <div className="flex-1 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">neoshop</h1>
                        <p className="text-sm text-gray-500">RUC: 1078632515</p>
                        <p className="text-sm text-gray-500">Jr. Comercio 123 - Lima</p>
                    </div>

                    <div className="text-right space-y-2">
                        <div>
                            <p className="font-semibold text-lg">Comprobante</p>
                            <p className="text-sm text-gray-500">#{sale.receiptNumber}</p>
                            <p className="text-sm text-gray-500">
                                {format(new Date(sale.createdAt), "PPPpp", { locale: es })}
                            </p>
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-wrap gap-2 justify-end pt-2">
                            {/* Imprimir */}
                            <Link
                                href={pdfUrl}
                                target="_blank"
                                className="p-2 rounded-lg border hover:bg-gray-100"
                                title="Imprimir/Ver PDF"
                            >
                                <FaFilePdf className="text-red-500" />
                            </Link>

                            {/* Cancelar */}
                            <div

                            >
                                <FaTimesCircle className="text-gray-600" />
                                {/* Cancelar la venta */}
                            </div>



                            {/* WhatsApp */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                className="p-2 rounded-lg border hover:bg-gray-100"
                                title="Enviar por WhatsApp"
                            >
                                <FaWhatsapp className="text-green-500" />
                            </a>

                            {/* Correo */}
                            <a
                                href={emailUrl}
                                className="p-2 rounded-lg border hover:bg-gray-100"
                                title="Enviar por correo"
                            >
                                <FaEnvelope className="text-blue-500" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos */}
            <div>
                <h2 className="font-semibold mb-2">Detalle de productos</h2>
                <div className="divide-y border rounded-lg">

                    {sale.items.map((item, idx) => {
                        const isPopulated = typeof item.product !== "string";

                        return (
                            <div
                                key={idx}
                                className="flex justify-between items-center px-4 py-3 text-sm"
                            >
                                <div className="flex items-center gap-3">
                                    {isPopulated && (
                                        <Image
                                            src={item.product.imagenes[0] || "/logo.svg"}
                                            alt={item.product.nombre}
                                            width={45}
                                            height={45}
                                            className="rounded border"
                                            quality={2}
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">
                                            {isPopulated ? item.product.nombre : "Producto eliminado"}
                                        </p>
                                        <p className="text-gray-500">Cant: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">
                                        S/ {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-400">S/ {item.price} c/u</p>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>

            {/* Resumen */}
            <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>S/ {sale.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>S/ {sale.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            {/* Footer */}

        </div>
    )
}

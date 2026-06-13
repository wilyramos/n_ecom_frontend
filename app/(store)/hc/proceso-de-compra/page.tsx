export default function ProcesoCompraPage() {
    const pasos = [
        { title: "Selección de productos", description: "Explora nuestras categorías y agrega lo que busques a tu bolsa de compra." },
        { title: "Pago", description: "Finaliza tu pedido con métodos confiables. Procesamos tu pago con seguridad garantizada." },
        { title: "Confirmación", description: "Recibirás un correo automático con el resumen detallado y tu número de orden." },
        { title: "Preparación", description: "Cada producto pasa por un control de calidad y embalaje protector antes del despacho." },
        { title: "Envío y seguimiento", description: "Despachamos a nivel nacional con tiempos de entrega priorizados según tu ubicación." }
    ];

    return (
        <section className="max-w-2xl mx-auto py-12 px-4">

            {/* Header */}
            <header className="mb-16">
                <h1 className="text-3xl font-bold text-black mb-4">Proceso de compra</h1>
                <p className="text-gray-600">Un flujo de compra simple, fluido y transparente.</p>
            </header>

            {/* Pasos */}
            <div className="space-y-12">
                {pasos.map((paso, index) => (
                    <div key={index} className="flex gap-6">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-gray-400">
                            {String(index + 1).padStart(2, '0')}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black mb-2">{paso.title}</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">{paso.description}</p>
                        </div>
                    </div>
                ))}
            </div>


        </section>
    );
}
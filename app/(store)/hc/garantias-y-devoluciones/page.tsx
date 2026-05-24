import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Garantías y Devoluciones | neoshop",
    description: "Políticas de garantías y devoluciones de neoshop.",
};

export default function GarantiasDevolucionesPage() {
    return (
        <section className="max-w-2xl mx-auto py-12 px-4">

            {/* Header */}
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-black mb-4">Garantías y devoluciones</h1>
                <p className="text-gray-600">Transparencia y compromiso en cada paso.</p>
            </header>

            {/* Contenido principal */}
            <div className="space-y-12">

                {/* Desistimiento */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Derecho de desistimiento</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Tienes hasta <strong>3 días hábiles</strong> tras la entrega para solicitar un cambio.
                        El producto debe estar nuevo, sellado en su empaque original y sin rastros de activación.
                    </p>
                </section>

                {/* Grid de condiciones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Requisitos</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>• Producto sin señales de uso.</li>
                            <li>• Caja, sellos y accesorios originales.</li>
                            <li>• Presentar comprobante de pago.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">No cubiertos</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>• Daños por uso o accidentes.</li>
                            <li>• Software modificado.</li>
                            <li>• Productos de higiene abiertos.</li>
                        </ul>
                    </div>
                </div>

                {/* Proceso */}
                <section className="bg-black text-white p-8">
                    <h2 className="text-xl font-bold mb-6">¿Cómo iniciar el proceso?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {["Contacta vía WhatsApp.", "Evaluación técnica (3-7 días).", "Cambio o reembolso validado."].map((step, i) => (
                            <div key={i}>
                                <div className="text-xs font-bold text-gray-400 mb-2">0{i + 1}</div>
                                <p className="text-sm">{step}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>


        </section>
    );
}
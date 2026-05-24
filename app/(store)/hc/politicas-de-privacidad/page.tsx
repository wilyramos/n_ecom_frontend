import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Políticas de Privacidad | neoshop",
    description: "Transparencia en la protección de tus datos personales.",
};

export default function PoliticasPrivacidadPage() {
    const secciones = [
        {
            title: "Información recopilada",
            items: ["Nombre", "Correo electrónico", "Teléfono", "Dirección", "Historial de compras"]
        },
        {
            title: "Uso de información",
            items: ["Procesar pagos", "Coordinar envíos", "Soporte técnico", "Notificaciones de pedidos", "Mejora de experiencia"]
        },
        {
            title: "Tus derechos",
            items: ["Acceso a datos", "Corrección o actualización", "Eliminación de información", "Retiro de consentimiento"]
        }
    ];

    return (
        <section className="max-w-2xl mx-auto py-12 px-4">

            {/* Header */}
            <header className="mb-16">
                <h1 className="text-3xl font-bold text-black mb-4">Políticas de privacidad</h1>
                <p className="text-gray-600">Tu privacidad es nuestra responsabilidad. Protegemos tus datos con los más altos estándares de seguridad.</p>
            </header>

            {/* Secciones */}
            <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {secciones.map((sec, idx) => (
                        <div key={idx}>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-4">{sec.title}</h2>
                            <ul className="text-sm text-gray-600 space-y-2">
                                {sec.items.map((item, i) => (
                                    <li key={i}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bloque destacado */}
                <div className="bg-black text-white p-8">
                    <h2 className="text-xl font-bold mb-4">Protección de datos</h2>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Implementamos medidas de seguridad de nivel bancario. Tus datos personales jamás serán vendidos ni compartidos con terceros, salvo estrictamente para fines logísticos de tus pedidos.
                    </p>
                </div>
            </div>

            {/* Contacto */}
            <div className="mt-16 border-t border-gray-100 pt-12 text-center">
                <h3 className="text-sm font-bold text-black mb-4">¿Deseas ejercer tus derechos?</h3>
                <Link href="/hc/contacto-y-soporte" className="text-sm font-bold text-black hover:underline">
                    Contáctanos aquí →
                </Link>
            </div>

        
        </section>
    );
}

import Link from "next/link";
import {
    RiHeadphoneLine,
    RiShoppingBag3Line,
    RiShieldCheckLine,
    RiChat1Line,
    RiFileShieldLine,
    RiArrowRightSLine,
    RiTruckLine,
    RiWallet3Line
} from "react-icons/ri";

export default function PageCentroAyuda() {
    const categories = [
        {
            title: "Pedidos",
            description: "Rastreo y estados",
            href: "/hc/proceso-de-compra",
            icon: RiShoppingBag3Line,
            color: "text-orange-500",
            bg: "bg-orange-100"
        },
        {
            title: "Envíos",
            description: "Plazos y entrega",
            href: "/hc/proceso-de-compra",
            icon: RiTruckLine,
            color: "text-blue-500",
            bg: "bg-blue-100"
        },
       
        {
            title: "Soporte",
            description: "Chat en vivo 24/7",
            href: "/hc/contacto-y-soporte",
            icon: RiHeadphoneLine,
            color: "text-red-500",
            bg: "bg-red-100"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 md:py-12 animate-in fade-in duration-500">
            {/* --- HEADER SIMPLE --- */}
            <header className="px-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Centro de Ayuda
                </h1>
                <p className="text-sm text-gray-500">
                    Estamos aquí para ayudarte con tus compras en neoshop.
                </p>
            </header>

            {/* --- GRID DE ACCESO RÁPIDO (Estilo Temu) --- */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 mb-10">
                {categories.map((cat, idx) => (
                    <Link
                        key={idx}
                        href={cat.href}
                        className="flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow"
                    >
                        <div className={`w-12 h-12 ${cat.bg} ${cat.color} rounded-full flex items-center justify-center mb-3`}>
                            <cat.icon size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">{cat.title}</h3>
                        <p className="text-[11px] text-gray-500 mt-1">{cat.description}</p>
                    </Link>
                ))}
            </section>

            {/* --- LISTA DE TEMAS (Autoservicio) --- */}
            <section className="px-4 space-y-3">
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Temas comunes</h2>
                
                {[
                    { title: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes", icon: RiChat1Line },
                    { title: "Políticas de privacidad", href: "/hc/politicas-de-privacidad", icon: RiFileShieldLine },
                ].map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl group hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <item.icon className="text-gray-400 group-hover:text-[var(--store-primary)]" size={20} />
                            <span className="text-sm font-medium text-gray-700">{item.title}</span>
                        </div>
                        <RiArrowRightSLine className="text-gray-300" size={20} />
                    </Link>
                ))}
            </section>

            {/* --- FOOTER DE SOPORTE DIRECTO --- */}
            <footer className="mt-12 px-4 pb-10 text-center">
                <div className="p-8 bg-gray-900 rounded-[2rem] text-white">
                    <h3 className="text-lg font-bold mb-2">¿Todavía necesitas ayuda?</h3>
                    <p className="text-sm text-gray-400 mb-6">Nuestro equipo de soporte está disponible para ti.</p>
                    <Link
                        href="/hc/contacto-y-soporte"
                        className="inline-block bg-[var(--store-primary)] text-white px-8 py-3 rounded-full text-sm font-bold hover:brightness-110 transition-all"
                    >
                        Contáctanos
                    </Link>
                </div>
            </footer>
        </div>
    );
}
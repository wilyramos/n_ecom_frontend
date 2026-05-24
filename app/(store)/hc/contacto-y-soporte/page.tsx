

export default function ContactoSoportePage() {
    const contactMethods = [
        { title: "WhatsApp", value: "+51 902 900 653 636", description: "Respuesta inmediata.", href: "https://wa.me/519" },
        { title: "Email", value: "contacto@neoshop.com", description: "Consultas técnicas.", href: "mailto:contacto@neoshop.com" },
        { title: "Ubicación", value: "Av caminos del inca 257-Surco Piso 3 - Tda 326", description: "San Vicente de Lima - Perú.", href: "#" },
        { title: "Horario", value: "Lun–Sáb 10am – 7pm", description: "Atención personalizada.", href: "#" }
    ];

    return (
        <section className="max-w-3xl mx-auto py-12 px-4">
            
            {/* Header */}
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-black mb-4">Contacto y soporte</h1>
                <p className="text-gray-600">Nuestro equipo está listo para ayudarte con tus consultas.</p>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                {contactMethods.map((method) => (
                    <div key={method.title} className="p-6 bg-gray-50">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{method.title}</h3>
                        <a href={method.href} className="block text-sm font-bold text-black mb-1 hover:underline">
                            {method.value}
                        </a>
                        <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                ))}
            </div>

          
            
        </section>
    );
}
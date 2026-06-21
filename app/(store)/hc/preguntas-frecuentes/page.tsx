import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preguntas Frecuentes | neoshop",
    description: "Resuelve tus dudas más comunes sobre compras, envíos, garantías y más en neoshop.",
};

export default function PreguntasFrecuentesPage() {
    const faqs = [
        {
            question: "¿Cómo puedo realizar una compra?",
            answer: "Selecciona tu producto, agrégalo a tu bolsa y finaliza la transacción eligiendo tu método de pago. Recibirás una confirmación inmediata al completar el pedido."
        },
        {
            question: "¿Hacen envíos a todo el Perú?",
            answer: "Sí. Realizamos despachos a nivel nacional. Tiempos de entrega: 24h para Lima y entre 48h a 72h para provincias."
        },
        {
            question: "¿Qué hago si mi producto llega con daños?",
            answer: "Puedes solicitar un cambio dentro de los primeros 3 días hábiles. Es indispensable conservar el empaque original, sellos y accesorios completos."
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer: "Aceptamos Visa, Mastercard, American Express, Mercado Pago, Yape y Plin."
        },
        {
            question: "¿Puedo devolver un equipo activado?",
            answer: "No. Por políticas de seguridad, los dispositivos abiertos, encendidos o activados no admiten devolución por arrepentimiento. Solo aplican cambios por fallas técnicas."
        },
        {
            question: "¿Cuál es el horario de atención?",
            answer: "Lunes a Sábado de 10:00 am a 7:00 pm. Fuera de horario, déjanos un mensaje por WhatsApp y te contactaremos a primera hora."
        }
    ];

    return (
        <section className="max-w-2xl mx-auto py-12 px-4">

            {/* Header */}
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-black mb-4">Preguntas frecuentes</h1>
                <p className="text-gray-600">Todo lo que necesitas saber sobre tus compras.</p>
            </header>

            {/* Acordeón */}
            <div className="mb-16">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-gray-200">
                            <AccordionTrigger className="text-sm font-bold text-black hover:no-underline py-4">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-gray-600 pb-4 leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Ayuda Extra */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                <div className="p-6 bg-gray-50">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-2">¿Más dudas?</h3>
                    <p className="text-sm text-gray-600 mb-4">Nuestro equipo de soporte está listo para asesorarte personalmente.</p>
                    <Link href="/hc/contacto-y-soporte" className="text-sm font-bold text-black hover:underline">
                        Chatear ahora →
                    </Link>
                </div>
                <div className="p-6 bg-black text-white">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-2">Garantía neoshop</h3>
                    <p className="text-sm text-gray-300 mb-4">Todos nuestros productos cuentan con respaldo oficial y garantía local.</p>
                    <Link href="/cambios-devoluciones" className="text-sm font-bold text-white hover:underline">
                        Ver términos →
                    </Link>
                </div>
            </div>

         
        </section>
    );
}
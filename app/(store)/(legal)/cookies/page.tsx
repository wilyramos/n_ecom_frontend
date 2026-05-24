import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Cookies | neoshop",
    description: "Información sobre el uso de cookies en el sitio web de neoshop.",
};

export default function CookiesPage() {
    return (
        <>
            <h1 className="text-3xl md:text-4xl mb-4">Política de Cookies</h1>
            <p className="text-sm mb-12">Cómo protegemos tu experiencia digital.</p>

            <section className="mb-8">
                <h2 className="text-xl mb-4">¿Qué son las cookies?</h2>
                <p>
                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo para mejorar la navegación y personalizar tu experiencia en nuestra tienda.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl mb-4">Tipos de cookies que usamos</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Esenciales:</strong> Necesarias para el funcionamiento del carrito de compras y el inicio de sesión.</li>
                    <li><strong>Analíticas:</strong> Nos ayudan a entender cómo los usuarios interactúan con el sitio (Google Analytics).</li>
                    <li><strong>Marketing:</strong> Utilizadas para mostrarte ofertas relevantes basadas en tus intereses.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl mb-4">Gestión de Cookies</h2>
                <p>
                    Puedes desactivar las cookies en cualquier momento desde la configuración de tu navegador. Ten en cuenta que esto podría afectar algunas funcionalidades de la tienda.
                </p>
            </section>
        </>
    );
}
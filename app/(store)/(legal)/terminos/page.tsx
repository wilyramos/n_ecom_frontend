import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos y Condiciones | neoshop",
    description: "Conoce los términos y condiciones de uso de nuestra plataforma neoshop.",
};

export default function TerminosPage() {
    return (
        <>
            <h1 className="text-3xl md:text-4xl mb-4">Términos y Condiciones</h1>
            <p className="text-sm mb-12">Última actualización: {new Date().toLocaleDateString('es-PE')}</p>

            <section className="mb-8">
                <h2 className="text-xl mb-4">1. Generalidades</h2>
                <p>
                    Este documento regula el acceso y uso del sitio web de neoshop. Al utilizar nuestros servicios, aceptas estos términos en su totalidad.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl mb-4">2. Propiedad Intelectual</h2>
                <p>
                    Todo el contenido presente en este sitio, incluyendo marcas, logos, textos e imágenes, es propiedad de neoshop o de sus proveedores y está protegido por las leyes de propiedad intelectual.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl mb-4">3. Envíos y Entregas</h2>
                <p>
                    Los tiempos de envío pueden variar según la ubicación. neoshop se compromete a despachar los productos en los plazos establecidos, pero no se responsabiliza por retrasos ajenos a nuestra gestión logística.
                </p>
            </section>
        </>
    );
}
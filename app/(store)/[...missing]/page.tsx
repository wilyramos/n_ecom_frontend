// File: frontend/app/(store)/[...missing]/page.tsx
// Captura cualquier ruta inexistente de la tienda y responde un 404 real.
// La interfaz se renderiza desde app/(store)/not-found.tsx.
import { notFound } from "next/navigation";

export default function MissingPage() {
    notFound();
}

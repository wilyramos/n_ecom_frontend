// File: frontend/app/(store)/productos/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-2">

            <div className="flex items-center text-sm text-gray-500 pb-2">
                <Link href="/" className="hover:text-gray-900">Inicio</Link>
                <span className="mx-2">/</span>
                <Link href="/productos" className="hover:text-gray-900">Productos</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">No encontrado</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

                <div className="md:col-span-3">
                    <div className="w-full aspect-square md:aspect-video bg-white">
                        <span className="text-sm font-medium uppercase tracking-wider text-gray-300 flex items-center justify-center h-full">
                            image not found
                        </span>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white p-4 h-full flex flex-col">

                        <header className="border-b pb-4 space-y-2">
                            <div className="flex justify-between text-xs uppercase">
                                <span className="font-bold text-gray-600">neoshop</span>
                                <span className="text-gray-400">ERROR: 404</span>
                            </div>

                            <h1 className="text-xl font-medium text-gray-800">
                                Este producto no está disponible
                            </h1>

                            <p className="text-3xl text-gray-300">
                                <span className="text-sm mr-1">S/</span>--.--
                            </p>

                            <span className="text-xs px-2 py-1 text-red-600 bg-red-100 rounded-sm inline-block">
                                Fuera de stock / No existe
                            </span>
                        </header>

                        <p className="text-sm text-gray-600 py-4">
                            Puede que el enlace sea incorrecto o que el producto haya sido retirado.
                        </p>

                        <div className="mt-auto space-y-3 pt-4">
                            <p className="text-sm font-medium text-gray-700">Te sugerimos:</p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/productos" className="flex-1">
                                    <Button
                                        variant="default"
                                        size="sm"

                                    >
                                        <Store className="w-4 h-4" />
                                        Ver Tienda
                                    </Button>
                                </Link>

                                <Link href="/" className="flex-1">
                                    <Button

                                        variant="accent"
                                        size="sm"

                                    >
                                        <Home className="w-4 h-4" />
                                        Inicio
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

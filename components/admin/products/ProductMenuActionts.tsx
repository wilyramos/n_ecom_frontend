'use client'

import Link from 'next/link'
import { Pencil, ExternalLink } from 'lucide-react'
import { SlOptions } from "react-icons/sl"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteProductForm from './DeleteProductButton'

interface Props {
    productId: string
}

export default function ProductMenuAction({ productId }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-ring">
                    <SlOptions className="w-4 h-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${productId}`}>
                        <Pencil className="size-4" />
                        <span>Editar</span>
                    </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                    <Link href={`/products/${productId}`} target="_blank">
                        <ExternalLink className="size-4" />
                        <span>Ver en tienda</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive" asChild>
                    {/* Asegúrate que tu componente DeleteProductForm 
                        esté adaptado para ser disparado desde un item o 
                        simplificado para renderizar solo el botón de acción */}
                    <DeleteProductForm productId={productId} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
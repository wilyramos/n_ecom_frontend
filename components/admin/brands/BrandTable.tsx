"use client";

import { Brand } from "@/src/services/brands";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BrandDialog from "./BrandDialog";
import Image from "next/image";

export default function BrandTable({ brands }: { brands: Brand[] }) {
    return (
        <div className="w-full overflow-x-auto pb-2">
            <Table className="min-w-full table-auto border-separate border-spacing-0">
                <TableHeader>
                    <TableRow>
                        <TableHead className="p-1 text-center w-[80px] ">Logo</TableHead>
                        <TableHead className="p-1 text-center w-[180px] ">Nombre</TableHead>
                        <TableHead className="p-1 text-center w-[180px] ">Slug</TableHead>
                        <TableHead className="p-1 text-center w-[90px] ">Estado</TableHead>
                        <TableHead className="p-1 text-center w-[90px] ">Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {brands.map((b) => (
                        <TableRow
                            key={b._id}
                            className="text-xs border-b hover:bg-muted/30 transition-colors"
                        >
                            <TableCell className="p-2 text-center">
                                {b.logo ? (
                                    <Image
                                        src={b.logo}
                                        alt={b.nombre}
                                        width={40}
                                        height={40}
                                        className="h-8 w-8 object-contain rounded bg-muted border"
                                    />
                                ) : (
                                    <span className="text-muted-foreground">—</span>
                                )}
                            </TableCell>

                            <TableCell className="p-2 text-center">
                                {b.nombre}
                            </TableCell>

                            <TableCell className="p-2 text-center text-muted-foreground">
                                {b.slug}
                            </TableCell>

                            <TableCell className="p-2 text-center">
                                <Badge variant={b.isActive ? "default" : "destructive"}>
                                    {b.isActive ? "Activo" : "Inactivo"}
                                </Badge>
                            </TableCell>

                            <TableCell className="p-2 text-center">
                                <BrandDialog
                                    brand={b}
                                    trigger={
                                        <Button size="sm" variant="default">
                                            Editar
                                        </Button>
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

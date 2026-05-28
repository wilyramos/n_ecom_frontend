// File: frontend/components/admin/clients/ClientsTable.tsx
import type { UsersAPIResponse } from "@/src/schemas";
import ClientsTableFilters from "./ClientsTableFilters";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

type Props = { clients: UsersAPIResponse };

export default function ClientsTable({ clients }: Props) {
    const clientes = clients.users;

    return (
        <div className="w-full overflow-auto text-sm ">
            <Table>
                <TableHeader className="">
                    <ClientsTableFilters />
                </TableHeader>

                <TableBody>
                    {clientes.map((client) => (
                        <TableRow key={client._id} className="">
                            <TableCell className="text-foreground font-medium">{client.nombre}</TableCell>
                            <TableCell className="text-muted-foreground">{client.email}</TableCell>
                            <TableCell className="text-muted-foreground">{client.telefono}</TableCell>
                            <TableCell className="text-muted-foreground">{client.numeroDocumento}</TableCell>
                            <TableCell className="text-muted-foreground">{client.rol}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
import AddClientButton from "@/components/admin/clients/AddClientButton";
import ClientsTable from "@/components/admin/clients/ClientsTable";
import Pagination from "@/components/ui/Pagination";
import { getUsers } from "@/src/services/users";


type SearchParams = Promise<{
    page?: string;
    limit?: string;
    nombre?: string;
    email?: string;
    telefono?: string;
    numeroDocumento?: string;
}>;

export default async function pageClientesPOS({ searchParams }: { searchParams: SearchParams }) {

    const params = await searchParams;

    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.limit ? parseInt(params.limit, 10) : 10;


    const clients = await getUsers({
        page: currentPage,
        limit: itemsPerPage,
        nombre: params.nombre,
        email: params.email,
        telefono: params.telefono,
        numeroDocumento: params.numeroDocumento,
    });



    return (
        <>

            <AddClientButton 
                role="client"
            />

            {clients && clients.users ? (

                <>
                    <ClientsTable clients={clients} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(clients.totalUsers / itemsPerPage)}
                        limit={itemsPerPage}
                        pathname="/admin/clients"
                    />
                </>

            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">No se encontraron clientes.</p>
                </div>
            )}
        </>
    )
}
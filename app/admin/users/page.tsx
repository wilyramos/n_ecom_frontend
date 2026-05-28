import { Suspense } from "react";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import AddClientButton from "@/components/admin/clients/AddClientButton";
import ClientsTable from "@/components/admin/clients/ClientsTable";
import { getUsers } from "@/src/services/users";
import Pagination from "@/components/ui/Pagination";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";


type SearchParams = Promise<{
    page?: string;
    limit?: string;
    nombre?: string;
    email?: string;
    telefono?: string;
    numeroDocumento?: string;
}>;

export default async function AdminClientsPage({ searchParams }: { searchParams: SearchParams }) {

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
        <main >

            <AdminPageWrapper
                title="Usuarios admin/vendedores"
                showBackButton={false}
                actions={<AddClientButton role="admin" />}
            >

                <div className="mt-4">
                    <Suspense fallback={<SpinnerLoading />}>

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
                    </Suspense>
                </div>
            </AdminPageWrapper>
        </main>
    )
}

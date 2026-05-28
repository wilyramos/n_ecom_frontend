import AdminPageWrapper from '@/components/admin/AdminPageWrapper';
import AddClientButton from '@/components/admin/clients/AddClientButton';
import ClientsTable from '@/components/admin/clients/ClientsTable';
import SpinnerLoading from '@/components/ui/SpinnerLoading';
import { getAllClients } from '@/src/services/users';
import { Suspense } from 'react';

import Pagination from "@/components/ui/Pagination";


type SearchParams = Promise<{
    page?: string;
    limit?: string;
    nombre?: string;
    email?: string;
    telefono?: string;
    numeroDocumento?: string;
}>;

export default async function ClientsPage({ searchParams }: { searchParams: SearchParams }) {



    const params = await searchParams;
    const currentPage = params.page ? parseInt(params.page, 10) : 1;
    const itemsPerPage = params.limit ? parseInt(params.limit, 10) : 10;

    const clients = await getAllClients({
        page: currentPage,
        limit: itemsPerPage,
    });
    return (
        <AdminPageWrapper
            title="Clientes"
            showBackButton={false}
            actions={<AddClientButton  role='client'/>}
        >

            <div className="mt-4">
                <Suspense fallback={<SpinnerLoading />}>

                    {clients && clients.users ? (

                        <>
                            <ClientsTable clients={clients} />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(10 / itemsPerPage)}
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
    )
}

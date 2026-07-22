// File: frontend/app/admin/users/page.tsx

import { UsersApiService } from "@/src/services/user-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import NuevoClienteModal from "@/components/admin/users/NuevoClienteModal";
import UserFilters from "@/components/admin/users/UserFilters";
import UserTable from "@/components/admin/users/UserTable";
import DataTablePagination from "@/components/ui/DataTablePagination";

interface SearchParams {
    page?: string;
    limit?: string;
    nombre?: string;
    email?: string;
    telefono?: string;
    numeroDocumento?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function UsersPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));
    const nombre = params.nombre?.trim() || undefined;
    const email = params.email?.trim() || undefined;
    const telefono = params.telefono?.trim() || undefined;
    const numeroDocumento = params.numeroDocumento?.trim() || undefined;

    const { users, totalUsers, totalPages } = await UsersApiService.getAll({
        page,
        limit,
        nombre,
        email,
        telefono,
        numeroDocumento,
    });

    return (
        <AdminPageWrapper
            title="Gestión de Usuarios"
            showBackButton={false}
            actions={<NuevoClienteModal />}
        >
            <div className="space-y-5">
                <UserFilters
                    filters={{
                        nombre: params.nombre,
                        email: params.email,
                        telefono: params.telefono,
                        numeroDocumento: params.numeroDocumento,
                    }}
                />

                <UserTable users={users} />

                {totalUsers > 0 && (
                    <DataTablePagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={totalUsers}
                        limit={limit}
                        pathname="/admin/users"
                        itemLabel="usuarios"
                    />
                )}
            </div>
        </AdminPageWrapper>
    );
}
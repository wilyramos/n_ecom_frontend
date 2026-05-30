//File: frontend/app/admin/profile/page.tsx

import { getCurrentUser } from "@/src/auth/currentUser";
import ProfileForm from "@/components/profile/ProfileForm";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import Link from "next/link";
import { FiLock, FiUser } from "react-icons/fi";
import { buttonVariants } from "@/components/ui/button";

export default async function AdminProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="flex h-64 items-center justify-center p-8">
                <p className="text-destructive font-medium">No se ha encontrado el usuario.</p>
            </div>
        );
    }

    return (
        <AdminPageWrapper
            title={`Perfil de ${user.nombre}`}
            breadcrumbItems={[{ label: "Configuración", href: "/admin/profile" }]}
            breadcrumbCurrent="Perfil"
            actions={
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/profile"
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                        <FiUser className="mr-2" /> Perfil
                    </Link>
                    <Link
                        href="/admin/profile/change-password"
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                        <FiLock className="mr-2" /> Cambiar contraseña
                    </Link>
                </div>
            }
        >
            <div className="max-w-3xl">
                <ProfileForm user={user} />
            </div>
        </AdminPageWrapper>
    );
}
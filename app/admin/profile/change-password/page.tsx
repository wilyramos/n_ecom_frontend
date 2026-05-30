import { getCurrentUser } from "@/src/auth/currentUser";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import Link from "next/link";
import { FiLock, FiUser } from "react-icons/fi";
import { buttonVariants } from "@/components/ui/button";

export default async function ChangePasswordPage() {
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
            breadcrumbItems={[
                { label: "Configuración", href: "/admin/profile" },
                { label: "Perfil", href: "/admin/profile" }
            ]}
            breadcrumbCurrent="Cambiar contraseña"
            actions={
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/profile"
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                        <FiUser className="mr-2" /> Perfil
                    </Link>
                    <Link
                        href="/admin/profile/change-password"
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                        <FiLock className="mr-2" /> Cambiar contraseña
                    </Link>
                </div>
            }
        >
            <div className="max-w-3xl">
                <ChangePasswordForm />
            </div>
        </AdminPageWrapper>
    );
}
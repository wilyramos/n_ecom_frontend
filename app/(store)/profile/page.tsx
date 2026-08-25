//File: frontend/app/%28store%29/profile/page.tsx

import { getCurrentUser } from "@/src/auth/currentUser";
import ProfileForm from "@/components/profile/ProfileForm";


export default async function ProfilePage() {
    const user = await getCurrentUser();

    // get current user
    if (!user) {
        return (
            <p>No se ha encontrado el usuario.</p>
        );
    }


    return (
        <>
            <ProfileForm user={user} />
        </>
    );
}

// File: frontend/app/(store)/auth/layout.tsx
import ToastNotification from '@/components/ui/ToastNotification'
import React from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/src/auth/dal';

export default async function layoutAuth({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (session) {
        if (session.user.rol === 'administrador') {
            redirect('/admin');
        }
        redirect('/profile');
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center'>
                <div className='w-full max-w-md py-20 flex-1 '>
                    {children}
                </div>
            </div>
            <ToastNotification />
        </>
    )
}
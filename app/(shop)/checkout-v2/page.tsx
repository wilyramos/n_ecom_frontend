// File: frontend/app/(shop)/checkout-v2/page.tsx
import React from 'react';
import { getSession } from '@/src/auth/dal';
import CheckoutClient from '@/src/modules/checkout/components/CheckoutClient';

export default async function CheckoutPage() {
  const session = await getSession();

  const initialData = session?.isAuth ? {
    nombre: session.user?.nombre || '',
    apellidos: session.user?.apellidos || '',
    email: session.user?.email || '',
    telefono: session.user?.telefono || '',
  } : null;

  return (
    <CheckoutClient
      initialCustomerData={initialData}
      isAuth={!!session?.isAuth}
      token={session?.token}
    />
  );
}
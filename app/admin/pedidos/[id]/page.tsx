// File: frontend/app/admin/pedidos/[id]/page.tsx

import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { verifySession } from '@/src/auth/dal';
import { getAdminPedidoById } from '@/src/modules/checkout/services/admin-pedidos.service';
import AdminPedidoDetailClient from '@/components/admin/pedidos/AdminPedidoDetailClient';

interface PedidoDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPedidoDetailPage({ params }: PedidoDetailPageProps) {
  const session = await verifySession();
  if (!session?.token) {
    redirect('/auth/login');
  }

  const { id } = await params;
  if (!id || id === 'undefined' || id.trim() === '') {
    notFound();
  }

  const pedido = await getAdminPedidoById(id.trim(), session.token);

  if (!pedido) {
    notFound();
  }

  return <AdminPedidoDetailClient initialPedido={pedido} />;
}
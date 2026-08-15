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
  // 1. Verificar permisos
  const session = await verifySession();
  if (!session?.token) {
    redirect('/auth/login');
  }

  // 2. Resolver parámetros de la URL
  const { id } = await params;
  if (!id || id === 'undefined' || id.trim() === '') {
    notFound();
  }

  // 3. Consultar datos al servidor
  const pedido = await getAdminPedidoById(id.trim(), session.token);

  if (!pedido) {
    notFound();
  }

  // 4. Renderizar el cliente
  return <AdminPedidoDetailClient initialPedido={pedido} />;
}
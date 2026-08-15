//File: frontend/app/admin/pedidos/page.tsx

import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/src/auth/dal';
import {
  getAdminPedidos,
  getAdminPedidosStats,
} from '@/src/modules/checkout/services/admin-pedidos.service';
import AdminPedidosClient from '@/components/admin/pedidos/AdminPedidosClient';

interface PedidosPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    provider?: string;
    delivery?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }>;
}

export default async function AdminPedidosPage({ searchParams }: PedidosPageProps) {
  const session = await verifySession();

  if (!session?.token) {
    redirect('/auth/login');
  }

  const query = await searchParams;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const status = query.status || 'all';
  const provider = query.provider || 'all';
  const delivery = query.delivery || 'all';
  const dateFrom = query.dateFrom || '';
  const dateTo = query.dateTo || '';
  const search = query.search || '';

  // Consultar la lista paginada y las métricas estadísticas en paralelo
  const [pedidosResponse, statsResponse] = await Promise.all([
    getAdminPedidos(
      {
        page,
        limit,
        status,
        paymentProvider: provider,
        deliveryMethod: delivery,
        dateFrom,
        dateTo,
        search,
      },
      session.token
    ),
    getAdminPedidosStats(session.token),
  ]);

  const defaultStats = {
    totalRecaudado: 0,
    totalApprovedOrders: 0,
    pendientesCount: 0,
    enProcesoCount: 0,
    enviadosCount: 0,
    entregadosCount: 0,
    canceladosCount: 0,
  };

  return (
    <AdminPedidosClient
      initialData={pedidosResponse?.data || []}
      stats={statsResponse || defaultStats}
      pagination={
        pedidosResponse?.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        }
      }
      currentFilters={{
        status,
        provider,
        delivery,
        dateFrom,
        dateTo,
        search,
        page,
        limit,
      }}
    />
  );
}
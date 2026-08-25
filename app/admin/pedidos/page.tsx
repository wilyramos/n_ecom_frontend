// File: frontend/app/admin/pedidos/page.tsx

import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/src/auth/dal';
import {
  getAdminPedidos,
  getAdminPedidosStats,
  IAdminPedidosParams,
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

  const currentFilters: IAdminPedidosParams = {
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 10,
    status: query.status || 'all',
    paymentProvider: query.provider || 'all',
    deliveryMethod: query.delivery || 'all',
    dateFrom: query.dateFrom || '',
    dateTo: query.dateTo || '',
    search: query.search || '',
  };

  const [pedidosResponse, statsResponse] = await Promise.all([
    getAdminPedidos(currentFilters, session.token),
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
          page: currentFilters.page || 1,
          limit: currentFilters.limit || 10,
          totalPages: 1,
        }
      }
      currentFilters={currentFilters}
    />
  );
}
// frontend/app/admin/tickets/page.tsx

import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/src/auth/dal';
import { getAdminTickets } from '@/src/modules/tickets/admin-tickets.service';
import AdminTicketsClient from '@/src/modules/tickets/components/AdminTicketsClient';

interface TicketsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function AdminTicketsPage({ searchParams }: TicketsPageProps) {
  const session = await verifySession();

  if (!session?.token) {
    redirect('/auth/login');
  }

  const query = await searchParams;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search || '';
  const dateFrom = query.dateFrom || '';
  const dateTo = query.dateTo || '';

  const ticketsResponse = await getAdminTickets(
    {
      page,
      limit,
      search,
      dateFrom,
      dateTo,
    },
    session.token
  );

  return (
    <AdminTicketsClient
      initialData={ticketsResponse?.data || []}
      pagination={
        ticketsResponse?.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        }
      }
      currentFilters={{
        search,
        dateFrom,
        dateTo,
        page,
        limit,
      }}
    />
  );
}
// frontend/src/modules/tickets/services/admin-tickets.service.ts

import { IAdminTicketsResponse, ITicket } from './ticket.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface IAdminTicketsParams {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function getAdminTickets(
  params: IAdminTicketsParams,
  token: string
): Promise<IAdminTicketsResponse | null> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search?.trim()) queryParams.append('search', params.search.trim());
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);

    const res = await fetch(`${API_URL}/tickets?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return (await res.json()) as IAdminTicketsResponse;
  } catch (error) {
    console.error('[getAdminTickets Error]:', error);
    return null;
  }
}

export async function getAdminTicketById(id: string, token: string): Promise<ITicket | null> {
  try {
    const res = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const responseData = await res.json();
    return responseData.data as ITicket;
  } catch (error) {
    console.error('[getAdminTicketById Error]:', error);
    return null;
  }
}
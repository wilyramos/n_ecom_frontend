// frontend/src/app/api/tickets/[id]/pdf/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get('ecommerce-token')?.value
  const API_URL = process.env.API_URL || 'http://localhost:4000/api'

  try {
    const res = await fetch(`${API_URL}/tickets/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return new NextResponse('PDF no encontrado', { status: res.status })
    }

    const contentDisposition = res.headers.get('Content-Disposition') || `inline; filename="ticket-${id}.pdf"`
    const pdfBuffer = await res.arrayBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': contentDisposition,
      },
    })
  } catch (error) {
    console.error('Error al obtener el PDF del ticket:', error)
    return new NextResponse('Error interno al obtener PDF', { status: 500 })
  }
}
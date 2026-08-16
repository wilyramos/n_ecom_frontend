// frontend/src/app/api/tickets/[id]/professional-pdf/route.ts
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
    const res = await fetch(`${API_URL}/tickets/${id}/professional-pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return new NextResponse('PDF no encontrado', { status: res.status })
    }

    const pdfBuffer = await res.arrayBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="boleta-${id}.pdf"`,
      },
    })
  } catch {
    return new NextResponse('Error interno al obtener PDF', { status: 500 })
  }
}
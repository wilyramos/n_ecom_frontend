import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = (await cookies()).get('ecommerce-token')?.value
    const API_URL = process.env.API_URL || 'http://localhost:4000/api'

    const res = await fetch(`${API_URL}/tickets/preview-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    if (!res.ok) {
      return new NextResponse('Error al generar previsualización del PDF', { status: res.status })
    }

    const pdfBuffer = await res.arrayBuffer()
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="preview-ticket.pdf"',
      },
    })
  } catch {
    return new NextResponse('Error interno de servidor', { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = (await cookies()).get('ecommerce-token')?.value
    const API_URL = process.env.API_URL || 'http://localhost:4000/api'

    const res = await fetch(`${API_URL}/tickets/bulk-print`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    if (!res.ok) {
      return new NextResponse('Error al generar PDF masivo', { status: res.status })
    }

    const pdfBuffer = await res.arrayBuffer()
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="comprobantes-seleccionados.pdf"',
      },
    })
  } catch (error) {
    console.error('[bulk-print route error]:', error)
    return new NextResponse('Error interno de servidor', { status: 500 })
  }
}
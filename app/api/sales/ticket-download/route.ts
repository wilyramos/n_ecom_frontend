import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const base64Data = searchParams.get("data");

  if (!base64Data) {
    return new NextResponse("Muestra de datos corrupta u omitida.", { status: 400 });
  }

  const pdfBuffer = Buffer.from(base64Data, "base64");

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=ticket_express.pdf",
    },
  });
}
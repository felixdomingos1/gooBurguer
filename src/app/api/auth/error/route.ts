import { NextResponse } from "next/server";

export async function GET() {
    
  return NextResponse.json(
    { error: "Ocorreu um erro durante a autenticação" },
    { status: 401 }
  );
}
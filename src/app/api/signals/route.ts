import { NextResponse } from "next/server";
import { MOCK_SIGNALS } from "@/lib/mock-data";

export async function GET() {
  // In production, this would fetch from a database or cache
  // populated by the analyze endpoint
  return NextResponse.json({
    signals: MOCK_SIGNALS,
    timestamp: new Date().toISOString(),
  });
}

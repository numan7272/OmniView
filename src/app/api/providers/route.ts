import { NextResponse } from "next/server";
import { PROVIDERS, getConfiguredProviders } from "@/lib/ai-providers";

export async function GET() {
  const configured = getConfiguredProviders();

  const providers = Object.values(PROVIDERS).map((p) => ({
    ...p,
    configured: configured.includes(p.id),
  }));

  return NextResponse.json({
    providers,
    active: configured[0] ?? null,
  });
}

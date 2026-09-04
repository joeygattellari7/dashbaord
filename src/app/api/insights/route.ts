import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchAccountSnapshot } from "@/lib/meta";
import { getClientById, getClients } from "@/lib/clients";
import { generateClientHealthCheck } from "@/lib/insights";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
  }

  const clientId = request.nextUrl.searchParams.get("clientId");

  try {
    const client = clientId ? getClientById(clientId) : getClients()[0];
    const snapshot = await fetchAccountSnapshot(client.metaAdAccountId);
    const anthropic = new Anthropic({ apiKey });
    const healthCheck = await generateClientHealthCheck(anthropic, client, snapshot);
    return NextResponse.json({ ...healthCheck, fetchedAt: snapshot.fetchedAt });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

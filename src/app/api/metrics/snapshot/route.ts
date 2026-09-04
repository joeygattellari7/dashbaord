import { NextResponse } from "next/server";
import { fetchAccountSnapshot } from "@/lib/meta";
import { getClients } from "@/lib/clients";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clients = getClients();
    const snapshots = await Promise.all(
      clients.map(async (client) => ({
        client,
        snapshot: await fetchAccountSnapshot(client.metaAdAccountId),
      }))
    );
    return NextResponse.json({ clients: snapshots });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

import type { NextRequest } from "next/server";
import { getClient } from "@/lib/clients";
import { PLATFORM_FETCHERS } from "@/lib/platforms";
import type { PlatformId } from "@/lib/clients";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ clientSlug: string; platform: string }> }
) {
  const { clientSlug, platform } = await params;

  const client = getClient(clientSlug);
  if (!client) {
    return new Response(`Client "${clientSlug}" not found`, { status: 404 });
  }

  const fetcher = PLATFORM_FETCHERS[platform as PlatformId];
  if (!fetcher || !client.platforms.includes(platform as PlatformId)) {
    return new Response(`Platform "${platform}" not configured for this client`, { status: 404 });
  }

  const intervalSeconds = Number(process.env.METRICS_POLL_INTERVAL_SECONDS) || 300;
  const encoder = new TextEncoder();
  let closed = false;
  const timers: ReturnType<typeof setInterval>[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const poll = async () => {
        try {
          const snapshot = await fetcher(clientSlug);
          send("snapshot", snapshot);
        } catch (err) {
          send("error", { message: err instanceof Error ? err.message : "Unknown error" });
        }
      };

      await poll();
      timers.push(
        setInterval(poll, intervalSeconds * 1000),
        setInterval(() => { if (!closed) controller.enqueue(encoder.encode(": keep-alive\n\n")); }, 15000)
      );
    },
    cancel() {
      closed = true;
      for (const t of timers) clearInterval(t);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

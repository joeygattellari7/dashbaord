import { fetchAccountSnapshot } from "@/lib/meta";
import { getClients } from "@/lib/clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const intervalSeconds = Number(process.env.METRICS_POLL_INTERVAL_SECONDS) || 300;
  const encoder = new TextEncoder();
  let closed = false;
  const activeTimers: ReturnType<typeof setInterval>[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const poll = async () => {
        try {
          const clients = getClients();
          const snapshots = await Promise.all(
            clients.map(async (client) => ({
              client,
              snapshot: await fetchAccountSnapshot(client.metaAdAccountId),
            }))
          );
          send("snapshot", { clients: snapshots });
        } catch (err) {
          send("error", { message: err instanceof Error ? err.message : "Unknown error" });
        }
      };

      await poll();
      const timer = setInterval(poll, intervalSeconds * 1000);

      const keepAlive = setInterval(() => {
        if (!closed) controller.enqueue(encoder.encode(`: keep-alive\n\n`));
      }, 15000);

      activeTimers.push(timer, keepAlive);
    },
    cancel() {
      closed = true;
      for (const t of activeTimers) clearInterval(t);
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

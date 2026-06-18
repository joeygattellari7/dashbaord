import { NextResponse } from "next/server";
import { fetchAccountSnapshot } from "@/lib/meta";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await fetchAccountSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

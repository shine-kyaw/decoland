/*
  POST /api/track — counts one page view (see lib/analytics.ts).
  Sent with navigator.sendBeacon from components/PageViewBeacon.tsx.
  Always answers 204 quickly; failures are logged, never shown to visitors.
*/
import { getCms, isCmsEnabled } from "@/lib/payload";
import { cleanPath, isBot, recordView } from "@/lib/analytics";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isCmsEnabled() || isBot(req.headers.get("user-agent"))) return new Response(null, { status: 204 });
  try {
    const body = JSON.parse(await req.text()) as { path?: unknown };
    const path = cleanPath(body.path);
    if (path) await recordView((await getCms())!, path);
  } catch (err) {
    console.error("[track] failed", err);
  }
  return new Response(null, { status: 204 });
}

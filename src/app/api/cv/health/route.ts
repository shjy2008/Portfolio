import { getModalBase, getModalHeaders } from '../../../../../lib/server/modal';

export async function GET() {
  try {
    const modalBase = getModalBase();
    const extraHeaders = getModalHeaders();
    const upstream = await fetch(`${modalBase}/api/cv/health`, { headers: { ...extraHeaders } });

    if (!upstream.ok) {
      return new Response('Upstream health check failed', { status: 502 });
    }

    const text = await upstream.text();
    return new Response(text, { status: 200 });
  } catch {
    return new Response('Upstream unreachable', { status: 502 });
  }
}

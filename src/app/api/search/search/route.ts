import {
  createInitializingResponse,
  getModalSearchBase,
  getModalHeaders,
  isLikelyModelInitializing,
} from '../../../../../lib/server/modal';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const modalBase = getModalSearchBase();
    const extraHeaders = getModalHeaders();
    const upstream = await fetch(`${modalBase}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...extraHeaders },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      if (isLikelyModelInitializing(upstream.status, text)) {
        return createInitializingResponse('The search engine');
      }

      return new Response(text, { status: upstream.status });
    }

    const data = await upstream.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upstream request failed';
    if (isLikelyModelInitializing(502, message)) {
      return createInitializingResponse('The search engine');
    }

    return Response.json({ error: message }, { status: 502 });
  }
}

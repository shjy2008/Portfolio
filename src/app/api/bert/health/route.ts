import {
  createInitializingResponse,
  getModalBertBase,
  getModalHeaders,
  isLikelyModelInitializing,
} from '../../../../../lib/server/modal';

export async function GET() {
  try {
    const modalBase = getModalBertBase();
    const extraHeaders = getModalHeaders();
    const upstream = await fetch(`${modalBase}/api/bert/health`, { headers: { ...extraHeaders } });

    if (!upstream.ok) {
      const text = await upstream.text();
      if (isLikelyModelInitializing(upstream.status, text)) {
        return createInitializingResponse('The sentiment model');
      }

      return Response.json(
        { code: 'UPSTREAM_HEALTH_FAILED', message: 'Upstream health check failed' },
        { status: 502 }
      );
    }

    const text = await upstream.text();
    return new Response(text, { status: 200 });
  } catch {
    return createInitializingResponse('The sentiment model');
  }
}

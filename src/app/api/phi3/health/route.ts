import {
  createInitializingResponse,
  getModalPhi3Base,
  getModalHeaders,
  isLikelyModelInitializing,
} from '../../../../../lib/server/modal';

export async function GET() {
  try {
    const modalBase = getModalPhi3Base();
    const extraHeaders = getModalHeaders();
    const upstream = await fetch(`${modalBase}/api/phi3/health`, { headers: { ...extraHeaders } });

    if (!upstream.ok) {
      const text = await upstream.text();
      if (isLikelyModelInitializing(upstream.status, text)) {
        return createInitializingResponse('The Medical QA model');
      }

      return Response.json(
        { code: 'UPSTREAM_HEALTH_FAILED', message: 'Upstream health check failed' },
        { status: 502 }
      );
    }

    const text = await upstream.text();
    return new Response(text, { status: 200 });
  } catch {
    return createInitializingResponse('The Medical QA model');
  }
}

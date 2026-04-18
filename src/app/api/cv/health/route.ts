import {
  createInitializingResponse,
  getModalCvBase,
  getModalHeaders,
  isLikelyModelInitializing,
} from '../../../../../lib/server/modal';

export async function GET() {
  try {
    const modalBase = getModalCvBase();
    const extraHeaders = getModalHeaders();
    const upstream = await fetch(`${modalBase}/api/cv/health`, { headers: { ...extraHeaders } });

    if (!upstream.ok) {
      const text = await upstream.text();
      if (isLikelyModelInitializing(upstream.status, text)) {
        return createInitializingResponse('The computer vision service');
      }

      return Response.json(
        { code: 'UPSTREAM_HEALTH_FAILED', message: 'Upstream health check failed' },
        { status: 502 }
      );
    }

    const text = await upstream.text();
    return new Response(text, { status: 200 });
  } catch {
    return createInitializingResponse('The computer vision service');
  }
}

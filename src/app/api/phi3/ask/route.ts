import {
  createInitializingResponse,
  getModalPhi3Base,
  getModalHeaders,
  isLikelyModelInitializing,
} from '../../../../../lib/server/modal';

export async function POST(request: Request) {
  try {
    const modalBase = getModalPhi3Base();
    const extraHeaders = getModalHeaders();
    const body = await request.json();

    const upstream = await fetch(`${modalBase}/api/phi3/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      if (isLikelyModelInitializing(upstream.status, text)) {
        return createInitializingResponse('The Medical QA model');
      }

      return Response.json(
        { code: 'UPSTREAM_INFERENCE_FAILED', message: 'Upstream inference failed' },
        { status: 502 }
      );
    }

    if (!upstream.body) {
      return Response.json(
        { code: 'UPSTREAM_INFERENCE_FAILED', message: 'No body returned from upstream' },
        { status: 502 }
      );
    }

    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return Response.json(
      { code: 'INTERNAL_SERVER_ERROR', message: error.message },
      { status: 500 }
    );
  }
}

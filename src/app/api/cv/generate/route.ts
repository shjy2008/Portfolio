import { getModalBase, getModalHeaders } from '../../../../../lib/server/modal';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') ?? 'gif';
  const batchSize = searchParams.get('batch_size') ?? '1';

  try {
    const modalBase = getModalBase();
    const extraHeaders = getModalHeaders();
    const url = `${modalBase}/api/cv/generate?format=${encodeURIComponent(format)}&batch_size=${encodeURIComponent(batchSize)}`;
    const upstream = await fetch(url, { method: 'GET', headers: { ...extraHeaders } });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(text, { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const buffer = await upstream.arrayBuffer();
    return new Response(buffer, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upstream request failed';
    return Response.json({ error: message }, { status: 502 });
  }
}

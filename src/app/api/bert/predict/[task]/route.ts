import { getModalBertBase, getModalHeaders } from '../../../../../../lib/server/modal';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ task: string }> }
) {
  try {
    const { task } = await params;
    const body = await request.json();

    const modalBase = getModalBertBase();
    const extraHeaders = getModalHeaders();
    const upstream = await fetch(`${modalBase}/api/bert/predict/${task}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...extraHeaders },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(text, { status: upstream.status });
    }

    const data = await upstream.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upstream request failed';
    return Response.json({ error: message }, { status: 502 });
  }
}

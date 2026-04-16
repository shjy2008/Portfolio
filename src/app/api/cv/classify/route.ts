import { getModalCvBase, getModalHeaders } from '../../../../../lib/server/modal';

export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const fileEntry = incoming.get('file');

    if (!(fileEntry instanceof File)) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const formData = new FormData();
    formData.set('file', fileEntry, fileEntry.name || 'upload.jpg');

    const modalBase = getModalCvBase();
    const extraHeaders = getModalHeaders();
    const upstream = await fetch(`${modalBase}/api/cv/classify`, {
      method: 'POST',
      body: formData,
      headers: { ...extraHeaders },
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
